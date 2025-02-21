//function for handling resets of any kind
//prestige, reboot, save wiping, etc
function reset() {
    if (!game.pp_bought[0] || game.challenge === 7) {
        document.getElementById("fluct").style.display = "none";
        document.getElementById("fluct_button").style.display = "none";
        document.getElementById("fluct_auto").style.display = "none";
    }
    if (!game.pp_bought[5] || game.challenge === 7) {
        document.getElementById("fact").style.display = "none";
        document.getElementById("fact_button").style.display = "none";
        document.getElementById("fact_auto").style.display = "none";
    }
    if (!game.pp_bought[20] || game.challenge === 7) {
        document.getElementById("flux").style.display = "none";
        document.getElementById("flux_button").style.display = "none";
        document.getElementById("flux_auto").style.display = "none";
    }
    if (!game.pp_bought[25] || game.challenge === 7) {
        document.getElementById("battery").style.display = "none";
        document.getElementById("battery_button").style.display = "none";
        document.getElementById("battery_mode").style.display = "none";
        document.getElementById("battery_auto").style.display = "none";
    }

    game.total_exp = 0;
    game.exp_add = 1;
    game.exp_fluct = 0;
    game.exp_fact = 1;
    game.exp_flux = 1;
    game.exp_battery = 1;
    game.level = 1;
    game.exp = 0;
    game.goal = 32;

    game.clicks = 0;

    game.cps = 0;
    game.click_time = 0;

    game.boost_tier = 0;
    game.boost_level = 2;
    game.auto_tier = 0;
    game.auto_level = 3;
    game.fluct_tier = 0;
    game.fluct_level = 6;
    game.fact_tier = 0;
    game.fact_level = 15;
    game.flux_tier = 0;
    game.flux_level = 75;
    game.battery_tier = 0;
    game.battery_level = 90;

    game.time = 0;

    color_update();

    document.getElementById("lvlnum").innerHTML = format_num(game.level);
    document.getElementById("exp").innerHTML =
        format_num(game.exp) + " / " + format_num(game.goal) + " EXP";
    document.getElementById("total_exp").innerHTML =
        format_num(game.total_exp) + " Total EXP";

    document.getElementById("progress").style.width = 0 + "%";
}

