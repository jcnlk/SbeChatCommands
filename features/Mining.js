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
    Prefix  } from "../utils/Constants"
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

let checkingForMineshaft = false;
let currentRoom = "";

function getCorpseType(corpseName) {
    // Debug incoming name
    //ChatLib.chat(`Getting type for corpse: ${corpseName}`);
    
    const normalizedName = corpseName.toLowerCase().trim();
    //ChatLib.chat(`Normalized name: ${normalizedName}`);
    
    // More specific matching with looser conditions
    if (normalizedName.includes('umber')) return 'UMBE';
    if (normalizedName.includes('tungsten')) return 'TUNG';
    if (normalizedName.includes('lapis')) return 'LAPI';
    if (normalizedName.includes('vanguard')) return 'FAIR';
    
    // Debug unmatched corpse
    //ChatLib.chat(`No specific type match for: ${normalizedName}`);
    return 'OTHER';
}

// Function to check for corpses in the tab list
function getAvailableCorpses() {
    try {
        const tabList = TabList.getNames();
        if (!tabList) {
            //ChatLib.chat("§c[DEBUG] TabList is null");
            return [];
        }

        let corpses = [];
        let foundCorpseHeader = false;

        // Debug the entire TabList
        //ChatLib.chat("§7=== TabList Debug ===");
        //tabList.forEach((line, index) => {
        //    if (line) ChatLib.chat(`${index}: ${line}`);
        //});

        for (let i = 0; i < tabList.length; i++) {
            const line = tabList[i];
            if (!line) continue;

            const originalLine = line.toString();
            const cleanLine = originalLine.removeFormatting();
            
            //ChatLib.chat(`§e[DEBUG] Processing line: ${cleanLine}`);

            // Check for "Frozen Corpses" header with more lenient matching
            if (cleanLine.toLowerCase().includes('frozen corpse')) {
                //ChatLib.chat("§a[DEBUG] Found Frozen Corpses header!");
                foundCorpseHeader = true;
                let counter = 1;

                while (counter > 0 && (i + counter) < tabList.length) {
                    const corpseLine = tabList[i + counter];
                    if (!corpseLine) {
                        //ChatLib.chat("§c[DEBUG] Corpse line is null");
                        break;
                    }

                    const originalCorpseLine = corpseLine.toString();
                    const cleanCorpseLine = originalCorpseLine.removeFormatting().trim();
                    
                    //ChatLib.chat(`§b[DEBUG] Checking potential corpse line: ${cleanCorpseLine}`);
                    
                    // Stop if we hit an empty line or certain characters
                    if (cleanCorpseLine === '' || cleanCorpseLine.includes('⏣') || cleanCorpseLine.includes('♲')) {
                        //ChatLib.chat("§e[DEBUG] Found end of corpse list");
                        break;
                    }

                    // Try to extract the corpse name with more lenient matching
                    const corpseNameMatch = cleanCorpseLine.match(/([^:]+)/);
                    if (corpseNameMatch) {
                        const fullCorpseName = corpseNameMatch[1].trim();
                        //ChatLib.chat(`§a[DEBUG] Found corpse name: ${fullCorpseName}`);
                        
                        corpses.push({
                            name: fullCorpseName,
                            type: getCorpseType(fullCorpseName)
                        });
                    } else {
                        //ChatLib.chat(`§c[DEBUG] No match found in line: ${cleanCorpseLine}`);
                    }
                    
                    counter++;
                }
                break;
            }
        }

        //ChatLib.chat("§6[DEBUG] Final corpses found:");
        //corpses.forEach(corpse => {
        //    ChatLib.chat(`§7- ${corpse.name} (${corpse.type})`);
        //});

        return corpses;
    } catch (error) {
        console.error("Error in getAvailableCorpses:", error);
        //ChatLib.chat(`§c[DEBUG] Error in getAvailableCorpses: ${error.message}`);
        return [];
    }
}

// Function to format corpse name based on type
function formatCorpseName(corpse) {
    // Debug input
    //ChatLib.chat(`Formatting corpse: ${JSON.stringify(corpse)}`);
    
    let formatted = "";
    switch(corpse.type) {
        case 'UMBE':
            formatted = `${GOLD}${corpse.name}`;
            break;
        case 'TUNG':
            formatted = `${GRAY}${corpse.name}`;
            break;
        case 'LAPI':
            formatted = `${DARK_BLUE}${corpse.name}`;
            break;
        case 'FAIR':
            formatted = `${DARK_AQUA}${corpse.name}`;
            break;
        default:
            formatted = `${WHITE}${corpse.name}`;
            break;
    }
    // Debug output
    //ChatLib.chat(`Formatted result: ${formatted}`);
    
    return formatted;
}

