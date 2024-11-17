import PogData from "../../PogData";

class MeowCounter {
    constructor() {
        this.data = new PogData("SbeChatCommands", {
            totalMeows: 0,
            lastAutoResponse: 0
        }, "./data/Data.json");
    }

    increment() {
        this.data.totalMeows++;
        this.data.save();
    }

    getTotal() {
        return this.data.totalMeows;
    }

    canAutoRespond() {
        return Date.now() - this.data.lastAutoResponse >= 60000;
    }

    updateLastAutoResponse() {
        this.data.lastAutoResponse = Date.now();
        this.data.save();
    }
}

export default new MeowCounter();