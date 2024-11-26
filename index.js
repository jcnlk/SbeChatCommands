import config from "./config";
import defaultData from "./utils/Data";
import { getCurrentArea } from "./utils/Area";
import "./features/Mining";
import { 
    BLACK, 
    DARK_BLUE, 
    DARK_GREEN, 
    DARK_AQUA, 
    DARK_RED, 
    DARK_PURPLE, 
    GOLD, 
    GRAY, 
    DARK_GRAY, 
    BLUE, 
    GREEN, 
    AQUA, 
    RED, 
    LIGHT_PURPLE, 
    YELLOW, 
    WHITE,
    OBFUSCATED, 
    BOLD, 
    STRIKETHROUGH, 
    UNDERLINE, 
    ITALIC, 
    RESET,
    ModuleVersion, 
    ModuleName,  
    Creator,
    Prefix  } from "./utils/Constants";

let commandOutputs;
try {
    const jsonPath = "./data/SbeChatCommands.json";
    const jsonContent = FileLib.read("SbeChatCommands", jsonPath);
    if (!jsonContent) {
        throw new Error(`SbeChatCommands.json is empty or not found at path: ${jsonPath}`);
    }
    commandOutputs = JSON.parse(jsonContent);
    if (!commandOutputs || typeof commandOutputs !== 'object') {
        throw new Error("Invalid JSON format in SbeChatCommands.json");
    }
} catch (error) {
    console.error("Error loading SbeChatCommands.json:", error);
    commandOutputs = {};
}

function generateMessage(commandType, variables) {
    if (!commandOutputs[commandType]) {
        console.error(`Invalid or missing command type: ${commandType}`);
        return null;
    }

    let templates;
    switch (commandType) {
        case 'rng':
            templates = variables.rng <= 30 ? commandOutputs.rng.low :
                        variables.rng <= 70 ? commandOutputs.rng.medium :
                        commandOutputs.rng.high;
            break;
        case 'throw':
            templates = variables.throwIntensity <= 30 ? commandOutputs.throw.low :
                        variables.throwIntensity <= 70 ? commandOutputs.throw.medium :
                        commandOutputs.throw.high;
            break;
        case 'cf':
            templates = commandOutputs.cf[variables.result];
            break;
        case 'dice':
            templates = variables.result <= 2 ? commandOutputs.dice.low :
                        variables.result <= 4 ? commandOutputs.dice.medium :
                        commandOutputs.dice.high;
            break;
        case 'simp':
        case 'sus':
            templates = variables.percentage <= 33 ? commandOutputs[commandType].low :
                        variables.percentage <= 66 ? commandOutputs[commandType].medium :
                        commandOutputs[commandType].high;
            break;
        case 'meow':
            templates = commandOutputs.meow.responses;
            break;
        default:
            templates = commandOutputs[commandType];
    }

    if (!Array.isArray(templates)) {
        console.error(`Invalid template array for command type: ${commandType}`);
        return null;
    }

    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace(/\${(\w+)}/g, (_, key) => variables[key] !== undefined ? variables[key] : '');
}

function handleBlockCommand(action, username) {
    if (!action) {
        handleHelpCommand("block");

        const blocked = defaultData.getBlockedUsers();
        if (blocked.length > 0) {
            ChatLib.chat("");
            ChatLib.chat(`${YELLOW}Currently blocked users:`);
            blocked.forEach(user => {
                ChatLib.chat(`${AQUA}• ${WHITE}${user}`);
            });
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
        }
        return;
    }

    switch (action) {
        case "add":
            if (!username) {
                ChatLib.chat(`${Prefix} ${RED}Please specify a username! ${GRAY}(/scc block add <username>)`);
                return;
            }
            if (defaultData.addToBlocked(username)) {
                ChatLib.chat(`${Prefix} ${GREEN}Successfully blocked ${GOLD}${username}${GREEN}!`);
            } else {
                ChatLib.chat(`${Prefix} ${RED}${username} ${GRAY}is already blocked!`);
            }
            break;

        case "remove":
            if (!username) {
                ChatLib.chat(`${Prefix} ${RED}Please specify a username! ${GRAY}(/scc block remove <username>)`);
                return;
            }
            if (defaultData.removeFromBlocked(username)) {
                ChatLib.chat(`${Prefix} ${GREEN}Successfully unblocked ${GOLD}${username}${GREEN}!`);
            } else {
                ChatLib.chat(`${Prefix} ${RED}${username} ${GRAY}is not blocked!`);
            }
            break;

        default:
            handleHelpCommand("block");
            break;
    }
}