// Function to format corpse name for party chat
function formatCorpseNameForParty(corpse) {
    const typePrefixes = {
        'UMBE': 'Umber',
        'TUNG': 'Tungsten',
        'LAPI': 'Lapis',
        'FAIR': 'Vanguard'
    };
    
    return corpse.type in typePrefixes ? 
        `${typePrefixes[corpse.type]} ${corpse.name}` : 
        corpse.name;
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
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "SAPP":
                if (config.announceSapphireMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "AMET":
                if (config.announceAmethystMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "AMBE":
                if (config.announceAmberMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "JADE":
                if (config.announceJadeMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "TITA":
                if (config.announceTitaniumMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "UMBE":
                if (config.announceUmberMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "TUNG":
                if (config.announceTungstenMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "FAIR":
                if (config.announceVanguardMineshaft) {
                    ChatLib.command(`sbechat ${displayName} found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "RUBY":
                if (config.announceRubyMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "ONYX":
                if (config.announceOnyxMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "AQUA":
                if (config.announceAquamarineMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "CITR":
                if (config.announceCitrineMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "PERI":
                if (config.announcePeridotMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "JASP":
                if (config.announceJasperMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
            case "OPAL":
                if (config.announceOpalMineshaft) {
                    ChatLib.command(`sbechat ${displayName} Mineshaft found! Type "!join ${playerName}" for invite.${corpseMessage}`, true);
                }
                break;
        }
    }
}

function detectRoomType() {
    const scoreboard = Scoreboard.getLines();
    const lastLine = scoreboard[scoreboard.length - 1]?.toString()?.removeFormatting();
   
    if (!lastLine) return null;
   
    // Extract the last 5 characters
    const roomCode = lastLine.slice(-5);
    // Get the room type (first 4 characters)
    const roomType = roomCode.slice(0, 4);
    // Get the number (last character)
    const isCrystal = roomCode.endsWith('2');
   
    if (ROOM_TYPES[roomType]) {
        const roomName = ROOM_TYPES[roomType];
        const displayName = isCrystal ? `${roomName} Crystal${RESET}` : roomName;
       
        // Only display if room changed
        if (currentRoom !== roomCode) {
            currentRoom = roomCode;
            
            // Debug output
            //ChatLib.chat(`Debug - Room Code: ${roomCode}, Room Type: ${roomType}, Is Crystal: ${isCrystal}`);
            
            // Mineshaft type message for chat
            ChatLib.chat(`${Prefix}: ${displayName}${RESET}`);

            // Check if room should be announced in SBE Chat first
            announceSpecialRoom(roomType, isCrystal);

            // Get available corpses
            const corpses = getAvailableCorpses();
            
            // Combined party chat announcement
            if (config.announceMineshaftTypeToParty || config.announceCorpsesToParty) {
                let partyMessage = "";  // Diese Zeile fehlte vorher - Variable-Deklaration
                const cleanName = CLEAN_ROOM_NAMES[roomType];
                const displayName = isCrystal ? `${cleanName} Crystal` : cleanName;
                
                // Add mineshaft type if enabled
                if (config.announceMineshaftTypeToParty) {
                    partyMessage = `Current Mineshaft: ${displayName}`;
                }
                
                // Add corpses if enabled and available
                if (config.announceCorpsesToParty && corpses.length > 0) {
                    const corpseList = corpses.map(formatCorpseNameForParty).join(", ");
                    partyMessage += config.announceMineshaftTypeToParty 
                        ? ` | Corpses: ${corpseList}`
                        : `Available Corpses: ${corpseList}`;
                }
                
                // Send the combined message if we have content
                if (partyMessage) {
                    ChatLib.command(`pc ${partyMessage}`);
                }
            }
            
            // Separate corpse message in module chat if enabled
            if (config.announceCorpsesWithMineshaft && corpses.length > 0) {
                const formattedCorpses = corpses
                    .map(formatCorpseName)
                    .join(`${RESET}, `);
                    
                ChatLib.chat(`${Prefix}: ${GOLD}Available Corpses: ${RESET}${formattedCorpses}`);
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