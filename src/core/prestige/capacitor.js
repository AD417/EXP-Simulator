
const capacitor = {
    /** MODE_OFF */
    MODE_OFF: 0,
    /** 25% */
    MODE_25: 1,
    /** 50% */
    MODE_50: 2,
    /** 75% */
    MODE_75: 3,
    /** 100% */
    MODE_100: 4,

    AUTO_OFF: 0,
    AUTO_ON: 1,
    AUTO_SMART: 2,

    /**
     * Debug: human-readable values.
     */
    human_readable: ["off", "25%", "50%", "75%", "100%"],

    /**
     * The mode that the capacitor drains EXP at, assuming it is/was enabled.
     * @returns {Number}
     */
    active_mode() {
        return game.cap_mode || game.prev_mode;
    },

    /**
     * Whether the capacitor's automation is unlocked.
     * @returns {Boolean}
     */
    automation_unlocked() {
        return (
            game.pp_bought[35] || 
            (game.pp_bought[32] && game.perks[9])
        );
    },

    /**
     * Whether the capacitor can discharge.
     * @returns {Boolean}
     */
    can_discharge() {
        return (
            // The amount of nesting of functions is probably detrimental. 
            this.is_charging &&
            (game.pp_bought[38] || game.stored_exp >= game.tickspeed)
        );
    },

    /**
     * The multiplier from the capacitor's effect to base EXP production.
     * @returns {number}
     */
    get base_factor() {
        return 1 - this.current_mode() * 0.25;
    },


    get discharge_factor() {
        const mode = this.active_mode();
        if (game.perks[9]) return mode * 4;
        return mode * 2;
    },

    /**
     * Whether the capacitor is currently charging.
     * @returns {Boolean}
     */
    get is_charging() {
        return (game.cap_mode !== this.MODE_OFF && this.unlocked);
    },

    /**
     * The current charge mode the capacitor uses; 0 = not charging.
     * @returns {Number}
     */
    current_mode() {
        // I'd prefer to not have these objects actually store any values.
        return game.cap_mode;
    },

    /**
     * Discharge the this.
     */
    discharge() {
        console.log("Discharging at " + this.human_readable[this.active_mode()]);
        // if (!this.can_discharge) return;
        let exp_per_second = 
            (game.exp_add + game.exp_fluct / 2) *
            game.global_multiplier *
            game.cps *
            this.active_mode() *
            2;
        
        if (game.battery_mode === 1 || game.perks[8]) exp_per_second *= 2;
        if (game.perks[9]) exp_per_second *= 2;

        increment(game.stored_exp / game.tickspeed * exp_per_second);
        game.stored_exp = 0;

        if (overclocker.is_boosting) new Achievement(61).unlock();
    },

    /**
     * The highest unlocked mode.
     */
    get highest_mode() {
        if (game.pp_bought[38]) return this.MODE_100;
        if (game.pp_bought[37]) return this.MODE_75;
        if (game.pp_bought[35]) return this.MODE_50;
        if (game.pp_bought[32]) return this.MODE_25;
        return this.MODE_OFF;
    },

    /**
     * Display capacitor information.
     */
    render() {
        if (!this.unlocked) return;
        const base_exp_per_second = exp.per_second_base();
        const base_exp_display = `Base EXP Production: ${
            format_num(base_exp_per_second)
        } EXP/sec`;
        const effective_exp_display = `Effective EXP Production: ${
            format_num(base_exp_per_second * this.base_factor)
        } EXP/sec`;
        let stored_time_display = `Stored EXP: ${
            format_time(this.stored_time())
        } of EXP`;
        if (game.stored_exp >= 300 * game.tickspeed && game.notation !== 8) {
            stored_time_display = "Stored EXP: 5:00 of EXP (MAX)";
        }
        let if_discharge_display = `If discharged: +${
            format_num(
                game.stored_exp / game.tickspeed *
                exp_per_second * 
                this.discharge_factor
            )
        } EXP (${
            format_num(this.discharge_factor)
        }x)`;
        if (this.active_mode() === this.MODE_OFF) 
            if_discharge_display = `If discharged: +${format_num(0)} EXP (Not Active)`;

        document.getElementById("cap_stats").innerHTML = 
            `${
                base_exp_display
            }<br>${
                effective_exp_display
            }<br>${
                stored_time_display
            }<br>${
                if_discharge_display
            }`;

        if (this.current_mode() > this.MODE_OFF || !this.can_discharge()) return;

        const discharge_button = document.getElementById("discharge_button");

        discharge_button.className = "button ready";
        if (meme) discharge_button.disabled = false;
        else {
            discharge_button.style.color = (
                game.level > 60 ?
                    get_color(Math.floor(game.level / 10)) :
                    get_color((Math.floor(game.level / 60) + 5) % 12)
            );
        }

    },

    /**
     * Change the mode of the capacitor, and update the UI to match.
     * @param {Number} new_mode The new mode to set the capacitor to.
     */
    set_mode_to(new_mode) {
        console.log("New Mode is: " + this.human_readable[new_mode]);
        if (!this.unlocked) return;
        if (
            new_mode !== this.MODE_OFF && 
            this.active_mode() !== new_mode
        ) {
            // TODO: make discharge use prev_mode instead of cap_mode.
            // game.cap_mode = game.prev_mode;
            this.discharge();
            game.cap_mode = game.prev_mode;
        }

        game.cap_mode = new_mode;
        game.cap_boost = 1 - 0.25 * new_mode;

        const mode_ids = ["off", "25", "50", "75", "100"];
        const mode_id = `cap_${mode_ids[new_mode]}`;

        // NOTE: I believe that this code only needs to care about the last
        // mode, not all of them. It's safee, so I won't bothrer changing it.. 
        for (const button_id of mode_ids) {
            document.getElementById(`cap_${button_id}`).className = "button";
        }

        document.getElementById(mode_id).className = "button mode_active";
    },

    /**
     * Determine if the capacitor should discharge automatically. 
     * @returns {Boolean}
     */
    should_auto_discharge() {
        if (!this.can_discharge() || !this.automation_unlocked()) return false;
        if (game.autods_toggle === this.AUTO_OFF) return false;
        if (game.autods_toggle === this.AUTO_ON) {
            return (game.stored_exp >= game.autods_goal * game.tickspeed);
        }

        // TODO: determine how prestige automation works here, or doesn't.
        // Trivial logic. 
        if (!game.autopr_toggle) return true;
        
        game.smartds_oc = this.should_consider_overclocker();

        return (overclocker.is_boosting || !game.smartds_oc);
    },

    /**
     * Determine if the "smart" mode of the capacitor should consider 
     * whether the overclocker is currently boosting.
     * @returns {Boolean}
     */
    should_consider_overclocker() {
        if (game.perks[20]) return false;

        switch (game.autopr_mode) {
        case 0: 
        case 1:
        case 4:
        default:
            return false;
        case 2:
            return (
                game.amp >= game.smartpr_amp || 
                game.smartpr_pp >= overclocker.cycle_time()
            );
        case 3:
            return (game.autopr_goal[3] >= overclocker.cycle_time());
        }
    },

    stored_time() {
        return game.stored_exp;
    },

    /**
     * Process capacitor logic for this tick. 
     */
    tick() {
        game.stored_exp = Math.min(
            300 * game.tickspeed, 
            game.stored_exp + 1 - this.base_factor
        );

        if (this.should_auto_discharge()) this.discharge();
        this.render();


    },

    /**
     * Whether the overclocker is unlocked.
     * @returns {Boolean}
     */
    get unlocked() {
        return !([1,7,9].includes(game.challenge)) && game.pp_bought[32];
    }
};