//prestiging code
function prestige() {
    if (game.challenge !== 4 && game.challenge !== 9) {
        if (game.level >= game.pr_min) {
            if (game.perks[4] && game.challenge !== 6)
                game.prestige +=
                    Math.ceil(game.level / 200) * Math.round(game.patience);
            else game.prestige += 1;
            game.amp += Math.floor(
                get_amp(game.level) * game.patience * game.watt_boost
            );
            if (game.prestige <= 21 && !game.perks[27]) {
                game.pp += 1;
                game.total_pp += 1;
            }
            if (game.level > game.highest_level) {
                if (!game.perks[27]) {
                    game.pp += get_pp(game.level) - get_pp(game.highest_level);
                    game.total_pp +=
                        get_pp(game.level) - get_pp(game.highest_level);
                }

                if (
                    !game.perks[27] ||
                    game.challenge === 9 ||
                    (game.challenge === 4 &&
                        game.dk_bought[3] &&
                        game.completions[3] >= 12)
                )
                    game.highest_level = game.level;
            }
            document.getElementById("amp").innerHTML =
                format_num(game.amp) + " AMP";
            document.getElementById("pp").innerHTML =
                format_num(game.pp) + " PP";

            for (let i = 4; i > 0; i--) {
                game.amp_amount[i] = game.amp_amount[i - 1];
                game.amp_time[i] = game.amp_time[i - 1];
                game.amp_eff[i] = game.amp_amount[i] / game.amp_time[i];
            }
            game.amp_amount[0] =
                get_amp(game.level) * game.patience * game.watt_boost;
            game.amp_time[0] = game.time / game.tickspeed;
            game.amp_eff[0] = game.amp_amount[0] / game.amp_time[0];

            AchievementHandler.check_prestige_count();

            AchievementHandler.check_amp();

            if (game.time < game.fastest_prestige)
                game.fastest_prestige = game.time;

            reset();

            game.exp_add =
                game.amp +
                game.starter_kit * game.amp +
                game.generator_kit * game.amp;
            if (!game.pp_bought[15])
                game.exp_fluct =
                    (game.starter_kit + game.generator_kit) * game.amp;
            else
                game.exp_fluct =
                    (game.starter_kit + game.generator_kit) * game.amp * 2;
            game.exp_fact = 1 + game.starter_kit + game.generator_kit;
            if (game.pp_bought[25] && game.challenge !== 7) {
                if (!game.pp_bought[31])
                    game.exp_battery = 1 + game.starter_kit + game.generator_kit;
                else if (!game.pp_bought[36])
                    game.exp_battery =
                        (1 + game.starter_kit + game.generator_kit) * 3;
                else
                    game.exp_battery =
                        (1 + game.starter_kit + game.generator_kit) * 9;
            }
            game.cps = (game.starter_kit + game.generator_kit) * 2;
            if (game.challenge === 7) {
                game.exp_fluct = 0;
                game.exp_fact = 1;
            }

            if (game.pp_bought[27] && game.challenge !== 7) {
                game.prestige_power = 1 + (game.prestige / 1000) ** (1 / 2);
            }

            if (game.perks[6] && game.challenge === 0) {
                game.boost_level = Math.round(2 * 0.75);
                game.auto_level = Math.round(5 * 0.75);
                game.fluct_level = Math.round(6 * 0.75);
                game.fact_level = Math.round(15 * 0.75);
                game.flux_level = Math.round(75 * 0.75);
                game.battery_level = Math.round(90 * 0.75);

                if (game.perks[21]) {
                    game.boost_level = Math.round(2 * 0.5);
                    game.auto_level = Math.round(5 * 0.5);
                    game.fluct_level = Math.round(6 * 0.5);
                    game.fact_level = Math.round(15 * 0.5);
                    game.flux_level = Math.round(75 * 0.5);
                    game.battery_level = Math.round(90 * 0.5);
                }
            }

            if (game.challenge === 2 || game.challenge === 9) {
                game.boost_level = 10;
                game.auto_level = 25;
                game.fluct_level = 30;
                game.fact_level = 75;
                game.flux_level = 375;
                game.battery_level = 450;
            }

            if (
                game.autopr_mode === 0 ||
                game.autopr_mode === 1 ||
                !game.autopr_toggle
            ) {
                game.smartds_oc = false;
            }
            if (game.autopr_mode === 2) {
                game.smartds_oc = false;
            }

            if (game.smartpr_mode === 1 && game.amp < game.smartpr_amp) {
                game.smartpr_mode = 0;
                game.smartpr_time = 0;
                autopr_switch(4);
            }

            switch (game.jumpstart) {
            case 1:
                if (game.challenge !== 3 && game.challenge !== 9) {
                    game.total_exp = 4855;
                    game.prestige_exp += 4855;
                    game.reboot_exp += 4855;
                    game.all_time_exp += 4855;
                } else {
                    game.total_exp = 72825;
                    game.prestige_exp += 72825;
                    game.reboot_exp += 72825;
                    game.all_time_exp += 72825;
                }
                break;
            case 2:
                if (game.challenge !== 3 && game.challenge !== 9) {
                    game.total_exp = 35308;
                    game.prestige_exp += 35308;
                    game.reboot_exp += 35308;
                    game.all_time_exp += 35308;
                } else {
                    game.total_exp = 1059240;
                    game.prestige_exp += 1059240;
                    game.reboot_exp += 1059240;
                    game.all_time_exp += 1059240;
                }
                break;
            case 3:
                if (game.challenge !== 3 && game.challenge !== 9) {
                    game.total_exp = 269015;
                    game.prestige_exp += 269105;
                    game.reboot_exp += 269015;
                    game.all_time_exp += 269015;
                } else {
                    game.total_exp = 16140872;
                    game.prestige_exp += 16140872;
                    game.reboot_exp += 16140872;
                    game.all_time_exp += 16140872;
                }
                break;
            }
            increment(0);

            if (game.pp_progress) {
                document.getElementById("pp_back").style.display = "block";
            }
        }
    } else {
        if (game.level >= game.highest_level) {
            if (game.perks[4] && game.challenge !== 6)
                game.prestige +=
                    Math.ceil(game.level / 200) * Math.round(game.patience);
            else game.prestige += 1;
            game.amp += Math.floor(
                (get_amp(game.level) - get_amp(game.highest_level)) *
                    game.watt_boost
            );
            if (game.prestige <= 21 && !game.perks[27]) {
                game.pp += 1;
                game.total_pp += 1;
            }
            if (!game.perks[27]) {
                game.pp += get_pp(game.level) - get_pp(game.highest_level);
                game.total_pp += get_pp(game.level) - get_pp(game.highest_level);
            }
            if (
                !game.perks[27] ||
                game.challenge === 9 ||
                (game.challenge === 4 &&
                    game.dk_bought[3] &&
                    game.completions[3] >= 12)
            )
                game.highest_level = game.level;
            document.getElementById("amp").innerHTML =
                format_num(game.amp) + " AMP";
            document.getElementById("pp").innerHTML =
                format_num(game.pp) + " PP";

            for (let i = 4; i > 0; i--) {
                game.amp_amount[i] = game.amp_amount[i - 1];
                game.amp_time[i] = game.amp_time[i - 1];
                game.amp_eff[i] = game.amp_amount[i] / game.amp_time[i];
            }
            game.amp_amount[0] =
                (get_amp(game.level) - get_amp(game.highest_level)) *
                game.watt_boost;
            game.amp_time[0] = game.time / game.tickspeed;
            game.amp_eff[0] = game.amp_amount[0] / game.amp_time[0];

            AchievementHandler.check_prestige_count();

            AchievementHandler.check_amp();

            if (game.time < game.fastest_prestige)
                game.fastest_prestige = game.time;

            reset();

            game.exp_add =
                game.amp +
                game.starter_kit * game.amp +
                game.generator_kit * game.amp;
            if (!game.pp_bought[15])
                game.exp_fluct =
                    (game.starter_kit + game.generator_kit) * game.amp;
            else
                game.exp_fluct =
                    (game.starter_kit + game.generator_kit) * game.amp * 2;
            game.exp_fact = 1 + game.starter_kit + game.generator_kit;
            if (game.pp_bought[25] && game.challenge !== 7) {
                if (!game.pp_bought[31])
                    game.exp_battery = 1 + game.starter_kit + game.generator_kit;
                else if (!game.pp_bought[36])
                    game.exp_battery =
                        (1 + game.starter_kit + game.generator_kit) * 3;
                else
                    game.exp_battery =
                        (1 + game.starter_kit + game.generator_kit) * 9;
            }
            game.cps = (game.starter_kit + game.generator_kit) * 2;
            if (game.challenge === 7) {
                game.exp_fluct = 0;
                game.exp_fact = 1;
            }

            if (game.perks[6] && game.challenge === 0) {
                game.boost_level = Math.round(2 * 0.75);
                game.auto_level = Math.round(5 * 0.75);
                game.fluct_level = Math.round(6 * 0.75);
                game.fact_level = Math.round(15 * 0.75);
                game.flux_level = Math.round(75 * 0.75);
                game.battery_level = Math.round(90 * 0.75);

                if (game.perks[21]) {
                    game.boost_level = Math.round(2 * 0.5);
                    game.auto_level = Math.round(5 * 0.5);
                    game.fluct_level = Math.round(6 * 0.5);
                    game.fact_level = Math.round(15 * 0.5);
                    game.flux_level = Math.round(75 * 0.5);
                    game.battery_level = Math.round(90 * 0.5);
                }
            }

            if (game.challenge === 2 || game.challenge === 9) {
                game.boost_level = 10;
                game.auto_level = 25;
                game.fluct_level = 30;
                game.fact_level = 75;
                game.flux_level = 375;
                game.battery_level = 450;
            }

            if (
                game.autopr_mode === 0 ||
                game.autopr_mode === 1 ||
                !game.autopr_toggle
            ) {
                game.smartds_oc = false;
            }
            if (game.autopr_mode === 2) {
                game.smartds_oc = false;
            }

            if (game.smartpr_mode === 1 && game.amp < game.smartpr_amp) {
                game.smartpr_mode = 0;
                game.smartpr_time = 0;
                autopr_switch(4);
            }

            switch (game.jumpstart) {
            case 1:
                if (game.challenge !== 3 && game.challenge !== 9) {
                    game.total_exp = 4855;
                    game.prestige_exp += 4855;
                    game.reboot_exp += 4855;
                    game.all_time_exp += 4855;
                } else {
                    game.total_exp = 72825;
                    game.prestige_exp += 72825;
                    game.reboot_exp += 72825;
                    game.all_time_exp += 72825;
                }
                break;
            case 2:
                if (game.challenge !== 3 && game.challenge !== 9) {
                    game.total_exp = 35308;
                    game.prestige_exp += 35308;
                    game.reboot_exp += 35308;
                    game.all_time_exp += 35308;
                } else {
                    game.total_exp = 1059240;
                    game.prestige_exp += 1059240;
                    game.reboot_exp += 1059240;
                    game.all_time_exp += 1059240;
                }
                break;
            case 3:
                if (game.challenge !== 3 && game.challenge !== 9) {
                    game.total_exp = 269015;
                    game.prestige_exp += 269015;
                    game.reboot_exp += 269015;
                    game.all_time_exp += 269015;
                } else {
                    game.total_exp = 16140872;
                    game.prestige_exp += 16140872;
                    game.reboot_exp += 16140872;
                    game.all_time_exp += 16140872;
                }
                break;
            }
            increment(0);

            if (game.pp_progress) {
                document.getElementById("pp_back").style.display = "block";
            }
        }
    }
}

