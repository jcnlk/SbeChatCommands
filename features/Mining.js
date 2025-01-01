import {
    BLACK,
    DARK_GREEN,
    DARK_AQUA,
    DARK_RED,
    DARK_PURPLE,
    GOLD,
    GRAY,
    BLUE,
    GREEN,
    AQUA,
    RED,
    LIGHT_PURPLE,
    YELLOW,
    WHITE,
    BOLD,
    UNDERLINE,
    ITALIC,
    RESET,
    Prefix,
    CleanPrefix  } from "../utils/Constants"
import { getCurrentArea } from "../utils/Area";
import config from "../config";

const ROOM_TYPES = {
    "TOPA": `${YELLOW}Topaz`,
    "SAPP": `${AQUA}Sapphire`,
    "AMET": `${DARK_PURPLE}Amethyst`,
    "AMBE": `${GOLD}Amber`,
    "JADE": `${GREEN}Jade`,
    "TITA": `${GRAY}Titanium`,
    "UMBE": `${GOLD}${BOLD}Umber`,
    "TUNG": `${GRAY}${BOLD}Tungsten`,
    "FAIR": `${DARK_AQUA}${BOLD}${ITALIC}${UNDERLINE}VANGUARD`,
    "RUBY": `${RED}${BOLD}${ITALIC}Ruby`,
    "ONYX": `${BLACK}${BOLD}${ITALIC}Onyx`,
    "AQUA": `${BLUE}${BOLD}${ITALIC}Aquamarine`,
    "CITR": `${DARK_RED}${BOLD}${ITALIC}Citrine`,
    "PERI": `${DARK_GREEN}${BOLD}${ITALIC}Peridot`,
    "JASP": `${LIGHT_PURPLE}${BOLD}${ITALIC}Jasper`,
    "OPAL": `${WHITE}${BOLD}${ITALIC}Opal`
};

const CLEAN_ROOM_NAMES = {
    "TOPA": "Topaz",
    "SAPP": "Sapphire",
    "AMET": "Amethyst",
    "AMBE": "Amber",
    "JADE": "Jade",
    "TITA": "Titanium",
    "UMBE": "Umber",
    "TUNG": "Tungsten",
    "FAIR": "VANGUARD",
    "RUBY": "Ruby",
    "ONYX": "Onyx",
    "AQUA": "Aquamarine",
    "CITR": "Citrine",
    "PERI": "Peridot",
    "JASP": "Jasper",
    "OPAL": "Opal"
};

/**
 * INFO:
 * We don't talk about how it's coded.. 
 * Probably have to recode the stuff some day but for now it works
 */

let checkingForMineshaft = false;
let currentRoom = "";

function getCorpseType(corpseName) {
    
    const normalizedName = corpseName.toLowerCase().trim();
    
    if (normalizedName.includes("umber")) return "UMBE";
    if (normalizedName.includes("tungsten")) return "TUNG";
    if (normalizedName.includes("lapis")) return "LAPI";
    if (normalizedName.includes("vanguard")) return "FAIR";
    
    return "OTHER";
}

// Function to check for corpses in the tab list
function getAvailableCorpses() {
    try {
        const tabList = TabList.getNames();
        if (!tabList) {
            return [];
        }

        let corpses = [];
        let foundCorpseHeader = false;

        for (let i = 0; i < tabList.length; i++) {
            const line = tabList[i];
            if (!line) continue;

            const originalLine = line.toString();
            const cleanLine = originalLine.removeFormatting();

            if (cleanLine.toLowerCase().includes("frozen corpse")) {
                foundCorpseHeader = true;
                let counter = 1;

                while (counter > 0 && (i + counter) < tabList.length) {
                    const corpseLine = tabList[i + counter];
                    if (!corpseLine) {
                        break;
                    }

                    const originalCorpseLine = corpseLine.toString();
                    const cleanCorpseLine = originalCorpseLine.removeFormatting().trim();
                    
                    if (cleanCorpseLine === "" || cleanCorpseLine.includes("⏣") || cleanCorpseLine.includes("♲")) {
                        break;
                    }

                    const corpseNameMatch = cleanCorpseLine.match(/([^:]+)/);
                    if (corpseNameMatch) {
                        const fullCorpseName = corpseNameMatch[1].trim();
                        
                        corpses.push({
                            name: fullCorpseName,
                            type: getCorpseType(fullCorpseName)
                        });
                    }
                    counter++;
                }
                break;
            }
        }

        return corpses;
    } catch (error) {
        console.error("Error in getAvailableCorpses:", error);
        return [];
    }
}

// Function to format corpse name based on type
function formatCorpseName(corpse) {
    
    let formatted = "";
    switch(corpse.type) {
        case "UMBE":
            formatted = `${GOLD}${corpse.name}`;
            break;
        case "TUNG":
            formatted = `${GRAY}${corpse.name}`;
            break;
        case "LAPI":
            formatted = `${BLUE}${corpse.name}`;
            break;
        case "FAIR":
            formatted = `${DARK_AQUA}${corpse.name}`;
            break;
        default:
            formatted = `${WHITE}${corpse.name}`;
            break;
    }
    
    return formatted;
}

