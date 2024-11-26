import PogData from "../../PogData";
import { 
    ModuleName, 
    Prefix, 
    ModuleVersion, 
    Creator, 
    YELLOW, 
    GOLD, 
    RESET, 
    DARK_GRAY, 
    GREEN,
    OBFUSCATED,
    WHITE,
    BOLD,
    AQUA,
    LIGHT_PURPLE,
    RED,
    GRAY 
} from "./Constants";

class defaultData {
    constructor() {
        this.data = new PogData("SbeChatCommands", {
            totalMeows: 0,
            lastMeowResponse: 0,
            firstInstall: false,
            blacklistedUsers: [],
            blockedUsers: []
        }, "./data/Data.json");

        register("gameLoad", () => {
            if (!this.data.firstInstall) {
                this.showFirstInstallMessage();
                this.data.firstInstall = true;
                this.data.save();
            }
        });
    }

    // First install message methods
    showFirstInstallMessage() {
        setTimeout(() => {
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            ChatLib.chat(`${YELLOW}${OBFUSCATED}|${RESET} ${GOLD}${BOLD}Welcome to SBE Chat Commands ${AQUA}v${ModuleVersion} ${YELLOW}${OBFUSCATED}|`);
            ChatLib.chat(`${AQUA}✦ ${WHITE}Created by ${GOLD}${Creator} ${AQUA}✦`);
            ChatLib.chat("");

            ChatLib.chat(`${YELLOW}${BOLD}Available Commands:`);
            ChatLib.chat(`${AQUA}» ${WHITE}/scc ${GRAY}- Open the config gui`);
            ChatLib.chat(`${AQUA}» ${WHITE}/scc help ${GRAY}- Display all available commands`);
            ChatLib.chat(`${AQUA}» ${WHITE}/scc help commands ${GRAY}- Display all available SBE Chat commands`);
            ChatLib.chat(`${AQUA}» ${WHITE}/scc blacklist ${GRAY}- Manage blacklisted users`);
            ChatLib.chat(`${AQUA}» ${WHITE}/scc block ${GRAY}- Manage blocked users`);
            ChatLib.chat("");
           
            ChatLib.chat(`${GOLD}TIP: ${WHITE}Type ${AQUA}!commands help ${WHITE}for detailed information!`);
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
        }, 2000);
    }

    // Blacklist methods
    addToBlacklist(username) {
        username = username.toLowerCase();
        if (!this.data.blacklistedUsers.includes(username)) {
            this.data.blacklistedUsers.push(username);
            this.data.save();
            return true;
        }
        return false;
    }

    removeFromBlacklist(username) {
        username = username.toLowerCase();
        const index = this.data.blacklistedUsers.indexOf(username);
        if (index > -1) {
            this.data.blacklistedUsers.splice(index, 1);
            this.data.save();
            return true;
        }
        return false;
    }

    isBlacklisted(username) {
        return this.data.blacklistedUsers.includes(username.toLowerCase());
    }

    getBlacklist() {
        return [...this.data.blacklistedUsers];
    }

    // Block methods
    addToBlocked(username) {
        username = username.toLowerCase();
        if (!this.data.blockedUsers.includes(username)) {
            this.data.blockedUsers.push(username);
            this.data.save();
            return true;
        }
        return false;
    }

    removeFromBlocked(username) {
        username = username.toLowerCase();
        const index = this.data.blockedUsers.indexOf(username);
        if (index > -1) {
            this.data.blockedUsers.splice(index, 1);
            this.data.save();
            return true;
        }
        return false;
    }

    isBlocked(username) {
        return this.data.blockedUsers.includes(username.toLowerCase());
    }

    getBlockedUsers() {
        return [...this.data.blockedUsers];
    }

    // Meow related methods
    incrementMeowCount() {
        this.data.totalMeows++;
        this.data.save();
    }

    getMeowTotal() {
        return this.data.totalMeows;
    }

    canAutoRespondMeow() {
        return Date.now() - this.data.lastMeowResponse >= 100000;
    }

    updateLastMeowResponse() {
        this.data.lastMeowResponse = Date.now();
        this.data.save();
    }
}

export default new defaultData();