//respeccing prestige upgrades
function respec() {
    if (game.level >= game.pr_min) {
        if (game.challenge !== 7 && game.pp_bought[33]) game.flux_boost /= 5;
        
        let all_pp_upgrades = true;
        for (const upgrade3 of pp_upgrade.upgrades) {
            if (
                upgrade3.id < 39 &&
                upgrade3.id !== 8 &&
                !game.pp_bought[upgrade3.id]
            )
                all_pp_upgrades = false;
        }
        if (!game.achievements[75] && all_pp_upgrades) get_achievement(75);
        for (let i = 0; i < 39; i++) {
            game.pp_bought[i] = false;
        }

        autopr_switch(0);
        game.ml_boost = 1;
        document.getElementById("amp_auto").style.display = "none";
        document.getElementById("auto_config").style.display = "none";
        game.jumpstart = 0;
        game.pr_min = 60;
        game.starter_kit = 0;
        document.getElementById("auto_mode").style.display = "none";
        game.oc_state = 0;
        game.oc_time = 0;
        document.getElementById("overclock").style.display = "none";
        document.getElementById("oc_auto").style.display = "none";
        document.getElementById("oc_button").style.display = "none";
        document.getElementById("oc_state").innerHTML = "Recharging";
        document.getElementById("oc_timer").style.display = "block";
        if (!meme)
            document.getElementById("oc_progress").style.background = "#ff2f00";
        set_capacitance(0);
        game.prev_mode = 0;
        game.stored_exp = 0;
        game.cap_boost = 1;
        document.getElementById("capacitor").style.display = "none";
        document.getElementById("cap_50").style.display = "none";
        document.getElementById("cap_75").style.display = "none";
        document.getElementById("cap_100").style.display = "none";
        document.getElementById("cap_disc").style.display = "none";
        document.getElementById("dis_auto").style.display = "none";
        document.getElementById("dis_text").style.display = "none";
        document.getElementById("dis_input").style.display = "none";

        prestige();
        game.pp = game.total_pp;
    }
}

