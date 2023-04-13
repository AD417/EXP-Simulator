const prestige = {
    can_reset: (level) => {
        // TODO: add logic for Starter Kit Upgrades.
        return level >= 60;
    },

    amp_gain: (level) => {
        if (!prestige.can_reset(level)) return 0;

        return Math.floor(((level - 40) / 20) ** 3);
    },

    pp_gain: (level) => {
        if (!prestige.can_reset(level)) return 0;

        return Math.floor(((level - 40) / 20) ** 2 - 1);
    }
};