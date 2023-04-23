//function to increment exp and handle showing the results
function increment(num) {
    if (game.level < game.pr_min || game.pp_bought[6]) {
        if (game.total_exp + num < 1.7976931348622053 * 10 ** 308)
            game.total_exp += num;
        else game.total_exp = 1.7976931348622053 * 10 ** 308;

        if (game.prestige_exp + num < 1.7976931348622053 * 10 ** 308)
            game.prestige_exp += num;
        else game.prestige_exp = 1.7976931348622053 * 10 ** 308;

        if (game.reboot_exp + num < 1.7976931348622053 * 10 ** 308)
            game.reboot_exp += num;
        else game.reboot_exp = 1.7976931348622053 * 10 ** 308;

        if (game.all_time_exp + num < 1.7976931348622053 * 10 ** 308)
            game.all_time_exp += num;
        else game.all_time_exp = 1.7976931348622053 * 10 ** 308;

        let prev_level = game.level;

        if (game.total_exp <= 10) {
            game.level = 1;
        } else {
            game.level = get_level(game.total_exp);

            if (game.total_exp >= 1.7976931348622053 * 10 ** 308)
                game.level = 1000000;

            if (game.perks[27]) {
                if (
                    game.level > prev_level &&
                    game.level > game.highest_level
                ) {
                    if (prev_level > game.highest_level) {
                        game.pp += get_pp(game.level) - get_pp(prev_level);
                        game.total_pp += get_pp(game.level) - get_pp(prev_level);
                    } else {
                        game.pp +=
                            get_pp(game.level) - get_pp(game.highest_level);
                        game.total_pp +=
                            get_pp(game.level) - get_pp(game.highest_level);
                    }

                    if (
                        game.challenge !== 9 &&
                        !(
                            game.challenge === 4 &&
                            game.dk_bought[3] &&
                            game.completions[3] >= 12
                        )
                    )
                        game.highest_level = game.level;
                }
            }

            AchievementHandler.check_level();

            if (game.level >= 5 && !game.hold_notify) {
                new notify("Protip: you can hold the EXP button", "#ffc400");
                game.hold_notify = true;
            }
            if (game.level >= 30 && !game.halfway_notify) {
                new notify(
                    "Hang in there! Something happens at LVL 60...",
                    "#ffc400"
                );
                game.halfway_notify = true;
            }
        }

        AchievementHandler.check_exp();

        game.exp = game.total_exp - Math.ceil(get_exp(game.level - 1));
        game.goal = Math.ceil(get_exp(game.level) - get_exp(game.level - 1));
    }

    if (num > 0) game.afk_time = 0;
}

//generate random extra exp for fluctuation
function fluct_increment(max) {
    if (max === 0) {
        return 0;
    } else {
        return Math.floor(Math.random() * (max + 1));
    }
}

//special function for manual player clicks
function player_increment() {
    let legit = true;
    if (click_time !== undefined) {
        if (Date.now() - click_time >= 50) legit = true;
        else legit = false;
    }
    if (legit) {
        if (game.battery_mode === 0 || game.perks[8])
            increment(
                Math.round(
                    (game.exp_add + fluct_increment(game.exp_fluct)) *
                        game.ml_boost *
                        game.global_multiplier *
                        game.exp_battery
                )
            );
        else
            increment(
                Math.round(
                    (game.exp_add + fluct_increment(game.exp_fluct)) *
                        game.ml_boost *
                        game.global_multiplier
                )
            );
        game.clicks += 1;
        game.prestige_clicks += 1;
        game.reboot_clicks += 1;
        game.total_clicks += 1;
        click_time = Date.now();
    }
}

//give achievement
function get_achievement(id) {
    game.achievements[id] = true;
    let true_id = 0;
    for (let i = 0; i < achievement.achievements.length; i++) {
        if (achievement.achievements[i].id === id) true_id = i;
    }
    if (document.visibilityState === "visible")
        new notify(achievement.achievements[true_id].name, "#00ff00");
    achievement.achievements[true_id].new = true;
    if (!meme) document.getElementById("achievements").style.color = "#00ff00";
}