function handleCommandsCommand(args) {
    if (!commandOutputs.commands) {
        return "Error: Commands information not available";
    }

    if (!args || args.length === 0 || args[0].toLowerCase() === "list") {
        const availableCommands = [
            "!rng", "!cf", "!8ball", "!throw", "!dice", 
            "!simp", "!sus", "!join", "!commands", "!meow"
        ];
        return `Available commands: ${availableCommands.join(", ")}`;
    } else if (args[0].toLowerCase() === "help") {
        if (args.length === 1) {
            return commandOutputs.commands.help || "Help information not available";
        } else {
            let specificCommand = args[1].toLowerCase();
            return (commandOutputs.commands.specific && commandOutputs.commands.specific[specificCommand]) || 
                    `Unknown command: ${specificCommand}. Use !commands list for a list of available commands.`;
        }
    }
    return "Invalid usage. Try !commands list or !commands help [command]";
}

function handleBlacklistCommand(action, username) {
    if (!action) {
        handleHelpCommand("blacklist");

        const blacklist = defaultData.getBlacklist();
        if (blacklist.length > 0) {
            ChatLib.chat("");
            ChatLib.chat(`${YELLOW}Currently blacklisted users:`);
            blacklist.forEach(user => {
                ChatLib.chat(`${AQUA}• ${WHITE}${user}`);
            });
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
        }
        return;
    }

    switch (action) {
        case "add":
            if (!username) {
                ChatLib.chat(`${Prefix} ${RED}Please specify a username! ${GRAY}(/scc bl add <username>)`);
                return;
            }
            if (defaultData.addToBlacklist(username)) {
                ChatLib.chat(`${Prefix} ${GREEN}Successfully added ${GOLD}${username} ${GREEN}to the blacklist!`);
            } else {
                ChatLib.chat(`${Prefix} ${RED}${username} ${GRAY}is already blacklisted!`);
            }
            break;

        case "remove":
            if (!username) {
                ChatLib.chat(`${Prefix} ${RED}Please specify a username! ${GRAY}(/scc bl remove <username>)`);
                return;
            }
            if (defaultData.removeFromBlacklist(username)) {
                ChatLib.chat(`${Prefix} ${GREEN}Successfully removed ${GOLD}${username} ${GREEN}from the blacklist!`);
            } else {
                ChatLib.chat(`${Prefix} ${RED}${username} ${GRAY}is not blacklisted!`);
            }
            break;

        default:
            handleHelpCommand("blacklist");
            break;
    }
}

function showHelpMenu() {
    ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
    ChatLib.chat(`${Prefix} ${YELLOW}Available Commands:`);
    ChatLib.chat("");
    ChatLib.chat(`${AQUA}/scc ${GRAY}- Opens the config menu`);
    ChatLib.chat(`${AQUA}/scc help ${GRAY}- Shows this help menu`);
    ChatLib.chat(`${AQUA}/scc help commands ${GRAY}- Shows all SBE chat commands`);
    ChatLib.chat(`${AQUA}/scc help blacklist ${GRAY}- Shows blacklist help`);
    ChatLib.chat(`${AQUA}/scc help block ${GRAY}- Shows block help`);
    ChatLib.chat(`${AQUA}/scc bl ${GRAY}- Manage blacklisted users`);
    ChatLib.chat(`${AQUA}/scc block ${GRAY}- Manage blocked users`);
    ChatLib.chat(`${AQUA}/scc version ${GRAY}- Shows version info`);
    ChatLib.chat("");
    ChatLib.chat(`${YELLOW}TIP: ${GRAY}Use ${WHITE}/scc${GRAY} to open the config menu!`);
    ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
}