//rebooting code
function reboot() {
    let all_pp_upgrades = true;
    let confirmed = false;
    for (const upgrade2 of pp_upgrade.upgrades) {
        if (
            upgrade2.id < 39 &&
            upgrade2.id !== 8 &&
            !game.pp_bought[upgrade2.id]
        )
            all_pp_upgrades = false;
    }

    let reboot_requirement = 0;
    if (game.reboot >= 1 || game.quantum >= 1)
        reboot_requirement = 5000 * game.reboot + 80000;
    if (game.reboot >= 24 || game.quantum >= 1) reboot_requirement = 200000;

    if (game.qu_bought[2]) {
        if (game.challenge !== 0 && !entering) {
            if (game.prev_completions < 12) {
                reboot_requirement =
                    challenge.challenges[game.challenge - 1].goal +
                    challenge.challenges[game.challenge - 1].step *
                        game.prev_completions +
                    (challenge.challenges[game.challenge - 1].step2 *
                        (game.prev_completions - 1) *
                        game.prev_completions) /
                        2;
            } else {
                if (game.dk_bought[3]) {
                    if (game.prev_completions < 20) {
                        reboot_requirement =
                            challenge.challenges[game.challenge - 1].goal2 +
                            challenge.challenges[game.challenge - 1].step3 *
                                (game.prev_completions - 12) +
                            (challenge.challenges[game.challenge - 1].step4 *
                                (game.prev_completions - 13) *
                                (game.prev_completions - 12)) /
                                2;
                    } else {
                        reboot_requirement =
                            challenge.challenges[game.challenge - 1].goal2 +
                            challenge.challenges[game.challenge - 1].step3 * 7 +
                            challenge.challenges[game.challenge - 1].step4 * 21;
                    }
                } else {
                    reboot_requirement =
                        challenge.challenges[game.challenge - 1].goal +
                        challenge.challenges[game.challenge - 1].step * 11 +
                        challenge.challenges[game.challenge - 1].step2 * 55;
                }
            }
        }
    } else {
        if (game.challenge !== 0 && !entering) {
            if (game.completions[game.challenge - 1] < 12) {
                reboot_requirement =
                    challenge.challenges[game.challenge - 1].goal +
                    challenge.challenges[game.challenge - 1].step *
                        game.completions[game.challenge - 1] +
                    (challenge.challenges[game.challenge - 1].step2 *
                        (game.completions[game.challenge - 1] - 1) *
                        game.completions[game.challenge - 1]) /
                        2;
            } else {
                if (game.dk_bought[3]) {
                    if (game.completions[game.challenge - 1] < 20) {
                        reboot_requirement =
                            challenge.challenges[game.challenge - 1].goal2 +
                            challenge.challenges[game.challenge - 1].step3 *
                                (game.completions[game.challenge - 1] - 12) +
                            (challenge.challenges[game.challenge - 1].step4 *
                                (game.completions[game.challenge - 1] - 13) *
                                (game.completions[game.challenge - 1] - 12)) /
                                2;
                    } else {
                        reboot_requirement =
                            challenge.challenges[game.challenge - 1].goal2 +
                            challenge.challenges[game.challenge - 1].step3 * 7 +
                            challenge.challenges[game.challenge - 1].step4 * 21;
                    }
                } else {
                    reboot_requirement =
                        challenge.challenges[game.challenge - 1].goal +
                        challenge.challenges[game.challenge - 1].step * 11 +
                        challenge.challenges[game.challenge - 1].step2 * 55;
                }
            }
        }
    }

    if (!game.confirmation) confirmed = true;
    else {
        let message = "";
        if (game.reboot < 1) {
            message =
                "Are you sure you want to activate the Generator?\nThis will reset ALL progress up to this point!\nHowever, you will gain 1 watt";
        } else {
            if (!game.perks[13]) {
                message =
                    "Are you sure you want to Reboot?\nYou will gain 1 watt";
            } else {
                if (
                    get_watts(game.pp) * game.prism_boost === 1 &&
                    game.notation !== 8
                ) {
                    message =
                        "Are you sure you want to Reboot?\nYou will gain " +
                        format_num(get_watts(game.pp) * game.prism_boost) +
                        " watt";
                } else {
                    message =
                        "Are you sure you want to Reboot?\nYou will gain " +
                        format_num(get_watts(game.pp) * game.prism_boost) +
                        " watts";
                }
            }

            if (game.dk_bought[5])
                message +=
                    " and " +
                    format_eff(
                        (get_watts(game.pp) / 100) *
                            3 ** game.supply_level *
                            game.prism_boost
                    ) +
                    " g hydrogen";
            else if (
                game.perks[25] &&
                (game.watts >= 98304 || game.dk_bought[5])
            )
                message +=
                    " and " +
                    format_eff(
                        (get_watts(game.pp) / 100) *
                            2.5 ** game.supply_level *
                            game.prism_boost
                    ) +
                    " g hydrogen";
            else if (
                game.perks[22] &&
                (game.watts >= 98304 || game.dk_bought[5])
            )
                message +=
                    " and " +
                    format_eff(
                        (get_watts(game.pp) / 100) *
                            2 ** game.supply_level *
                            game.prism_boost
                    ) +
                    " g hydrogen";
        }

        if (confirm(message)) confirmed = true;
    }

    if (all_pp_upgrades && game.pp >= reboot_requirement) {
        if (confirmed) {
            reset();

            let in_challenge = false;
            if (game.challenge !== 0 && !entering) {
                if (
                    !game.qu_bought[2] ||
                    (game.challenge === 6 && game.completions[5] >= 12)
                ) {
                    let ch = game.challenge - 1;
                    if (!game.dk_bought[3]) {
                        if (game.completions[ch] < 12) game.completions[ch]++;
                    } else {
                        if (game.completions[ch] < 20) game.completions[ch]++;
                    }

                    if (game.completions[ch] >= 12 && !game.achievements[90])
                        get_achievement(90);
                    if (game.completions[ch] >= 20 && !game.achievements[158])
                        get_achievement(158);

                    switch (ch) {
                    case 0:
                        if (!game.achievements[86]) get_achievement(86);
                        break;
                    case 1:
                        if (!game.achievements[87]) get_achievement(87);
                        break;
                    case 2:
                        if (!game.achievements[88]) get_achievement(88);
                        break;
                    case 3:
                        if (!game.achievements[89]) get_achievement(89);
                        break;
                    case 4:
                        if (!game.achievements[108]) get_achievement(108);
                        break;
                    case 5:
                        if (!game.achievements[109]) get_achievement(109);
                        break;
                    case 6:
                        if (!game.achievements[110]) get_achievement(110);
                        break;
                    case 7:
                        if (!game.achievements[111]) get_achievement(111);
                        break;
                    case 8:
                        if (!game.achievements[112]) get_achievement(112);
                        break;
                    }

                    AchievementHandler.check_challenge_completions();

                    if (!game.achievements[92] && game.blind)
                        get_achievement(92);

                    if (game.completions[ch] === 0) {
                        game.ch_boost[ch] = 1;
                    } else {
                        game.ch_boost[ch] = game.completions[ch] * 4;
                        if (game.completions[ch] >= 13) {
                            game.ch_helium_boost[ch] =
                                (game.completions[ch] - 12) * 0.5 + 1;
                        } else {
                            game.ch_helium_boost[ch] = 1;
                        }
                    }
                }

                game.challenge = 0;
                in_challenge = true;
            }

            game.reboot += 1;
            if (!game.perks[13])
                game.watts += game.prism_boost * game.om_boost[0];
            else {
                game.watts +=
                    get_watts(game.pp) * game.prism_boost * game.om_boost[0];
                if (
                    game.perks[22] &&
                    (game.watts >= 98304 || game.dk_bought[5])
                ) {
                    if (game.dk_bought[5]) {
                        game.hydrogen +=
                            (get_watts(game.pp) / 100) *
                            3 ** game.supply_level *
                            game.prism_boost *
                            game.om_boost[0];
                        game.budget +=
                            (get_watts(game.pp) / 100) *
                            3 ** game.supply_level *
                            game.prism_boost *
                            game.om_boost[0] *
                            (1 - game.autohy_portion);
                    } else if (game.perks[25]) {
                        game.hydrogen +=
                            (get_watts(game.pp) / 100) *
                            2.5 ** game.supply_level *
                            game.prism_boost *
                            game.om_boost[0];
                        game.budget +=
                            (get_watts(game.pp) / 100) *
                            2.5 ** game.supply_level *
                            game.prism_boost *
                            game.om_boost[0] *
                            (1 - game.autohy_portion);
                    } else {
                        game.hydrogen +=
                            (get_watts(game.pp) / 100) *
                            2 ** game.supply_level *
                            game.prism_boost *
                            game.om_boost[0];
                        game.budget +=
                            (get_watts(game.pp) / 100) *
                            2 ** game.supply_level *
                            game.prism_boost *
                            game.om_boost[0] *
                            (1 - game.autohy_portion);
                    }
                }
            }
            if (game.watts < 96)
                game.watt_boost =
                    ((game.watts + 1) * (game.watts + 2) * (game.watts + 3)) / 6;
            else
                game.watt_boost =
                    ((game.watts + 4755) * (game.watts + 4756)) / 2 - 11611677;

            if (game.highest_level > game.reboot_highest_level) {
                game.reboot_highest_level = game.highest_level;
            }
            if (game.level > game.reboot_highest_level) {
                game.reboot_highest_level = game.level;
            }

            if (!in_challenge) {
                for (let i = 4; i > 0; i--) {
                    game.watts_amount[i] = game.watts_amount[i - 1];
                    game.watts_time[i] = game.watts_time[i - 1];
                    game.watts_eff[i] =
                        game.watts_amount[i] / game.watts_time[i];
                }
                game.watts_amount[0] =
                    get_watts(game.pp) * game.prism_boost * game.om_boost[0];
                game.watts_time[0] = game.prestige_time / game.tickspeed;
                game.watts_eff[0] = game.watts_amount[0] / game.watts_time[0];
            }

            game.amp_amount = new Array(5).fill(-1);
            game.amp_time = new Array(5).fill(-1);
            game.amp_eff = new Array(5).fill(-1);

            AchievementHandler.check_reboot_count();

            if (!game.achievements[62] && game.no_automation)
                get_achievement(62);
            game.no_automation = true;

            if (!game.achievements[68] && game.blind) get_achievement(68);
            game.blind = true;

            if (game.notation === 7) game.cancer_reboots++;
            if (!game.achievements[76] && game.cancer_reboots >= 10)
                get_achievement(76);

            game.amp = game.watt_boost;
            game.pp = 0;
            game.total_pp = 0;
            game.pr_min = 60;
            for (let i = 0; i < 39; i++) {
                game.pp_bought[i] = false;
            }

            if (game.prestige_time < game.fastest_reboot)
                game.fastest_reboot = game.prestige_time;
            
            AchievementHandler.check_reboot_speed();

            if (game.perks[18] && game.challenge === 0) {
                game.true_banked_prestige += Math.floor(game.prestige / 4);
            }

            for (const perk of generator_perk.perks) {
                if (game.watts >= perk.requirement) {
                    game.perks[perk.id] = true;
                    if (!game.achievements[105] && perk.id === 22)
                        get_achievement(105);
                }
            }

            if (!game.achievements[119] && game.prestige === 0) {
                get_achievement(119);
            }

            game.prestige = 0;
            game.prestige_exp = 0;
            game.highest_level = 1;
            game.prestige_clicks = 0;
            game.prestige_time = 0;
            game.exp_add = game.amp;
            if (!game.perks[10]) {
                game.autopr_mode = 0;
                autopr_switch(game.autopr_mode);
            }

            game.ml_boost = 1;
            game.jumpstart = 0;
            game.starter_kit = 0;
            game.pp_power = 1;

            game.exp_battery = 1;
            game.pp_power = 1;
            game.prestige_power = 1;
            game.depth_power = 1;
            game.patience = 1;
            game.oc_state = 0;
            game.oc_time = 0;
            set_capacitance(0);
            game.prev_mode = 0;
            game.cap_boost = 1;
            game.stored_exp = 0;
            game.flux_boost = 1;
            game.flux_increase = 1;
            if (game.perks[3]) game.flux_boost = 5;

            game.helium = 0;
            game.helium_boost = 1;

            if (game.perks[1]) {
                game.generator_kit = 12;
                if (game.perks[12]) game.generator_kit = 24;
                game.exp_add = game.generator_kit * game.watt_boost;
                game.cps = game.generator_kit;
            } else game.generator_kit = 0;

            game.smartpr_time = 0;

            if (!game.perks[2]) game.subtab[0] = 0;

            document.getElementById("click").innerHTML =
                "+" + format_num(game.amp) + " EXP";

            document.getElementById("boost_auto").style.display = "none";
            document.getElementById("auto_auto").style.display = "none";
            document.getElementById("fluct").style.display = "none";
            document.getElementById("fluct_button").style.display = "none";
            document.getElementById("fluct_auto").style.display = "none";
            document.getElementById("fact").style.display = "none";
            document.getElementById("fact_button").style.display = "none";
            document.getElementById("fact_auto").style.display = "none";
            document.getElementById("flux").style.display = "none";
            document.getElementById("flux_button").style.display = "none";
            document.getElementById("flux_auto").style.display = "none";
            document.getElementById("battery").style.display = "none";
            document.getElementById("battery_button").style.display = "none";
            document.getElementById("battery_mode").style.display = "none";
            document.getElementById("battery_auto").style.display = "none";

            document.getElementById("amp_auto").style.display = "none";
            document.getElementById("auto_config").style.display = "none";
            document.getElementById("auto_level").style.display = "none";
            document.getElementById("auto_mode").style.display = "none";

            document.getElementById("overclock").style.display = "none";
            document.getElementById("oc_auto").style.display = "none";
            document.getElementById("oc_button").style.display = "none";
            document.getElementById("oc_state").innerHTML = "Recharging";
            document.getElementById("oc_timer").style.display = "block";
            if (!meme)
                document.getElementById("oc_progress").style.background =
                    "#ff2f00";

            document.getElementById("capacitor").style.display = "none";
            document.getElementById("cap_50").style.display = "none";
            document.getElementById("cap_75").style.display = "none";
            document.getElementById("cap_100").style.display = "none";
            document.getElementById("cap_disc").style.display = "none";
            document.getElementById("dis_auto").style.display = "none";
            document.getElementById("dis_text").style.display = "none";
            document.getElementById("dis_input").style.display = "none";

            if (game.perks[14]) {
                document.getElementById("smart_config").style.display = "block";
                game.smartpr_mode = game.smartpr_start;
                if (game.smartpr_toggle) {
                    if (game.smartpr_mode === 0) autopr_switch(4);
                    else if (game.smartpr_mode === 1) autopr_switch(2);
                }
            }

            if (game.perks[10]) {
                for (let i = 0; i < 15; i++) {
                    game.pp_bought[i] = true;
                    pp_upgrade.upgrades[i].on_purchase();
                }
            } else if (game.perks[2]) {
                for (let i = 0; i < 7; i++) {
                    game.pp_bought[i] = true;
                    pp_upgrade.upgrades[i].on_purchase();
                }
            }
        }
    }
}

