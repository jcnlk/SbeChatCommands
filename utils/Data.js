import PogData from "../../PogData";
import {  
    Prefix, 
    ModuleVersion, 
    Creator,
    YELLOW, 
    GREEN, 
    GOLD, 
    RESET, 
    OBFUSCATED,
    AQUA,
    WHITE,
    GRAY,
    RED,
    BOLD 
} from "./Constants";

class defaultData {
    constructor() {
        // Achievement definitions
        this.achievements = {
            FIRST_INSTALL: {
                id: "FIRST_INSTALL",
                name: "True SBE Chat User",
                description: "Install SBE Chat Commands for the first time",
                trigger: "firstInstall"
            },
            FIRST_MESSAGE: {
                id: "FIRST_MESSAGE",
                name: "Breaking the Ice",
                description: "Send your first message in SBE Chat",
                trigger: "firstMessage"
            },
            MEOW_10: {
                id: "MEOW_10",
                name: "Beginner Catversation",
                description: 'Send "meow" 10 times in SBE Chat',
                trigger: "meowCount",
                requirement: 10
            },
            MEOW_50: {
                id: "MEOW_50",
                name: "True Cat Person",
                description: 'Send "meow" 50 times in SBE Chat',
                trigger: "meowCount",
                requirement: 50
            },
            MEOW_100: {
                id: "MEOW_100",
                name: "Legendary Meower",
                description: 'Send "meow" 100 times in SBE Chat',
                trigger: "meowCount",
                requirement: 100
            },
            MEOW_250: {
                id: "MEOW_250",
                name: "Meow Enthusiast",
                description: 'Send "meow" 250 times in SBE Chat',
                trigger: "meowCount",
                requirement: 250
            },
            MEOW_500: {
                id: "MEOW_500",
                name: "Professional Cat",
                description: 'Send "meow" 500 times in SBE Chat',
                trigger: "meowCount",
                requirement: 500
            },
            MEOW_1000: {
                id: "MEOW_1000",
                name: "Ultimate Feline",
                description: 'Send "meow" 1000 times in SBE Chat',
                trigger: "meowCount",
                requirement: 1000
            }//,
            //COMMAND_MASTER: {
            //    id: "COMMAND_MASTER",
            //    name: "Command Master",
            //    description: "Use all available SBE Chat commands at least once",
            //    trigger: "commandMaster"
            //}
        };

        // Initialize PogData with default values
        this.data = new PogData("SbeChatCommands", {
            totalMeows: 0,
            lastMeowResponse: 0,
            firstInstall: false,
            blacklistedUsers: [],
            blockedUsers: [],
            playerData: {
                personalMeowCount: 0,
                unlockedAchievements: [],
                usedCommands: [],
                firstMessageSent: false
            },
            commandCooldowns: {},
            quotes: [],
            lastQuote: -1
        }, "./data/Data.json");

        // First install check
        register("gameLoad", () => {
            if (!this.data.firstInstall) {
                this.showFirstInstallMessage();
                this.data.firstInstall = true;
                this.data.save();
                this.checkAchievement("firstInstall");
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
            ChatLib.chat(`${AQUA}» ${WHITE}/scca ${GRAY}- Display achievements`);
            ChatLib.chat("");
           
            ChatLib.chat(`${GOLD}TIP: ${WHITE}Type ${AQUA}!commands help ${WHITE}for detailed information!`);
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
        }, 2000);
    }

    // Quote methods
    addQuote(quote) {
        if (!this.data.quotes) {
            this.data.quotes = [];
        }
        this.data.quotes.push(quote);
        this.data.save();
        return this.data.quotes.length;
    }

    removeQuote(index) {
        if (!this.data.quotes || index < 1 || index > this.data.quotes.length) {
            return false;
        }
        this.data.quotes.splice(index - 1, 1);
        this.data.save();
        return true;
    }

    getQuotes() {
        return this.data.quotes || [];
    }

    getRandomQuote() {
        if (!this.data.quotes || this.data.quotes.length === 0) {
            return null;
        }
        
        // Simply select a random quote from the array
        const randomIndex = Math.floor(Math.random() * this.data.quotes.length);
        return this.data.quotes[randomIndex];
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

    // Achievement Methods
    announceAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return;

        World.playSound("random.levelup", 1, 1);
        ChatLib.chat(`${RESET}${YELLOW}${OBFUSCATED}a${GREEN}>>   ${GREEN}Achievement Unlocked: ${GOLD}${achievement.name}${GREEN}   <<${YELLOW}${OBFUSCATED}a${RESET}`);
        ChatLib.chat(`${Prefix} ${GREEN}${achievement.description}`);
    }

    checkAchievement(trigger, value = null) {
        const unlockedAchievements = this.data.playerData.unlockedAchievements || [];

        Object.values(this.achievements).forEach(achievement => {
            if (achievement.trigger === trigger && 
                !unlockedAchievements.includes(achievement.id)) {
                
                let shouldUnlock = false;

                switch (trigger) {
                    case "meowCount":
                        shouldUnlock = value >= achievement.requirement;
                        break;
                    //case "commandMaster":
                    //    shouldUnlock = this.checkCommandMasterProgress();
                    //    break;
                    default:
                        shouldUnlock = true;
                        break;
                }

                if (shouldUnlock) {
                    this.unlockAchievement(achievement.id);
                }
            }
        });
    }

    unlockAchievement(achievementId) {
        if (!this.data.playerData.unlockedAchievements) {
            this.data.playerData.unlockedAchievements = [];
        }

        if (!this.data.playerData.unlockedAchievements.includes(achievementId)) {
            this.data.playerData.unlockedAchievements.push(achievementId);
            this.data.save();
            this.announceAchievement(achievementId);
        }
    }

    //checkCommandMasterProgress() {
    //    // Only include commands that are actually implemented in the module
    //    const requiredCommands = [
    //        "rng",      // RNG chance command
    //        "cf",       // Coinflip command
    //        "8ball",    // Magic 8-ball command
    //        "throw",    // Throw command
    //        "dice",     // Dice roll command
    //        "simp",     // Simp level command
    //        "sus",      // Sus level command
    //        "join",     // Party join command
    //        "meow",     // Meow command
    //        "quote",    // Quote command
    //        "tps",      // TPS check command
    //        "ping"      // Ping check command
    //    ];
    //     
    //    const usedCommands = this.data.playerData.usedCommands || [];
    //    return requiredCommands.every(cmd => usedCommands.includes(cmd));
    //}

    getAchievementProgress(achievementId) {
        const achievement = this.achievements[achievementId];

        switch (achievement.trigger) {
            case "meowCount":
                return {
                    current: this.data.playerData.personalMeowCount || 0,
                    required: achievement.requirement
                };
            //case "commandMaster":
            //    const usedCommands = this.data.playerData.usedCommands || [];
            //    const totalCommands = 12; // Total number of implemented commands (excluding help commands)
            //    return {
            //        current: usedCommands.length,
            //        required: totalCommands
            //    };
            default:
                return null;
        }
    }

    // Player data methods
    incrementPersonalMeowCount() {
        this.data.playerData.personalMeowCount = (this.data.playerData.personalMeowCount || 0) + 1;
        this.data.save();
        this.checkAchievement("meowCount", this.data.playerData.personalMeowCount);
    }

    //addUsedCommand(command) {
    //    if (!this.data.playerData.usedCommands) {
    //        this.data.playerData.usedCommands = [];
    //    }
    //    if (!this.data.playerData.usedCommands.includes(command)) {
    //        this.data.playerData.usedCommands.push(command);
    //        this.data.save();
    //        this.checkAchievement("commandMaster");
    //    }
    //}

    setFirstMessageSent() {
        if (!this.data.playerData.firstMessageSent) {
            this.data.playerData.firstMessageSent = true;
            this.data.save();
            this.checkAchievement("firstMessage");
        }
    }

    // Achievement Display Command Handler
    displayAchievements() {
        ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
        ChatLib.chat(`${Prefix} ${YELLOW}Achievement Progress:`);
        ChatLib.chat("");
        
        Object.values(this.achievements).forEach(achievement => {
            const progress = this.getAchievementProgress(achievement.id);
            const unlocked = this.data.playerData.unlockedAchievements?.includes(achievement.id);
            
            const status = unlocked ? `${GREEN}✔` : `${RED}✘`;
            let progressText = "";
            
            if (progress) {
                progressText = ` ${GRAY}(${progress.current}/${progress.required})`;
            }
            
            ChatLib.chat(`${status} ${GOLD}${achievement.name}${progressText}`);
            ChatLib.chat(`${GRAY}  ${achievement.description}`);
        });
        
        ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
    }

    // Commands Cooldown Methods
    isOnCooldown(username) {
        const now = Date.now();
        const lastUse = this.data.commandCooldowns[username] || 0;
        return (now - lastUse) < 5000; // 5000ms = 5 seconds
    }

    getRemainingCooldown(username) {
        const now = Date.now();
        const lastUse = this.data.commandCooldowns[username] || 0;
        const remaining = 5000 - (now - lastUse);
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    }

    setCooldown(username) {
        this.data.commandCooldowns[username] = Date.now();
        this.data.save();
    }

    clearCooldown(username) {
        delete this.data.commandCooldowns[username];
        this.data.save();
    }

    clearAllCooldowns() {
        this.data.commandCooldowns = {};
        this.data.save();
    }
}

export default new defaultData();