function handleHelpCommand(topic) {
    if (!topic) {
        showHelpMenu();
        return;
    }

    switch (topic.toLowerCase()) {
        case "commands":
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            ChatLib.chat(`${Prefix} ${YELLOW}SBE Chat Commands:`);
            ChatLib.chat("");
            ChatLib.chat(`${AQUA}!rng [item] ${GRAY}- Get RNG chance for an item`);
            ChatLib.chat(`${AQUA}!cf ${GRAY}- Flip a coin`);
            ChatLib.chat(`${AQUA}!8ball ${GRAY}- Ask the magic 8ball`);
            ChatLib.chat(`${AQUA}!throw [player] ${GRAY}- Throw something at someone`);
            ChatLib.chat(`${AQUA}!dice ${GRAY}- Roll a dice`);
            ChatLib.chat(`${AQUA}!simp [player] ${GRAY}- Check simp level`);
            ChatLib.chat(`${AQUA}!sus [player] ${GRAY}- Check sus level`);
            ChatLib.chat(`${AQUA}!join <player> ${GRAY}- Join player's party (Player need to have this module to work)`);
            ChatLib.chat(`${AQUA}!meow ${GRAY}- Meow!`);
            ChatLib.chat(`${AQUA}!commands ${GRAY}- Show available commands`);
            ChatLib.chat("");
            ChatLib.chat(`${YELLOW}TIP: ${GRAY}Commands can be enabled/disabled in config!`);
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            break;

        case "blacklist":
        case "bl":
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            ChatLib.chat(`${Prefix} ${YELLOW}Blacklist Commands:`);
            ChatLib.chat("");
            ChatLib.chat(`${AQUA}/scc bl ${GRAY}- Show blacklisted users`);
            ChatLib.chat(`${AQUA}/scc bl add <username> ${GRAY}- Add user to blacklist`);
            ChatLib.chat(`${AQUA}/scc bl remove <username> ${GRAY}- Remove user from blacklist`);
            ChatLib.chat("");
            ChatLib.chat(`${YELLOW}NOTE: ${GRAY}Blacklisted users cannot use any commands!`);
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            break;

        case "block":
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            ChatLib.chat(`${Prefix} ${YELLOW}Block Commands:`);
            ChatLib.chat("");
            ChatLib.chat(`${AQUA}/scc block ${GRAY}- Show blocked users`);
            ChatLib.chat(`${AQUA}/scc block add <username> ${GRAY}- Block a user`);
            ChatLib.chat(`${AQUA}/scc block remove <username> ${GRAY}- Unblock a user`);
            ChatLib.chat("");
            ChatLib.chat(`${YELLOW}NOTE: ${GRAY}Blocked users' messages will not appear in SBE Chat!`);
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            break;

        default:
            showHelpMenu();
            break;
    }
}

register("command", () => {
    defaultData.displayAchievements();
}).setName("sccachievements").setAliases(["scca"]);

const commandHandler = register("command", (...args) => {
    if (!args || args.length === 0 || !args[0]) {
        config.openGUI();
        return;
    }

    const subCommand = String(args[0]).toLowerCase();
    const action = args.length > 1 ? String(args[1]).toLowerCase() : null;
    const username = args.length > 2 ? args[2] : null;

    switch (subCommand) {
        case "blacklist":
        case "bl":
            handleBlacklistCommand(action, username);
            break;
        
        case "block":
            handleBlockCommand(action, username);
            break;
            
        case "config":
        case "gui":
        case "setting":
        case "settings":
            config.openGUI();
            break;

        case "help":
        case "?":
            handleHelpCommand(action);
            break;
            
        case "version":
        case "ver":
            ChatLib.chat(`${Prefix} ${YELLOW}Version: ${AQUA}${ModuleVersion}`);
            ChatLib.chat(`${Prefix} ${YELLOW}Created by: ${AQUA}${Creator}`);
            break;
            
        default:
            showHelpMenu();
            break;
    }
}).setName("sbechatcommands").setAliases(["scc"]);