//rebooting without getting watts
function empty_reboot() {
    reset();

    if (game.highest_level > game.reboot_highest_level) {
        game.reboot_highest_level = game.highest_level;
    }
    if (game.level > game.reboot_highest_level) {
        game.reboot_highest_level = game.level;
    }

    game.amp_amount = new Array(5).fill(-1);
    game.amp_time = new Array(5).fill(-1);
    game.amp_eff = new Array(5).fill(-1);

    game.amp = game.watt_boost;
    game.pp = 0;
    game.total_pp = 0;
    game.pr_min = 60;
    for (let i = 0; i < 39; i++) {
        game.pp_bought[i] = false;
    }

    if (game.perks[18]) {
        game.true_banked_prestige += Math.floor(game.prestige / 4);
    }

    game.prestige = 0;
    game.prestige_exp = 0;
    game.highest_level = 1;
    game.prestige_clicks = 0;
    game.prestige_time = 0;
    game.exp_add = game.amp;
    if (!game.perks[10]) {
        game.autopr_mode = 0;
        autopr_switch(game.autopr_mode);
    }

    game.ml_boost = 1;
    game.jumpstart = 0;
    game.starter_kit = 0;
    game.pp_power = 1;

    game.exp_battery = 1;
    game.pp_power = 1;
    game.prestige_power = 1;
    game.depth_power = 1;
    game.patience = 1;
    game.oc_state = 0;
    game.oc_time = 0;
    set_capacitance(0);
    game.prev_mode = 0;
    game.cap_boost = 1;
    game.stored_exp = 0;
    game.flux_boost = 1;
    game.flux_increase = 1;
    if (game.perks[3]) game.flux_boost = 5;

    game.helium = 0;
    game.helium_boost = 1;

    if (game.perks[1]) {
        game.generator_kit = 12;
        if (game.perks[12]) game.generator_kit = 24;
        game.exp_add = game.generator_kit * game.watt_boost;
        game.cps = game.generator_kit;
    } else game.generator_kit = 0;

    game.smartpr_time = 0;

    if (!game.perks[2]) game.subtab[0] = 0;

    document.getElementById("click").innerHTML =
        "+" + format_num(game.amp) + " EXP";

    document.getElementById("boost_auto").style.display = "none";
    document.getElementById("auto_auto").style.display = "none";
    document.getElementById("fluct").style.display = "none";
    document.getElementById("fluct_button").style.display = "none";
    document.getElementById("fluct_auto").style.display = "none";
    document.getElementById("fact").style.display = "none";
    document.getElementById("fact_button").style.display = "none";
    document.getElementById("fact_auto").style.display = "none";
    document.getElementById("flux").style.display = "none";
    document.getElementById("flux_button").style.display = "none";
    document.getElementById("flux_auto").style.display = "none";
    document.getElementById("battery").style.display = "none";
    document.getElementById("battery_button").style.display = "none";
    document.getElementById("battery_mode").style.display = "none";
    document.getElementById("battery_auto").style.display = "none";

    document.getElementById("amp_auto").style.display = "none";
    document.getElementById("auto_config").style.display = "none";
    document.getElementById("auto_mode").style.display = "none";

    document.getElementById("overclock").style.display = "none";
    document.getElementById("oc_auto").style.display = "none";
    document.getElementById("oc_button").style.display = "none";
    document.getElementById("oc_state").innerHTML = "Recharging";
    document.getElementById("oc_timer").style.display = "block";
    if (!meme)
        document.getElementById("oc_progress").style.background = "#ff2f00";

    document.getElementById("capacitor").style.display = "none";
    document.getElementById("cap_50").style.display = "none";
    document.getElementById("cap_75").style.display = "none";
    document.getElementById("cap_100").style.display = "none";
    document.getElementById("cap_disc").style.display = "none";
    document.getElementById("dis_auto").style.display = "none";
    document.getElementById("dis_text").style.display = "none";
    document.getElementById("dis_input").style.display = "none";

    if (game.perks[14]) {
        document.getElementById("smart_config").style.display = "block";
        game.smartpr_mode = game.smartpr_start;
        if (game.smartpr_toggle) {
            if (game.smartpr_mode === 0) autopr_switch(4);
            else if (game.smartpr_mode === 1) autopr_switch(2);
        }
    }

    if (game.perks[10]) {
        for (let i = 0; i < 15; i++) {
            game.pp_bought[i] = true;
            pp_upgrade.upgrades[i].on_purchase();
        }
    } else if (game.perks[2]) {
        for (let i = 0; i < 7; i++) {
            game.pp_bought[i] = true;
            pp_upgrade.upgrades[i].on_purchase();
        }
    }
}

