import PogData from "../../PogData";

class MeowCounter {
    constructor() {
        this.data = new PogData("SbeChatCommands", {
            totalMeows: 0,
            lastMeow: 0
        }, "./data/Data.json");
    }

    increment() {
        this.data.totalMeows++;
        this.data.lastMeow = Date.now();
        this.data.save();
    }

    getTotal() {
        return this.data.totalMeows;
    }

    // Prevent spam by checking if last meow was within 15 seconds
    canMeow() {
        return Date.now() - this.data.lastMeow >= 15000;
    }
}

export default new MeowCounter();