register("chat", (name, message, event) => {
    let senderName = name.replace(/\[.*?\]\s*/, '');
    
    if (defaultData.isBlocked(senderName) || defaultData.isBlacklisted(senderName)) {
        cancel(event);
        return;
    }

    if (senderName === Player.getName()) {
        defaultData.setFirstMessageSent();
    }

    if (message.toLowerCase() === "meow") {
        defaultData.incrementMeowCount();
        
        if (senderName === Player.getName()) {
            defaultData.incrementPersonalMeowCount();
        }
        
        if (senderName !== Player.getName() && 
            defaultData.canAutoRespondMeow() && 
            config.autoMeowResponse) {
            defaultData.updateLastMeowResponse();
            ChatLib.command(`sbechat meow`, true);
        }
        return;
    }

    if (!message.startsWith("!")) return;
   
    let commandParts = message.split(" ");
    let command = commandParts[0].toLowerCase().slice(1); // Remove the '!'

    if (!config.enableAllCommands) return;

    if (senderName === Player.getName()) {
        defaultData.addUsedCommand(command);
    }

    switch(command) {
        case "!rng":
            if (!config.rngCommand) return;
            break;
        case "!cf":
            if (!config.cfCommand) return;
            break;
        case "!8ball":
            if (!config.eightBallCommand) return;
            break;
        case "!throw":
            if (!config.throwCommand) return;
            break;
        case "!dice":
            if (!config.diceCommand) return;
            break;
        case "!simp":
            if (!config.simpCommand) return;
            break;
        case "!sus":
            if (!config.susCommand) return;
            break;
        case "!join":
            if (!config.joinCommand) return;
            break;
        case "!meow":
            if (!config.meowCommand) return;
            break;
        case "!commands":
        case "!command":
            if (!config.commandsCommand) return;
            break;
        default:
            return;
    }

    let targetName = commandParts[1] && !commandParts[1].startsWith('!') ? commandParts[1] : senderName;
    
    let generatedMessage;

    switch(command) {
        case "!rng":
            if (!config.rngCommand) return;
            let rng = Math.floor(Math.random() * 101);
            let item = commandParts.slice(1).join(" ").toLowerCase() || null;
            generatedMessage = generateMessage("rng", {
                playerName: senderName,
                rng, 
                dropString: item ? ` for ${item}` : ''
            });
            break;

        case "!cf":
            let result = Math.random() < 0.5 ? "heads" : "tails";
            generatedMessage = generateMessage("cf", {
                playerName: targetName, 
                result: result
            });
            break;

        case "!8ball":
            if (!config.eightBallCommand) return;
            generatedMessage = commandOutputs["8ballResponses"][
                Math.floor(Math.random() * commandOutputs["8ballResponses"].length)
            ];
            break;

        case "!throw":
            let throwIntensity = Math.floor(Math.random() * 101);
            generatedMessage = generateMessage("throw", {
                playerName: targetName, 
                throwIntensity
            });
            break;

        case "!dice":
            let diceResult = Math.floor(Math.random() * 6) + 1;
            generatedMessage = generateMessage("dice", {
                playerName: targetName, 
                result: diceResult
            });
            break;

        case "!commands":
        case "!command":
            generatedMessage = handleCommandsCommand(commandParts.slice(1));
            break;

        case "!simp":
        case "!sus":
            let percentage = Math.floor(Math.random() * 101);
            generatedMessage = generateMessage(command.slice(1), {
                playerName: targetName, 
                percentage: percentage
            });
            break;

        case "!join":
            let playerToJoinOrInvite = commandParts[1];
            if (!playerToJoinOrInvite) {
                return;
            }
    
            let clientUsername = Player.getName();
    
            if (playerToJoinOrInvite.toLowerCase() === clientUsername.toLowerCase()) {
                ChatLib.command(`party ${senderName}`);
            }
            return;

        case "!meow":
            let total = defaultData.getMeowTotal();
            generatedMessage = generateMessage("meow", { total });
            if (generatedMessage === null) {
                generatedMessage = `MEOW! There have been ${total} meows in SBE Chat!`;
            }
            break;
    }

    if (generatedMessage) {
        ChatLib.command(`sbechat ${generatedMessage}`, true);
    }
}).setCriteria("SBE Chat > ${name}: ${message}");