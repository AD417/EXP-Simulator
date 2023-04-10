const overclocker = {
    RECHARGING: 0,
    STANDBY: 1,
    BOOSTING: 2,
    
    /**
     * Set the overclocker to boost EXP production.
     */
    activate: () => {
        if (!overclocker.unlocked) return;
        game.oc_state = overclocker.BOOSTING;
        game.oc_time = overclocker.boost_time();
        // game.exp_oc = overclocker.effect;   
        
        document.getElementById("oc_state").innerHTML =
            "Boosting " + format_num(overclocker.effect) + "x"
        document.getElementById("oc_button").style.display = "none"
        document.getElementById("oc_timer").style.display = "block"
        if (!meme)
            document.getElementById("oc_progress").style.background = "#ff7f00"

    },

    /**
     * Determine 
     */
    get automated() {
        return overclocker.unlocked && 
                game.autooc_toggle && 
                game.pp_bought[16];
    },

    /** 
    * Determine how long the overclocker should boost EXP production.
    * @return {Number} The number of ticks the overclocker should boost for.
    */
    boost_time: () => {
        let time = 45 * game.tickspeed;
        if (game.pp_bought[21]) time *= 2;
        // TODO: it's possible for the boost to be infinite.
        // Add it here?
        return time;
    },

    /** 
    * Determine if the overclocker is currently boosting EXP production.
    * @return {Boolean} Whether the overclocker is boosting EXP production.
    */
    get is_boosting() { 
        return game.oc_state === overclocker.BOOSTING; 
    },

    /** 
    * Determine the current effect of the overclocker's boost.
    * @return {Number} The effect of the overclocker on EXP production.
    */
    get effect() {
        if (!overclocker.unlocked || !overclocker.is_boosting) return 1;
        if (game.pp_bought[23]) return 5;
        if (game.pp_bought[19]) return 4;
        return 3;
    },

    /** 
    * Determine how long the overclocker should recharge before the next boost.
    * @return {Number} The number of ticks the overclocker should recharge.
    */
    recharge_time: () => {
        let time = 360 * game.tickspeed;
        if (game.pp_bought[26]) time /= 2;
        if (game.perks[5]) time /= 2;
        return time;
    },

    /** 
    * Handle the overclocker's behaviour for this tick.
    */
    tick: () => {
        if (!overclocker.unlocked) return;

        switch (game.oc_state) {
            case overclocker.RECHARGING:
                overclocker.tick_recharge();
                break;

            case overclocker.STANDBY: 
                if (overclocker.automated) overclocker.activate();
                break;

            case overclocker.BOOSTING:
                overclocker.tick_boost();
                break;
        }

        if (game.notation === 8) {
            document.getElementById("oc_progress").style.width = "100%"
        }

        if (game.perks[20]) {
            // game.oc_state = overclocker.BOOSTING;
            // document.getElementById("oc_state").innerHTML =
            //     "Boosting " + format_num(game.exp_oc) + "x"
            // document.getElementById("oc_button").style.display = "none"
            // document.getElementById("oc_timer").style.display = "block"
            // if (!meme)
            //     document.getElementById("oc_progress").style.background =
            //         "#ff7f00"
            overclocker.activate();
            document.getElementById("oc_auto").style.display = "none"
            document.getElementById("oc_progress").style.width = "100%"
            document.getElementById("oc_timer").innerHTML = "∞ Left"
        }
    },
    
    /** 
    * Handle the overclocker's behaviour for this tick if it is currently boosting.
    */
    tick_boost: () => {
        const boost_time = overclocker.boost_time();

        game.oc_time = Math.max(game.oc_time - 30 / delta_time, 0);

        if (game.oc_time === 0) {
            game.oc_state = overclocker.RECHARGING;
            document.getElementById("oc_state").innerHTML = "Recharging"
            if (!meme)
                document.getElementById("oc_progress").style.background = "#ff2f00"
        } else {
            document.getElementById("oc_timer").innerHTML =
                format_time(game.oc_time) + " Left"
            document.getElementById("oc_progress").style.width =
                `${(100 * game.oc_time) / boost_time}%`
        }
        
    },
    
    /** 
    * Handle the overclocker's behaviour for this tick if it is currently recharging.
    */
    tick_recharge: () => {
        const recharge_time = overclocker.recharge_time();
        const boost_time = overclocker.boost_time();

        game.oc_time += 30 / delta_time;
    
        document.getElementById("oc_timer").innerHTML = 
            format_time(recharge_time - game.oc_time) + " Left";
        document.getElementById("oc_progress").style.width = 
            `${(100 * game.oc_time) / recharge_time}%`;
        
        if (game.oc_time < recharge_time) return;
    
    
        game.oc_state = overclocker.STANDBY;
        game.oc_time = boost_time;
        document.getElementById("oc_button").style.display = "inline";
        document.getElementById("oc_state").innerHTML = "Standby";
        document.getElementById("oc_timer").style.display = "none";
    },

    /**
     * Toggle the overclocker automation.
     */
    toggle_automation: () => {
        game.autooc_toggle = !game.autooc_toggle;
        document.getElementById("oc_auto").innerHTML = 
            (game.autooc_toggle ? "ON" : "OFF");
        if (!meme) document.getElementById("oc_auto").style.color =
            (game.autooc_toggle ? "#00ff00" : "#ff0000");
    },

    /** 
    * Determine if the overclocker is currently unlocked.
    * @return {Boolean} Whether the overclocker is unlocked.
    */
    get unlocked() {
        disabled_by_challenge = [1, 7, 9].includes(game.challenge);
        return game.pp_bought[14] && !disabled_by_challenge;
    },
}