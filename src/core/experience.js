const exp = {
    /**
     * Determine the current raw multiplier to EXP production, 
     * before any challenges / nerfs.
     * @return {Number} The raw multiplier to EXP production.
     */
    unmodifiedMultiplier() {
        let multiplier = 
            game.ch_boost[0] *
            game.ch_boost[1] *
            game.ch_boost[2] *
            game.ch_boost[3] *
            game.ch_boost[4] *
            game.ch_boost[5] *
            game.ch_boost[6] *
            game.ch_boost[7] *
            game.ch_boost[8] *
            game.helium_boost;
        
        if (game.challenge === 7) return multiplier;

        multiplier *= 
            game.exp_fact *
            overclocker.effect *
            game.exp_flux *
            game.pp_power *
            game.prestige_power *
            game.depth_power *
            game.ach_power *
            game.speed_power *
            game.superspeed_power *
            game.dark_matter_boost *
            game.infusion;

        return multiplier;
    },

    // TODO: Make a challenge module/namespace address this. 
    /**
     * Determine the nerf to EXP production caused by the current challenge.
     * @return {Number} A multiplier to EXP production based on 
     * the current challenge's nerfs.
     */
    challengeReduction() {
        switch (game.challenge) {
        case 5:
            return Math.min(
                (1 - game.prestige_time / (30 * game.tickspeed)) ** 4, 
                0
            );
        case 6:
            if (game.dk_bought[3] && game.completions[5] >= 12)
                return 10 ** (-6 * (game.completions[5] - 11));
            else return 1e-12;
        case 9:
            return 1e-16;
        default: 
            return 1;
        }
    },
    
    /**
     * Determine the current multiplier to EXP production.
     * @return {Number} The total multiplier to EXP production.
     */
    multiplier() {
        const unmodifiedMultiplier = exp.unmodifiedMultiplier();
        const challengeReduction = exp.challengeReduction();
        const omegaChallengeReduction = exp.omegaChallengeReduction();
        return unmodifiedMultiplier * challengeReduction * omegaChallengeReduction;
    },

    // TODO: Figure out what other thing should address this.
    /**
     * Determine the nerf to EXP production caused by the Omega Challenge.
     * @return {Number} A multiplier to EXP production based on 
     * the Omega challenge's nerfs.
     */
    omegaChallengeReduction() {
        if (!game.omega_challenge) return 1;
        if (game.challenge === 7) {
            return 1 / Math.sqrt(
                (game.exp_add + game.exp_fluct / 2) *
                game.global_multiplier *
                game.exp_battery
            );
        }
        return 1 / Math.sqrt(game.exp_add * game.global_multiplier);
    },

    /**
     * Determine the production per second before reduction from the EXP capacitor.
     * @returns {Number}
     */
    per_second_base() {
        const eps = (game.exp_add + exp_fluct / 2) * exp.multiplier() * game.cps;
        if (game.battery_mode === 1 || game.perks[8]) return eps * game.exp_battery;
        return eps;
    },

    // TODO: determine if this function should be 
    // moved to some automation category.
    /**
     * Incrment EXP based on the number of autoclickers and multipliers.
     */
    autoclick() {
        game.click_time += game.cps / delta_time;
        if (game.click_time < 1) return;

        const clicks = Math.floor(game.click_time);
        game.click_time -= clicks;

        // TODO: come up with a better name for this variable.
        let exp_add_factor = game.exp_add;
        let increment_amount = game.global_multiplier * clicks;

        if (game.challenge !== 7) {
            exp_add_factor += fluct_increment(game.exp_fluct);
            increment_amount *= game.cap_boost;
            if (game.battery_mode === 1 || game.perks[8]) {
                increment_amount *= game.exp_battery;
            }
        }

        increment_amount *= exp_add_factor;

        increment(increment_amount);
    },
};