//purchasing upgrades
//and updating the text to match
function upgrade(id, max) {
    if (!max) {
        //single purchase
        switch (id) {
        case 0:
            //exp boost
            if (game.boost_level < game.pr_min || game.pp_bought[6]) {
                if (game.level >= game.boost_level) {
                    game.boost_tier += 1;
                    game.boost_level = game.boost_tier * 2 + 2;
                    if (game.challenge === 0) {
                        if (game.perks[21])
                            game.boost_level = Math.ceil(
                                game.boost_level * 0.5
                            );
                        else if (game.perks[6])
                            game.boost_level = Math.ceil(
                                game.boost_level * 0.75
                            );
                    }
                    if (game.challenge === 2 || game.challenge === 9)
                        game.boost_level = game.boost_level * 5;
                    game.exp_add =
                            (game.boost_tier +
                                game.starter_kit +
                                game.generator_kit +
                                1) *
                            game.amp;
                }
            }
            break;
        case 1:
            //autoclicker
            if (game.auto_level < game.pr_min || game.pp_bought[6]) {
                if (game.level >= game.auto_level) {
                    game.auto_tier += 1;
                    game.auto_level = game.auto_tier * 5;
                    if (game.challenge === 0) {
                        if (game.perks[21])
                            game.auto_level = Math.ceil(
                                game.auto_level * 0.5
                            );
                        else if (game.perks[6])
                            game.auto_level = Math.ceil(
                                game.auto_level * 0.75
                            );
                    }
                    if (game.challenge === 2 || game.challenge === 9)
                        game.auto_level = game.auto_level * 5;
                    game.cps =
                            2 *
                            (game.auto_tier +
                                game.starter_kit +
                                game.generator_kit);
                        
                    AchievementHandler.check_autoclickers();
                }
            }
            break;
        case 2:
            //exp fluctuation
            if (
                (game.fluct_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[0] &&
                    game.challenge !== 7
            ) {
                if (game.level >= game.fluct_level) {
                    game.fluct_tier += 1;
                    game.fluct_level = game.fluct_tier * 3 + 6;
                    if (game.challenge === 0) {
                        if (game.perks[21])
                            game.fluct_level = Math.round(
                                game.fluct_level * 0.5
                            );
                        else if (game.perks[6])
                            game.fluct_level = Math.round(
                                game.fluct_level * 0.75
                            );
                    }
                    if (game.challenge === 2 || game.challenge === 9)
                        game.fluct_level = game.fluct_level * 5;
                    if (!game.pp_bought[15])
                        game.exp_fluct =
                                (game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit) *
                                game.amp;
                    else
                        game.exp_fluct =
                                (game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit) *
                                game.amp *
                                2;
                }
            }
            break;
        case 3:
            //exp factor
            if (
                (game.fact_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[5] &&
                    game.challenge !== 7
            ) {
                if (game.level >= game.fact_level) {
                    game.fact_tier += 1;
                    if (game.fact_tier === 0) game.fact_level = 15;
                    else if (game.fact_tier <= 4)
                        game.fact_level = game.fact_tier * 30;
                    else game.fact_level = game.fact_tier * 60 - 120;
                    if (game.challenge === 0) {
                        if (game.perks[21])
                            game.fact_level = Math.round(
                                game.fact_level * 0.5
                            );
                        else if (game.perks[6])
                            game.fact_level = Math.round(
                                game.fact_level * 0.75
                            );
                    }
                    if (game.challenge === 2 || game.challenge === 9)
                        game.fact_level = game.fact_level * 5;
                    game.exp_fact =
                            game.fact_tier +
                            game.starter_kit +
                            game.generator_kit +
                            1;
                }
            }
            break;
        case 4:
            //exp flux
            if (
                (game.flux_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[20] &&
                    game.challenge !== 7
            ) {
                if (game.level >= game.flux_level) {
                    game.flux_tier += 1;
                    game.flux_level = game.flux_tier * 75 + 75;
                    if (game.challenge === 0) {
                        if (game.perks[21])
                            game.flux_level = Math.round(
                                game.flux_level * 0.5
                            );
                        else if (game.perks[6])
                            game.flux_level = Math.round(
                                game.flux_level * 0.75
                            );
                    }
                    if (game.challenge === 2 || game.challenge === 9)
                        game.flux_level = game.flux_level * 5;
                }
            }
            break;
        case 5:
            //exp battery
            if (
                (game.battery_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[25] &&
                    game.challenge !== 7
            ) {
                if (game.level >= game.battery_level) {
                    game.battery_tier += 1;
                    game.battery_level = game.battery_tier * 90 + 90;
                    if (game.challenge === 0) {
                        if (game.perks[21])
                            game.battery_level = Math.round(
                                game.battery_level * 0.5
                            );
                        else if (game.perks[6])
                            game.battery_level = Math.round(
                                game.battery_level * 0.75
                            );
                    }
                    if (game.challenge === 2 || game.challenge === 9)
                        game.battery_level = game.battery_level * 5;

                    if (!game.pp_bought[31])
                        game.exp_battery =
                                game.battery_tier +
                                game.starter_kit +
                                game.generator_kit +
                                1;
                    else if (!game.pp_bought[36])
                        game.exp_battery =
                                (game.battery_tier +
                                    game.starter_kit +
                                    game.generator_kit +
                                    1) *
                                3;
                    else
                        game.exp_battery =
                                (game.battery_tier +
                                    game.starter_kit +
                                    game.generator_kit +
                                    1) *
                                9;
                }
            }
            break;
        }
    } else {
        //bulk purchase
        switch (id) {
        case 0:
            //exp boost
            if (game.boost_level < game.pr_min || game.pp_bought[6]) {
                game.boost_tier = Math.floor(game.level / 2);
                game.boost_level = game.boost_tier * 2 + 2;
                if (game.challenge === 0) {
                    if (game.perks[21]) {
                        game.boost_tier = game.level;
                        game.boost_level = game.boost_tier + 1;
                    } else if (game.perks[6]) {
                        game.boost_tier = Math.floor(game.level / 1.5);
                        game.boost_level = Math.ceil(
                            game.boost_tier * 1.5 + 1.5
                        );
                    }
                }
                if (game.challenge === 2 || game.challenge === 9) {
                    game.boost_tier = Math.floor(game.level / 10);
                    game.boost_level = game.boost_tier * 10 + 10;
                }
                game.exp_add =
                        (game.boost_tier +
                            game.starter_kit +
                            game.generator_kit +
                            1) *
                        game.amp;
            }
            break;
        case 1:
            //autoclicker
            if (game.auto_level < game.pr_min || game.pp_bought[6]) {
                if (game.level < 3) {
                    game.auto_tier = 0;
                    game.auto_level = 3;
                } else if (game.level < 5) {
                    game.auto_tier = 1;
                    game.auto_level = 5;
                } else {
                    game.auto_tier = Math.floor(game.level / 5) + 1;
                    game.auto_level = game.auto_tier * 5;
                }
                if (game.challenge === 0) {
                    if (game.perks[21]) {
                        if (game.level < 2) {
                            game.auto_tier = 0;
                            game.auto_level = 2;
                        } else if (game.level < 3) {
                            game.auto_tier = 1;
                            game.auto_level = 3;
                        } else {
                            game.auto_tier =
                                    Math.floor(game.level / 2.5) + 1;
                            game.auto_level = Math.ceil(
                                game.auto_tier * 2.5
                            );
                        }
                    } else if (game.perks[6]) {
                        if (game.level < 3) {
                            game.auto_tier = 0;
                            game.auto_level = 3;
                        } else if (game.level < 4) {
                            game.auto_tier = 1;
                            game.auto_level = 4;
                        } else {
                            game.auto_tier =
                                    Math.floor(game.level / 3.75) + 1;
                            game.auto_level = Math.ceil(
                                game.auto_tier * 3.75
                            );
                        }
                    }
                }
                if (game.challenge === 2 || game.challenge === 9) {
                    if (game.level < 15) {
                        game.auto_tier = 0;
                        game.auto_level = 15;
                    } else if (game.level < 25) {
                        game.auto_tier = 1;
                        game.auto_level = 25;
                    } else {
                        game.auto_tier = Math.floor(game.level / 25) + 1;
                        game.auto_level = game.auto_tier * 25;
                    }
                }

                game.cps =
                        2 *
                        (game.auto_tier + game.starter_kit + game.generator_kit);
                    
                AchievementHandler.check_autoclickers();
            }
            break;
        case 2:
            //exp fluctuation
            if (
                (game.fluct_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[0] &&
                    game.challenge !== 7
            ) {
                if (game.level < 3) {
                    game.fluct_tier = 0;
                    game.fluct_level = 6;
                } else {
                    game.fluct_tier = Math.floor(game.level / 3) - 1;
                    game.fluct_level = game.fluct_tier * 3 + 6;
                }
                if (game.challenge === 0) {
                    if (game.perks[21]) {
                        if (game.level < 3) {
                            game.fluct_tier = 0;
                            game.fluct_level = 3;
                        } else {
                            game.fluct_tier =
                                    Math.floor(game.level / 1.5) - 1;
                            game.fluct_level = Math.ceil(
                                game.fluct_tier * 1.5 + 3
                            );
                        }
                    } else if (game.perks[6]) {
                        if (game.level < 5) {
                            game.fluct_tier = 0;
                            game.fluct_level = 5;
                        } else {
                            game.fluct_tier =
                                    Math.floor(game.level / 2.25) - 1;
                            game.fluct_level = Math.ceil(
                                game.fluct_tier * 2.25 + 4.5
                            );
                        }
                    }
                }
                if (game.challenge === 2 || game.challenge === 9) {
                    if (game.level < 30) {
                        game.fluct_tier = 0;
                        game.fluct_level = 30;
                    } else {
                        game.fluct_tier = Math.floor(game.level / 15) - 1;
                        game.fluct_level = game.fluct_tier * 15 + 30;
                    }
                }

                if (!game.pp_bought[15])
                    game.exp_fluct =
                            (game.fluct_tier +
                                game.starter_kit +
                                game.generator_kit) *
                            game.amp;
                else
                    game.exp_fluct =
                            (game.fluct_tier +
                                game.starter_kit +
                                game.generator_kit) *
                            game.amp *
                            2;
            }
            break;
        case 3:
            //exp factor
            if (
                (game.fact_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[5] &&
                    game.challenge !== 7
            ) {
                if (game.level < 15) {
                    game.fact_tier = 0;
                    game.fact_level = 15;
                } else if (game.level < 120) {
                    game.fact_tier = Math.floor(game.level / 30) + 1;
                    game.fact_level = game.fact_tier * 30;
                } else {
                    game.fact_tier = Math.floor(game.level / 60) + 3;
                    game.fact_level = game.fact_tier * 60 - 120;
                }
                if (game.challenge === 0) {
                    if (game.perks[21]) {
                        if (game.level < 8) {
                            game.fact_tier = 0;
                            game.fact_level = 8;
                        } else if (game.level < 60) {
                            game.fact_tier = Math.floor(game.level / 15) + 1;
                            game.fact_level = game.fact_tier * 15;
                        } else {
                            game.fact_tier = Math.floor(game.level / 30) + 3;
                            game.fact_level = game.fact_tier * 30 - 60;
                        }
                    } else if (game.perks[6]) {
                        if (game.level < 12) {
                            game.fact_tier = 0;
                            game.fact_level = 12;
                        } else if (game.level < 90) {
                            game.fact_tier =
                                    Math.floor(game.level / 22.5) + 1;
                            game.fact_level = Math.ceil(
                                game.fact_tier * 22.5
                            );
                        } else {
                            game.fact_tier = Math.floor(game.level / 45) + 3;
                            game.fact_level = game.fact_tier * 45 - 90;
                        }
                    }
                }
                if (game.challenge === 2 || game.challenge === 9) {
                    if (game.level < 75) {
                        game.fact_tier = 0;
                        game.fact_level = 75;
                    } else if (game.level < 600) {
                        game.fact_tier = Math.floor(game.level / 150) + 1;
                        game.fact_level = game.fact_tier * 150;
                    } else {
                        game.fact_tier = Math.floor(game.level / 300) + 3;
                        game.fact_level = game.fact_tier * 300 - 600;
                    }
                }
                game.exp_fact =
                        game.fact_tier +
                        game.starter_kit +
                        game.generator_kit +
                        1;
            }
            break;
        case 4:
            //exp flux
            if (
                (game.flux_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[20] &&
                    game.challenge !== 7
            ) {
                game.flux_tier = Math.floor(game.level / 75);
                game.flux_level = game.flux_tier * 75 + 75;
                if (game.challenge === 0) {
                    if (game.perks[21]) {
                        game.flux_tier = Math.floor(game.level / 37.5);
                        game.flux_level = Math.ceil(
                            game.flux_tier * 37.5 + 37.5
                        );
                    } else if (game.perks[6]) {
                        game.flux_tier = Math.floor(game.level / 56.25);
                        game.flux_level = Math.ceil(
                            game.flux_tier * 56.25 + 56.25
                        );
                    }
                }
                if (game.challenge === 2 || game.challenge === 9) {
                    game.flux_tier = Math.floor(game.level / 375);
                    game.flux_level = game.flux_tier * 375 + 375;
                }
            }
            break;
        case 5:
            //exp battery
            if (
                (game.battery_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[25] &&
                    game.challenge !== 7
            ) {
                game.battery_tier = Math.floor(game.level / 90);
                game.battery_level = game.battery_tier * 90 + 90;
                if (game.challenge === 0) {
                    if (game.perks[21]) {
                        game.battery_tier = Math.floor(game.level / 45);
                        game.battery_level = game.battery_tier * 45 + 45;
                    } else if (game.perks[6]) {
                        game.flux_tier = Math.floor(game.level / 67.5);
                        game.flux_level = Math.ceil(
                            game.flux_tier * 67.5 + 67.5
                        );
                    }
                }
                if (game.challenge === 2 || game.challenge === 9) {
                    game.flux_tier = Math.floor(game.level / 450);
                    game.flux_level = game.flux_tier * 450 + 450;
                }
                if (!game.pp_bought[31])
                    game.exp_battery =
                            game.battery_tier +
                            game.starter_kit +
                            game.generator_kit +
                            1;
                else if (!game.pp_bought[36])
                    game.exp_battery =
                            (game.battery_tier +
                                game.starter_kit +
                                game.generator_kit +
                                1) *
                            3;
                else
                    game.exp_battery =
                            (game.battery_tier +
                                game.starter_kit +
                                game.generator_kit +
                                1) *
                            9;
            }
            break;
        }
    }
}

//overclocker activation
/*
function oc_activate() {
    if (game.challenge !== 1 && game.challenge !== 9) {
        game.oc_state = 2
        game.exp_oc = 3
        if (game.pp_bought[19]) game.exp_oc = 4
        if (game.pp_bought[23]) game.exp_oc = 5
        document.getElementById("oc_state").innerHTML =
            "Boosting " + format_num(game.exp_oc) + "x"
        document.getElementById("oc_button").style.display = "none"
        document.getElementById("oc_timer").style.display = "block"
        document.getElementById("oc_progress").style.background = "#ff7f00"
    }
}
*/

//capacitance switching
function set_capacitance(mode) {
    if (game.challenge !== 1 && game.challenge !== 9) {
        if (game.cap_mode !== 0) game.prev_mode = game.cap_mode;
        if (mode > game.prev_mode) {
            game.cap_mode = game.prev_mode;
            discharge();
        }

        game.cap_mode = mode;

        document.getElementById("cap_off").className = "button";
        document.getElementById("cap_25").className = "button";
        document.getElementById("cap_50").className = "button";
        document.getElementById("cap_75").className = "button";
        document.getElementById("cap_100").className = "button";

        game.cap_boost = 1 - 0.25 * mode;

        switch (mode) {
        case 0:
            document.getElementById("cap_off").className =
                    "button mode_active";
            break;
        case 1:
            document.getElementById("cap_25").className =
                    "button mode_active";
            break;
        case 2:
            document.getElementById("cap_50").className =
                    "button mode_active";
            break;
        case 3:
            document.getElementById("cap_75").className =
                    "button mode_active";
            break;
        case 4:
            document.getElementById("cap_100").className =
                    "button mode_active";
            break;
        }
    }
}

//discharging the capacitor
function discharge() {
    if (
        game.cap_mode >= 1 &&
        game.challenge !== 1 &&
        game.challenge !== 7 &&
        game.challenge !== 9 &&
        (game.stored_exp >= game.tickspeed || game.pp_bought[38])
    ) {
        let eps =
            (game.exp_add + game.exp_fluct / 2) *
            game.global_multiplier *
            game.cps;
        if (game.battery_mode === 1 || game.perks[8]) eps *= game.exp_battery;
        if (!game.perks[9])
            increment(
                (game.stored_exp / game.tickspeed) * eps * game.cap_mode * 2
            );
        else
            increment(
                (game.stored_exp / game.tickspeed) * eps * game.cap_mode * 4
            );
        game.stored_exp = 0;

        if (!game.achievements[61] && game.oc_state === 2) get_achievement(61);
    }
}

//entering a challenge
function enter_challenge(id) {
    if (game.challenge === 0) {
        let all_pp_upgrades = true;
        for (const upgrade4 of pp_upgrade.upgrades) {
            if (
                upgrade4.id < 39 &&
                upgrade4.id !== 8 &&
                !game.pp_bought[upgrade4.id]
            )
                all_pp_upgrades = false;
        }

        let reboot_requirement = 0;
        if (game.reboot >= 1 || game.quantum >= 1)
            reboot_requirement = 5000 * game.reboot + 80000;
        if (game.reboot >= 24 || game.quantum >= 1) reboot_requirement = 200000;

        let roman = "undefined";
        switch (id) {
        case 1:
            roman = "I";
            break;
        case 2:
            roman = "II";
            break;
        case 3:
            roman = "III";
            break;
        case 4:
            roman = "IV";
            break;
        case 5:
            roman = "V";
            break;
        case 6:
            roman = "VI";
            break;
        case 7:
            roman = "VII";
            break;
        case 8:
            roman = "VIII";
            break;
        case 9:
            roman = "IX";
            break;
        }

        let confirmed = false;
        if (!game.challenge_confirmation) {
            confirmed = true;
        } else {
            if (
                confirm(
                    "You are entering Challenge " +
                        roman +
                        "\nYou must reset to enter a challenge, you will still gain watts if you were able to\nAre you sure you want to enter the challenge?"
                )
            ) {
                confirmed = true;
            } else {
                confirmed = false;
            }
        }
        if (confirmed) {
            game.challenge = id;
            if (game.qu_bought[2])
                game.prev_completions = game.completions[game.challenge - 1];
            challenge_update();
            entering = true;

            if (all_pp_upgrades && game.pp >= reboot_requirement) {
                reboot();
            } else {
                empty_reboot();
                watts_update();
            }

            entering = false;

            game.global_multiplier =
                game.exp_fact *
                overclocker.effect *
                game.exp_flux *
                game.pp_power *
                game.prestige_power *
                game.depth_power *
                game.ach_power *
                game.speed_power *
                game.ch_boost[0] *
                game.ch_boost[1] *
                game.ch_boost[2] *
                game.ch_boost[3] *
                game.ch_boost[4] *
                game.ch_boost[5] *
                game.ch_boost[6] *
                game.ch_boost[7] *
                game.ch_boost[8] *
                reduction *
                game.helium_boost;

            if (game.challenge === 7) {
                game.global_multiplier =
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
            }
        }
    } else if (game.challenge !== id) {
        alert("You cannot enter a challenge if you are already in one!");
    }
}

//exiting a challenge
function exit_challenge() {
    if (game.challenge !== 0) {
        game.challenge = 0;
        challenge_update();
        empty_reboot();
        watts_update();
    }
}

//upgrading the prism
function upgrade_prism() {
    if (
        game.photons >= Math.round(5 * 2.8 ** game.prism_level) &&
        Math.round(5 * 2.8 ** game.prism_level) < Infinity
    ) {
        game.photons -= Math.round(5 * 2.8 ** game.prism_level);
        game.prism_level++;
        game.prism_boost = game.prism_level * (game.prism_level + 4);

        AchievementHandler.check_prism_level();
    }
}

//upgrading growth interval
function upgrade_interval() {
    if (game.photons >= game.growth_price[0] && game.growth_interval > 1) {
        game.photons -= game.growth_price[0];
        game.growth_price[0] *= 80;
        game.growth_interval *= 0.9;
        if (game.growth_interval < 1) game.growth_interval = 1;
    }
}

//upgrading growth facor
function upgrade_growth() {
    if (game.photons >= game.growth_price[1]) {
        game.photons -= game.growth_price[1];
        game.growth_price[1] *= 15;
        game.growth_factor *= 1.02;
    }
}

//collapsing dark matter
function collapse() {
    if (
        game.dark_matter.cmp(1.7976931348622053 * 10 ** 308) === 1 ||
        game.dark_matter.cmp(1.7976931348622053 * 10 ** 308) === 0
    ) {
        game.dark_matter = new Decimal(1);
        game.omega_level++;
        if (game.omega_level > game.highest_omega_level) {
            game.highest_omega_level = game.omega_level;
            game.omega_points++;
        }

        AchievementHandler.check_omega_level();
    }
}

//assigning omega points
function assign(chamber, max) {
    if (game.omega_points >= 1) {
        if (max) {
            game.om_assigned[chamber] += game.omega_points;
            game.omega_points = 0;
        } else {
            game.om_assigned[chamber]++;
            game.omega_points--;
        }

        switch (chamber) {
        case 0:
            game.om_boost[chamber] = Math.ceil(
                2.9 * 1.45 ** (game.om_assigned[chamber] - 1)
            );
            break;
        case 1:
            game.om_boost[chamber] = Math.floor(
                7 * 7.2 ** (game.om_assigned[chamber] - 1)
            );
            break;
        case 2:
            game.om_boost[chamber] = 1 + 0.06 * game.om_assigned[chamber];
            break;
        }
    }
}

//retrieve omega points
function retrieve() {
    game.omega_points = game.highest_omega_level;
    game.om_assigned[0] = 0;
    game.om_assigned[1] = 0;
    game.om_assigned[2] = 0;
    game.om_boost[0] = 1;
    game.om_boost[1] = 1;
    game.om_boost[2] = 1;
}

//entering the omega challenge
function enter_omega_challenge() {
    if (!game.omega_challenge) {
        let total_completions =
            game.completions[0] +
            game.completions[1] +
            game.completions[2] +
            game.completions[3] +
            game.completions[4] +
            game.completions[5] +
            game.completions[6] +
            game.completions[7] +
            game.completions[8];

        let highest_level = game.reboot_highest_level;
        if (game.highest_level > highest_level)
            highest_level = game.highest_level;
        if (game.level > highest_level) highest_level = game.level;

        if (total_completions >= 108 && highest_level >= 65536) {
            let confirmed = false;
            if (!game.quantum_confirmation) confirmed = true;
            else {
                let message = "";
                message =
                    "Are you sure you want to enter the Omega Challenge? You must Quantize before entering.";

                if (confirm(message)) confirmed = true;
            }

            if (confirmed) {
                game.quantum++;
                game.photons += Math.floor(
                    1000000 ** ((highest_level - 65536) / 32768)
                );

                AchievementHandler.check_quantum_count();

                if (!game.achievements[168] && game.hps === 0)
                    get_achievement(168);

                game.watts = 0;
                game.watt_boost = 1;

                game.challenge = 0;
                if (!game.qu_bought[5]) {
                    for (let i = 0; i < 9; i++) {
                        game.completions[i] = 0;
                        game.ch_boost[i] = 1;
                    }
                }

                game.hydrogen = 0;
                game.budget = 0;
                game.core_level = [0, 0, 0, 0, 0, 0, 0, 0];
                game.core_price = [1, 3, 10, 36, 136, 528, 2080, 8256];
                game.supply_level = 0;
                game.supply_price = 16;
                game.autohy_spent = 0;

                game.dark_matter = new Decimal(1);
                game.dark_matter_boost = 1;
                game.omega_level = 0;

                if (game.reboot_time < game.fastest_quantize)
                    game.fastest_quantize = game.reboot_time;

                AchievementHandler.check_quantum_speed();

                if (game.reboot_highest_level > game.all_time_highest_level)
                    game.all_time_highest_level = game.reboot_highest_level;

                if (game.highest_level > game.all_time_highest_level) {
                    game.all_time_highest_level = game.highest_level;
                }

                if (game.level > game.all_time_highest_level) {
                    game.all_time_highest_level = game.level;
                }

                game.omega_challenge = true;

                empty_reboot();

                game.reboot = 0;
                game.true_banked_prestige = 0;
                game.reboot_exp = 0;
                game.reboot_time = 0;
                game.highest_level = 1;
                game.reboot_highest_level = 1;
                game.reboot_clicks = 0;
            }
        }
    }
}

//exiting the omega challenge
function exit_omega_challenge() {
    if (game.omega_challenge) {
        game.watts = 0;
        game.watt_boost = 1;

        game.challenge = 0;
        if (!game.qu_bought[5]) {
            for (let i = 0; i < 9; i++) {
                game.completions[i] = 0;
                game.ch_boost[i] = 1;
            }
        }

        game.hydrogen = 0;
        game.budget = 0;
        game.core_level = [0, 0, 0, 0, 0, 0, 0, 0];
        game.core_price = [1, 3, 10, 36, 136, 528, 2080, 8256];
        game.supply_level = 0;
        game.supply_price = 16;
        game.autohy_spent = 0;

        game.dark_matter = new Decimal(1);
        game.dark_matter_boost = 1;
        game.omega_level = 0;

        if (game.reboot_highest_level > game.all_time_highest_level)
            game.all_time_highest_level = game.reboot_highest_level;

        if (game.highest_level > game.all_time_highest_level) {
            game.all_time_highest_level = game.highest_level;
        }

        if (game.level > game.all_time_highest_level) {
            game.all_time_highest_level = game.level;
        }

        game.omega_challenge = false;

        empty_reboot();

        game.reboot = 0;
        game.true_banked_prestige = 0;
        game.reboot_exp = 0;
        game.reboot_time = 0;
        game.highest_level = 1;
        game.reboot_highest_level = 1;
        game.reboot_clicks = 0;
    }
}