//quantum reset code
function quantize() {
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
    if (game.highest_level > highest_level) highest_level = game.highest_level;
    if (game.level > highest_level) highest_level = game.level;

    let amount = Math.floor(1000000 ** ((highest_level - 65536) / 32768));

    let quantum_requirement = 1;
    if (game.omega_challenge) {
        quantum_requirement = 300 * 200 ** game.om_completions;
    }

    if (total_completions >= 108 && amount >= quantum_requirement) {
        let confirmed = false;
        if (!game.quantum_confirmation) confirmed = true;
        else {
            let message = "";
            if (game.quantum < 1) {
                message =
                    "Are you sure you want to Quantize? This will reset ALL progress up to this point except for Perks and give you ";
            } else {
                message = "Are you sure you want to Quantize? You will gain ";
            }
            if (amount === 1 && game.notation !== 8) {
                message += format_num(amount) + " photon";
            } else {
                message += format_num(amount) + " photons";
            }

            if (confirm(message)) confirmed = true;
        }

        if (confirmed) {
            game.quantum++;
            game.photons += Math.floor(
                1000000 ** ((highest_level - 65536) / 32768)
            );
            if (!game.omega_challenge)
                game.prev_photons = Math.floor(
                    1000000 ** ((highest_level - 65536) / 32768)
                );

            AchievementHandler.check_quantum_count();

            if (!game.achievements[168] && game.hps === 0) get_achievement(168);

            game.watts = 0;
            game.watt_boost = 1;

            game.watts_amount = new Array(5).fill(-1);
            game.watts_time = new Array(5).fill(-1);
            game.watts_eff = new Array(5).fill(-1);

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

            if (game.omega_challenge) {
                game.omega_challenge = false;
                game.om_completions++;

                if (!game.achievements[165] && game.om_completions >= 1)
                    get_achievement(165);
                if (!game.achievements[166] && game.om_completions >= 5)
                    get_achievement(166);
            }

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
