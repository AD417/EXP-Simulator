// TODO: determine if this is a naming conflict. (It isn't.)

/**
* Achievement handler. Awards achievements, and checks situations where 
* a single resource / event is responsible for multiple achievements.
*/
const achievements = {
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
    award: (achievement_id) => {
        if (achievements.has(achievement_id)) return;
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
    check_autoclickers: () => {
        if (game.cps >=   30) achievements.award(53);
        if (game.cps >=  150) achievements.award(54);
        if (game.cps >= 1000) achievements.award(55);
    },

    /** 
    * Check if new AMP / Amplification Point milestones have been reached. 
    */
    check_amp: () => {
        if (game.amp >=  100) achievements.award(36);
        if (game.amp >=  1e4) achievements.award(37);
        if (game.amp >=  1e6) achievements.award(38);
        if (game.amp >=  1e8) achievements.award(39);
        if (game.amp >= 1e10) achievements.award(40);
        if (game.amp >= 1e12) achievements.award(41);
        if (game.amp >= 1e14) achievements.award(42);

        if (game.amp >= 1e16) achievements.award(71);
        if (game.amp >= 1e18) achievements.award(81);
        if (game.amp >= 1e20) achievements.award(94);
        if (game.amp >= 1e24) achievements.award(103);
        if (game.amp >= 1e28) achievements.award(117);
        if (game.amp >= 1e32) achievements.award(133);
    },

    /** 
    * Check if new challenge completion milestones have been reached. 
    */
    check_challenge_completions: () => {
        let total_completions = 0;
        for (let i = 0; i < 9; i++) {
            total_completions += game.completions[i];
        }

        if (total_completions >=  27) achievements.award(91);
        if (total_completions >=  54) achievements.award(113);
        if (total_completions >= 108) achievements.award(114);
        if (total_completions >= 180) achievements.award(159);
    },

    /** 
    * Check if new EXP / Experience milestones have been reached. 
    */
    check_exp: () => {
        if (game.all_time_exp >=   1e6) achievements.award(19);
        if (game.all_time_exp >=   1e9) achievements.award(20);
        if (game.all_time_exp >=  1e12) achievements.award(21);
        if (game.all_time_exp >=  1e15) achievements.award(22);
        if (game.all_time_exp >=  1e18) achievements.award(23);
        if (game.all_time_exp >=  1e21) achievements.award(24);
        if (game.all_time_exp >=  1e24) achievements.award(25);
        if (game.all_time_exp >=  1e27) achievements.award(26);
        if (game.all_time_exp >=  1e30) achievements.award(27);
        if (game.all_time_exp >=  1e33) achievements.award(28);
        if (game.all_time_exp >=  1e36) achievements.award(29);
        if (game.all_time_exp >=  1e39) achievements.award(30);

        if (game.all_time_exp >=  1e42) achievements.award(70);
        if (game.all_time_exp >=  1e45) achievements.award(79);
        if (game.all_time_exp >=  1e48) achievements.award(80);
        if (game.all_time_exp >=  1e51) achievements.award(93);
        if (game.all_time_exp >=  1e57) achievements.award(96);
        if (game.all_time_exp >=  1e63) achievements.award(99);
        if (game.all_time_exp >=  1e75) achievements.award(100);
        if (game.all_time_exp >=  1e87) achievements.award(101);
        if (game.all_time_exp >=  1e99) achievements.award(102);
        if (game.all_time_exp >= 1e111) achievements.award(118);
        if (game.all_time_exp >= 1e123) achievements.award(132);
        if (game.all_time_exp >= 1e138) achievements.award(134);
        if (game.all_time_exp >= 1e153) achievements.award(138);
        if (game.all_time_exp >= 1e183) achievements.award(146);
        if (game.all_time_exp >= 1e228) achievements.award(152);
        if (game.all_time_exp >= 1e303) achievements.award(153);
    },

    /** 
    * Check if new LVL / Level milestones have been reached. 
    */
    check_level: () => {
        if (game.level >=      2) achievements.award(0);
        if (game.level >=     10) achievements.award(1);
        if (game.level >=     30) achievements.award(2);
        if (game.level >=     60) achievements.award(3);
        if (game.level >=    100) achievements.award(4);
        if (game.level >=    200) achievements.award(5);
        if (game.level >=    300) achievements.award(6);
        if (game.level >=    500) achievements.award(7);
        if (game.level >=   1000) achievements.award(8);
        if (game.level >=   2000) achievements.award(9);
        if (game.level >=   3000) achievements.award(10);
        if (game.level >=   6000) achievements.award(11);
        if (game.level >=  12000) achievements.award(12);

        if (game.level >=  18000) achievements.award(77);
        if (game.level >=  24000) achievements.award(95);
        if (game.level >=  30000) achievements.award(97);
        if (game.level >=  40000) achievements.award(98);
        if (game.level >=  50000) achievements.award(115);
        if (game.level >=  60000) achievements.award(116);
        if (game.level >=  80000) achievements.award(130);
        if (game.level >= 100000) achievements.award(131);
        if (game.level >= 150000) achievements.award(135);
        if (game.level >= 200000) achievements.award(137);
        if (game.level >= 300000) achievements.award(145);
        if (game.level >= 500000) achievements.award(149);
        if (game.level >= 750000) achievements.award(150);
        if (game.level >= 1.00e6) achievements.award(151);
    },

    /** 
    * Check if new Omega Level milestones have been reached. 
    */
    check_omega_level: () => {
        if (game.omega_level >=  1) achievements.award(162);
        if (game.omega_level >= 10) achievements.award(163);
        if (game.omega_level >= 30) achievements.award(164);
    },

    /** 
    * Check if new Prestige Count milestones have been reached. 
    */
    check_prestige_count: () => {
        const total_prestiges = game.prestige + game.banked_prestige;

        if (total_prestiges >=   1) achievements.award(13);
        if (total_prestiges >=  10) achievements.award(14);
        if (total_prestiges >= 100) achievements.award(15);
        if (total_prestiges >= 1e3) achievements.award(16);
        if (total_prestiges >= 1e4) achievements.award(17);
        if (total_prestiges >= 1e5) achievements.award(18);
        if (total_prestiges >= 1e6) achievements.award(78);
    },

    /** 
    * Check if new Prism Level milestones have been reached. 
    */
    check_prism_level: () => {
        if (game.prism_level >=   1) achievements.award(126);
        if (game.prism_level >=  10) achievements.award(127);
        if (game.prism_level >=  30) achievements.award(125);
        if (game.prism_level >= 100) achievements.award(141);
        if (game.prism_level >= 200) achievements.award(161);
    },

    /** 
    * Check if new Quantize count milestones have been reached. 
    */
    check_quantum_count: () => {
        if (game.quantum >=    1) achievements.award(120);
        if (game.quantum >=    3) achievements.award(121);
        if (game.quantum >=    5) achievements.award(122);
        if (game.quantum >=   10) achievements.award(123);
        if (game.quantum >=   25) achievements.award(124);

        if (game.quantum >=   50) achievements.award(139);
        if (game.quantum >=  100) achievements.award(140);
        if (game.quantum >= 1000) achievements.award(160);
    },

    /** 
    * Check if new Quantize speedrun milestones have been reached. 
    */
    check_quantum_speed: () => {
        if (game.fastest_quantize <= game.tickspeed * 3600)
            achievements.award(128);
        if (game.fastest_quantize <= game.tickspeed * 300)
            achievements.award(129);
        if (game.fastest_quantize <= game.tickspeed * 60)
            achievements.award(136);
        if (game.fastest_quantize <= game.tickspeed * 30)
            achievements.award(142);
        if (game.fastest_quantize <= game.tickspeed * 10)
            achievements.award(147);
        
    },

    /** 
    * Check if new Reboot count milestones have been reached. 
    */
    check_reboot_count: () => {
        if (game.reboot >=   1) achievements.award(56);
        if (game.reboot >=   3) achievements.award(57);
        if (game.reboot >=   5) achievements.award(58);
        if (game.reboot >=  10) achievements.award(59);

        if (game.reboot >=  25) achievements.award(72);
        if (game.reboot >=  50) achievements.award(73);
        if (game.reboot >= 100) achievements.award(82);
        if (game.reboot >= 1e3) achievements.award(83);
    },

    /** 
    * Check if new Reboot speed milestones have been reached. 
    */
    check_reboot_speed: () => {
        if (game.fastest_reboot < 3600 * game.tickspeed)
            achievements.award(60);
        if (game.fastest_reboot < 600 * game.tickspeed)
            achievements.award(74);
        if (game.fastest_reboot < 60 * game.tickspeed)
            achievements.award(84);
        if (game.fastest_reboot < 1 * game.tickspeed)
            achievements.award(85);
        
    },

    /** 
    * Check if new time played milestones have been reached. 
    */
    check_playtime: () => {
        if (game.all_time >= 3600 * game.tickspeed) 
            achievements.award(31);
        if (game.all_time >= 21600 * game.tickspeed) 
            achievements.award(32);
        if (game.all_time >= 86400 * game.tickspeed) 
            achievements.award(33);
        if (game.all_time >= 259200 * game.tickspeed) 
            achievements.award(34);
        if (game.all_time >= 604800 * game.tickspeed) 
            achievements.award(35);
        
    }
};