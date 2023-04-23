// TODO: determine if this is a naming conflict. (It isn't.)

/**
* Awards achievements, and checks situations where 
* a single resource / event is responsible for multiple this.
*/
const AchievementHandler = {
    /** 
    * Determine if an achievement has already been unlocked.
    * @param {Number} achievement_id - The id of the achievement to check.
    * @return {Boolean} Whether the achievement is unlocked or not.
    */
    // TODO: Use a bitmask!
    has: (achievement_id) => game.achievements[achievement_id],

    /** 
    * Award an achievement to the player. 
    * @param {Number} achievement_id - The id of the achievement to award.
    * Achievements will not be re-awarded.
    */
    award(achievement_id) {
        if (this.has(achievement_id)) return;
        game.achievements[achievement_id] = true;
        let true_id = 0;
        for (let i = 0; i < achievement.achievements.length; i++) {
            if (achievement.achievements[i].id === achievement_id) true_id = i;
        }
        if (document.visibilityState === "visible")
            new notify(achievement.achievements[true_id].name, "#00ff00");
        achievement.achievements[true_id].new = true;
        if (!meme) document.getElementById("achievements").style.color = "#00ff00";
    },

    /** 
    * Check if new autoclicker milestones have been reached. 
    */
    check_autoclickers() {
        if (game.cps >=   30) new Achievement(53).unlock();
        if (game.cps >=  150) new Achievement(54).unlock();
        if (game.cps >= 1000) new Achievement(55).unlock();
    },

    /** 
    * Check if new AMP / Amplification Point milestones have been reached. 
    */
    check_amp() {
        if (game.amp >=  100) new Achievement(36).unlock();
        if (game.amp >=  1e4) new Achievement(37).unlock();
        if (game.amp >=  1e6) new Achievement(38).unlock();
        if (game.amp >=  1e8) new Achievement(39).unlock();
        if (game.amp >= 1e10) new Achievement(40).unlock();
        if (game.amp >= 1e12) new Achievement(41).unlock();
        if (game.amp >= 1e14) new Achievement(42).unlock();

        if (game.amp >= 1e16) new Achievement(71).unlock();
        if (game.amp >= 1e18) new Achievement(81).unlock();
        if (game.amp >= 1e20) new Achievement(94).unlock();
        if (game.amp >= 1e24) new Achievement(103).unlock();
        if (game.amp >= 1e28) new Achievement(117).unlock();
        if (game.amp >= 1e32) new Achievement(133).unlock();
    },

    /** 
    * Check if new challenge completion milestones have been reached. 
    */
    check_challenge_completions() {
        let total_completions = 0;
        for (let i = 0; i < 9; i++) {
            total_completions += game.completions[i];
        }

        if (total_completions >=  27) new Achievement(91).unlock();
        if (total_completions >=  54) new Achievement(113).unlock();
        if (total_completions >= 108) new Achievement(114).unlock();
        if (total_completions >= 180) new Achievement(159).unlock();
    },

    /** 
    * Check if new EXP / Experience milestones have been reached. 
    */
    check_exp() {
        if (game.all_time_exp >=   1e6) new Achievement(19).unlock();
        if (game.all_time_exp >=   1e9) new Achievement(20).unlock();
        if (game.all_time_exp >=  1e12) new Achievement(21).unlock();
        if (game.all_time_exp >=  1e15) new Achievement(22).unlock();
        if (game.all_time_exp >=  1e18) new Achievement(23).unlock();
        if (game.all_time_exp >=  1e21) new Achievement(24).unlock();
        if (game.all_time_exp >=  1e24) new Achievement(25).unlock();
        if (game.all_time_exp >=  1e27) new Achievement(26).unlock();
        if (game.all_time_exp >=  1e30) new Achievement(27).unlock();
        if (game.all_time_exp >=  1e33) new Achievement(28).unlock();
        if (game.all_time_exp >=  1e36) new Achievement(29).unlock();
        if (game.all_time_exp >=  1e39) new Achievement(30).unlock();

        if (game.all_time_exp >=  1e42) new Achievement(70).unlock();
        if (game.all_time_exp >=  1e45) new Achievement(79).unlock();
        if (game.all_time_exp >=  1e48) new Achievement(80).unlock();
        if (game.all_time_exp >=  1e51) new Achievement(93).unlock();
        if (game.all_time_exp >=  1e57) new Achievement(96).unlock();
        if (game.all_time_exp >=  1e63) new Achievement(99).unlock();
        if (game.all_time_exp >=  1e75) new Achievement(100).unlock();
        if (game.all_time_exp >=  1e87) new Achievement(101).unlock();
        if (game.all_time_exp >=  1e99) new Achievement(102).unlock();
        if (game.all_time_exp >= 1e111) new Achievement(118).unlock();
        if (game.all_time_exp >= 1e123) new Achievement(132).unlock();
        if (game.all_time_exp >= 1e138) new Achievement(134).unlock();
        if (game.all_time_exp >= 1e153) new Achievement(138).unlock();
        if (game.all_time_exp >= 1e183) new Achievement(146).unlock();
        if (game.all_time_exp >= 1e228) new Achievement(152).unlock();
        if (game.all_time_exp >= 1e303) new Achievement(153).unlock();
    },

    /** 
    * Check if new LVL / Level milestones have been reached. 
    */
    check_level() {
        if (game.level >=      2) new Achievement(0).unlock();
        if (game.level >=     10) new Achievement(1).unlock();
        if (game.level >=     30) new Achievement(2).unlock();
        if (game.level >=     60) new Achievement(3).unlock();
        if (game.level >=    100) new Achievement(4).unlock();
        if (game.level >=    200) new Achievement(5).unlock();
        if (game.level >=    300) new Achievement(6).unlock();
        if (game.level >=    500) new Achievement(7).unlock();
        if (game.level >=   1000) new Achievement(8).unlock();
        if (game.level >=   2000) new Achievement(9).unlock();
        if (game.level >=   3000) new Achievement(10).unlock();
        if (game.level >=   6000) new Achievement(11).unlock();
        if (game.level >=  12000) new Achievement(12).unlock();

        if (game.level >=  18000) new Achievement(77).unlock();
        if (game.level >=  24000) new Achievement(95).unlock();
        if (game.level >=  30000) new Achievement(97).unlock();
        if (game.level >=  40000) new Achievement(98).unlock();
        if (game.level >=  50000) new Achievement(115).unlock();
        if (game.level >=  60000) new Achievement(116).unlock();
        if (game.level >=  80000) new Achievement(130).unlock();
        if (game.level >= 100000) new Achievement(131).unlock();
        if (game.level >= 150000) new Achievement(135).unlock();
        if (game.level >= 200000) new Achievement(137).unlock();
        if (game.level >= 300000) new Achievement(145).unlock();
        if (game.level >= 500000) new Achievement(149).unlock();
        if (game.level >= 750000) new Achievement(150).unlock();
        if (game.level >= 1.00e6) new Achievement(151).unlock();
    },

    /** 
    * Check if new Omega Level milestones have been reached. 
    */
    check_omega_level() {
        if (game.omega_level >=  1) new Achievement(162).unlock();
        if (game.omega_level >= 10) new Achievement(163).unlock();
        if (game.omega_level >= 30) new Achievement(164).unlock();
    },

    /** 
    * Check if new Prestige Count milestones have been reached. 
    */
    check_prestige_count() {
        const total_prestiges = game.prestige + game.banked_prestige;

        if (total_prestiges >=   1) new Achievement(13).unlock();
        if (total_prestiges >=  10) new Achievement(14).unlock();
        if (total_prestiges >= 100) new Achievement(15).unlock();
        if (total_prestiges >= 1e3) new Achievement(16).unlock();
        if (total_prestiges >= 1e4) new Achievement(17).unlock();
        if (total_prestiges >= 1e5) new Achievement(18).unlock();
        if (total_prestiges >= 1e6) new Achievement(78).unlock();
    },

    /** 
    * Check if new Prism Level milestones have been reached. 
    */
    check_prism_level() {
        if (game.prism_level >=   1) new Achievement(126).unlock();
        if (game.prism_level >=  10) new Achievement(127).unlock();
        if (game.prism_level >=  30) new Achievement(125).unlock();
        if (game.prism_level >= 100) new Achievement(141).unlock();
        if (game.prism_level >= 200) new Achievement(161).unlock();
    },

    /** 
    * Check if new Quantize count milestones have been reached. 
    */
    check_quantum_count() {
        if (game.quantum >=    1) new Achievement(120).unlock();
        if (game.quantum >=    3) new Achievement(121).unlock();
        if (game.quantum >=    5) new Achievement(122).unlock();
        if (game.quantum >=   10) new Achievement(123).unlock();
        if (game.quantum >=   25) new Achievement(124).unlock();

        if (game.quantum >=   50) new Achievement(139).unlock();
        if (game.quantum >=  100) new Achievement(140).unlock();
        if (game.quantum >= 1000) new Achievement(160).unlock();
    },

    /** 
    * Check if new Quantize speedrun milestones have been reached. 
    */
    check_quantum_speed() {
        if (game.fastest_quantize <= game.tickspeed * 3600)
            new Achievement(128).unlock();
        if (game.fastest_quantize <= game.tickspeed * 300)
            new Achievement(129).unlock();
        if (game.fastest_quantize <= game.tickspeed * 60)
            new Achievement(136).unlock();
        if (game.fastest_quantize <= game.tickspeed * 30)
            new Achievement(142).unlock();
        if (game.fastest_quantize <= game.tickspeed * 10)
            new Achievement(147).unlock();
        
    },

    /** 
    * Check if new Reboot count milestones have been reached. 
    */
    check_reboot_count() {
        if (game.reboot >=   1) new Achievement(56).unlock();
        if (game.reboot >=   3) new Achievement(57).unlock();
        if (game.reboot >=   5) new Achievement(58).unlock();
        if (game.reboot >=  10) new Achievement(59).unlock();

        if (game.reboot >=  25) new Achievement(72).unlock();
        if (game.reboot >=  50) new Achievement(73).unlock();
        if (game.reboot >= 100) new Achievement(82).unlock();
        if (game.reboot >= 1e3) new Achievement(83).unlock();
    },

    /** 
    * Check if new Reboot speed milestones have been reached. 
    */
    check_reboot_speed() {
        if (game.fastest_reboot < 3600 * game.tickspeed)
            new Achievement(60).unlock();
        if (game.fastest_reboot < 600 * game.tickspeed)
            new Achievement(74).unlock();
        if (game.fastest_reboot < 60 * game.tickspeed)
            new Achievement(84).unlock();
        if (game.fastest_reboot < 1 * game.tickspeed)
            new Achievement(85).unlock();
        
    },

    /** 
    * Check if new time played milestones have been reached. 
    */
    check_playtime() {
        if (game.all_time >= 3600 * game.tickspeed) 
            new Achievement(31).unlock();
        if (game.all_time >= 21600 * game.tickspeed) 
            new Achievement(32).unlock();
        if (game.all_time >= 86400 * game.tickspeed) 
            new Achievement(33).unlock();
        if (game.all_time >= 259200 * game.tickspeed) 
            new Achievement(34).unlock();
        if (game.all_time >= 604800 * game.tickspeed) 
            new Achievement(35).unlock();
        
    }
};