// Function to format corpse name for party chat
function formatCorpseNameForParty(corpse) {
    const typePrefixes = {
        "UMBE": "Umber",
        "TUNG": "Tungsten",
        "LAPI": "Lapis",
        "FAIR": "Vanguard"
    };
    
    if (corpse.type in typePrefixes && !corpse.name.startsWith(typePrefixes[corpse.type])) {
        return `${typePrefixes[corpse.type]} ${corpse.name}`;
    }
    
    return corpse.name;
}

// Function to announce special rooms in SBE Chat
function announceSpecialRoom(roomType, isCrystal) {
    const playerName = Player.getName();
    const cleanName = CLEAN_ROOM_NAMES[roomType];
    const displayName = isCrystal ? `${cleanName} Crystal` : cleanName;

    // Get available corpses if enabled
    let corpseMessage = "";
    if (config.announceCorpsesWithMineshaft) {
        const corpses = getAvailableCorpses();
        if (corpses.length > 0) {
            const corpseList = corpses.map(formatCorpseNameForParty).join(", ");
            corpseMessage = ` (Corpses: ${corpseList})`;
        }
    }

    // Output for each room type
    if (config.enableAnnounceMineshaftToSbeChat) {
        switch(roomType) {
            case "TOPA":
                if (config.announceTopazMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "SAPP":
                if (config.announceSapphireMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "AMET":
                if (config.announceAmethystMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "AMBE":
                if (config.announceAmberMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "JADE":
                if (config.announceJadeMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "TITA":
                if (config.announceTitaniumMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "UMBE":
                if (config.announceUmberMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "TUNG":
                if (config.announceTungstenMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "FAIR":
                if (config.announceVanguardMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "RUBY":
                if (config.announceRubyMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "ONYX":
                if (config.announceOnyxMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "AQUA":
                if (config.announceAquamarineMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "CITR":
                if (config.announceCitrineMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "PERI":
                if (config.announcePeridotMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "JASP":
                if (config.announceJasperMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "OPAL":
                if (config.announceOpalMineshaft) {
                    ChatLib.command(`sbechat ${CleanPrefix} ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
        }
    }
}

function detectRoomType() {
    const scoreboard = Scoreboard.getLines();
    const lastLine = scoreboard[scoreboard.length - 1]?.toString()?.removeFormatting();
   
    if (!lastLine) return null;
   
    const roomCode = lastLine.slice(-5);
    const roomType = roomCode.slice(0, 4);
    const isCrystal = roomCode.endsWith("2");
   
    if (ROOM_TYPES[roomType]) {
        const roomName = ROOM_TYPES[roomType];
        const displayName = isCrystal ? `${roomName} Crystal${RESET}` : roomName;
       
        if (currentRoom !== roomCode) {
            currentRoom = roomCode;
            
            ChatLib.chat(`${Prefix}: ${displayName}${RESET}`);

            announceSpecialRoom(roomType, isCrystal);

            const corpses = getAvailableCorpses();
            
            if (config.announceMineshaftTypeToParty || config.announceCorpsesToParty) {
                let partyMessage = "";
                const cleanName = CLEAN_ROOM_NAMES[roomType];
                const displayName = isCrystal ? `${cleanName} Crystal` : cleanName;
                
                if (config.announceMineshaftTypeToParty) {
                    partyMessage = `Current Mineshaft: ${displayName}`;
                }
                
                if (config.announceCorpsesToParty && corpses.length > 0) {
                    const corpseList = corpses.map(formatCorpseNameForParty).join(", ");
                    partyMessage += config.announceMineshaftTypeToParty 
                        ? ` | Corpses: ${corpseList}`
                        : `Available Corpses: ${corpseList}`;
                }
                
                if (partyMessage) {
                    ChatLib.command(`party chat ${partyMessage}`);
                }
            }

            if (config.announceCorpsesWithMineshaft && corpses.length > 0) {
                const formattedCorpses = corpses
                    .map(formatCorpseName)
                    .join(`${RESET}, `);
                    
                ChatLib.chat(`${Prefix}: ${YELLOW}Available Corpses: ${RESET}${formattedCorpses}`);
            }
        }
    }
}

const checkAreaAndWarp = () => {
if (!checkingForMineshaft) {
    return;
}
const currentArea = getCurrentArea();
const isMineshaft = currentArea.includes("Mineshaft");

if (isMineshaft) {
    detectRoomType();
    register("step", () => {
        if (getCurrentArea().includes("Mineshaft")) {
            detectRoomType();
        }
    }).setDelay(1);
   
    checkingForMineshaft = false;
} else if (checkingForMineshaft) {
    setTimeout(() => {
        checkAreaAndWarp();
    }, 500);
}
};

register("chat", (rank, name) => {
checkingForMineshaft = true;

setTimeout(() => {
    checkAreaAndWarp();
}, 1000);
}).setCriteria("MINESHAFT! A Mineshaft portal spawned nearby!");

export { checkAreaAndWarp };