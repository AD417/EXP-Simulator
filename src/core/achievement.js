
/**
 * Class for interfacing with and otherwise dealing
 * with achievements.
 */
class Achievement {

    /** The Achievement's ID. */
    id;

    /** @param {Number} id */
    constructor(id) {
        this.id = id;
    }

    /** Whether this achievement is locked.*/
    get is_locked() {
        return !game.achievements[this.id];
    }

    /** Whether this achievement is unlocked. */
    get is_unlocked() {
        return game.achievements[this.id];
    }

    /** Lock this achievement. */
    lock() {
        game.achievements[this.id] = false;
        achievement.achievements[true_id].new = false;
        if (!meme) 
            document.getElementById("achievements").style.color = "ff00000";
    }

    /** Unlock this achievement */
    unlock() {
        if (this.is_unlocked) return;
        game.achievements[this.id] = true;
        const true_id = achievement.achievements
            .map(x => x.id)
            .indexOf(this.id);
        
        if (document.visibilityState === "visible")
            new notify(achievement.achievements[true_id].name, "#00ff00");
        achievement.achievements[true_id].new = true;
        if (!meme) document.getElementById("achievements").style.color = "00ff00";
    }
}