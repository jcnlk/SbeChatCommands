import config from "./config";
import defaultData from "./utils/Data";
import { getCurrentArea } from "./utils/Area";
import { getAverageTps, getCurrentTps, getPing } from "./utils/ServerUtils";
import { checkAlphaStatusSbe } from "./utils/AlphaCheck";
import { getPlayerNetworth, formatNetworthMessage } from "./utils/Networth";
import "./features/Mining";
import "./utils/CommandHandler";
import "./utils/Election";
import "./utils/Slayer";
import "./utils/Dungeon";
import "./utils/MagicalPower";
import "./utils/Level";
import "./utils/Taxes";
import "./utils/Skills";
import "./utils/LowestBin";
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
    Prefix 
} from "./utils/Constants";

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

function handleQuoteCommand(action, ...args) {
    switch (action) {
        case "add":
            if (args.length === 0) {
                ChatLib.chat(`${Prefix} ${RED}Please provide a quote to add! ${GRAY}(/scc quote add <quote>)`);
                return;
            }
            const quote = args.join(" ");
            const quoteNumber = defaultData.addQuote(quote);
            ChatLib.chat(`${Prefix} ${GREEN}Successfully added quote #${quoteNumber}!`);
            break;

        case "remove":
            if (args.length === 0) {
                ChatLib.chat(`${Prefix} ${RED}Please provide a quote number to remove! ${GRAY}(/scc quote remove <number>)`);
                return;
            }
            const index = parseInt(args[0]);
            if (defaultData.removeQuote(index)) {
                ChatLib.chat(`${Prefix} ${GREEN}Successfully removed quote #${index}!`);
            } else {
                ChatLib.chat(`${Prefix} ${RED}Invalid quote number!`);
            }
            break;

        case "list":
            const quotes = defaultData.getQuotes();
            if (quotes.length === 0) {
                ChatLib.chat(`${Prefix} ${RED}No quotes found!`);
                return;
            }
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            ChatLib.chat(`${Prefix} ${YELLOW}Saved Quotes:`);
            ChatLib.chat("");
            quotes.forEach((quote, index) => {
                ChatLib.chat(`${AQUA}#${index + 1} ${WHITE}${quote}`);
            });
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            break;

        default:
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            ChatLib.chat(`${Prefix} ${YELLOW}Quote Commands:`);
            ChatLib.chat("");
            ChatLib.chat(`${AQUA}/scc quote add <quote> ${GRAY}- Add a new quote`);
            ChatLib.chat(`${AQUA}/scc quote remove <number> ${GRAY}- Remove a quote by its number`);
            ChatLib.chat(`${AQUA}/scc quote list ${GRAY}- List all saved quotes`);
            ChatLib.chat("");
            ChatLib.chat(`${YELLOW}NOTE: ${GRAY}Use ${AQUA}!quote${GRAY} in SBE Chat to get a random quote!`);
            ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
            break;
    }
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
    ChatLib.chat(`${AQUA}/scc quote ${GRAY}- Manage quotes`);
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
            ChatLib.chat(`${AQUA}!quote ${GRAY}- Get a random quote`);
            ChatLib.chat(`${AQUA}!tps ${GRAY}- Show server TPS`);
            ChatLib.chat(`${AQUA}!ping ${GRAY}- Show your ping to the server`);
            ChatLib.chat(`${AQUA}!alpha ${GRAY}- Check Alpha Server status`);
            ChatLib.chat(`${AQUA}!nw [player] ${GRAY}- Check player's networth`);
            ChatLib.chat(`${AQUA}!mayor ${GRAY}- Show current mayor`);
            ChatLib.chat(`${AQUA}!election ${GRAY}- Show election status`);
            ChatLib.chat(`${AQUA}!slayer [player] ${GRAY}- Show player's slayer levels`);
            ChatLib.chat(`${AQUA}!mp [player] ${GRAY}- Show player's magical power`);
            ChatLib.chat(`${AQUA}!level [player] ${GRAY}- Show player's Skyblock level`);
            ChatLib.chat(`${AQUA}!secrets [player] ${GRAY}- Show player's total secrets`);
            ChatLib.chat(`${AQUA}!tax <amount> ${GRAY}- Calculate auction/BIN taxes`);
            ChatLib.chat(`${AQUA}!skills [player] ${GRAY}- Show player's skill levels`);
            ChatLib.chat(`${AQUA}!skillaverage [player] ${GRAY}- Show player's skill average`);
            ChatLib.chat(`${AQUA}!cata [player] ${GRAY}- Show player's Catacombs level`);
            ChatLib.chat(`${AQUA}!pbs [player] ${GRAY}- Show player's dungeon PBs`);
            ChatLib.chat(`${AQUA}!class [player] ${GRAY}- Show player's class levels`);
            ChatLib.chat(`${AQUA}!comp [player] ${GRAY}- Show player's completion counts`);
            ChatLib.chat(`${AQUA}!lbin <item> ${GRAY}- Check lowest BIN price`);
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
            
        case "quote":
            handleQuoteCommand(action, ...args.slice(2));
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