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

// Function to check for corpses in the tab list
function getAvailableCorpses() {
    try {
        const tabList = TabList.getNames();
        if (!tabList) return [];

        let corpses = [];
        let foundCorpseHeader = false;

        for (let i = 0; i < tabList.length; i++) {
            const line = tabList[i]?.removeFormatting();
            if (!line) continue;

            if (line.includes('Frozen Corpses:')) {
                foundCorpseHeader = true;
                let counter = 1;

                while (counter > 0 && (i + counter) < tabList.length) {
                    const corpseLine = tabList[i + counter]?.removeFormatting();
                    
                    if (!corpseLine || corpseLine === '') {
                        return corpses;
                    }

                    const corpseName = corpseLine.replace(':', '').split(' ')[1];
                    if (corpseName) {
                        corpses.push(corpseName);
                    }
                    
                    counter++;
                }
            }
        }

        return corpses;
    } catch (error) {
        console.error("Error in getAvailableCorpses:", error);
        return [];
    }
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
            corpseMessage = ` (Corpses: ${corpses.join(", ")})`;
        }
    }

    // Output for each room type
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
            
            // Mineshaft type message for chat
            ChatLib.chat(`${Prefix}: ${displayName}${RESET}`);

            // Combined party chat announcement
            if (config.announceMineshaftTypeToParty || config.announceCorpsesToParty) {
                let partyMessage = "";
                const cleanName = CLEAN_ROOM_NAMES[roomType];
                const displayName = isCrystal ? `${cleanName} Crystal` : cleanName;
                
                // Add mineshaft type if enabled
                if (config.announceMineshaftTypeToParty) {
                    partyMessage = `Current Mineshaft: ${displayName}`;
                }
                
                // Add corpses if enabled and available
                if (config.announceCorpsesToParty) {
                    const corpses = getAvailableCorpses();
                    if (corpses.length > 0) {
                        partyMessage += config.announceMineshaftTypeToParty 
                            ? ` | Corpses: ${corpses.join(", ")}`
                            : `Available Corpses: ${corpses.join(", ")}`;
                    }
                }
                
                // Send the combined message if we have content
                if (partyMessage) {
                    ChatLib.command(`pc ${partyMessage}`);
                }
            }
            
            // Separate corpse message in module chat if enabled
            if (config.announceCorpsesWithMineshaft) {
                const corpses = getAvailableCorpses();
                if (corpses.length > 0) {
                    ChatLib.chat(`${Prefix}: ${GOLD}Available Corpses: ${corpses.join(", ")}${RESET}`);
                }
            }
            
            // Check if room should be announced in SBE Chat
            announceSpecialRoom(roomType, isCrystal);
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

// Optional debug command to check room type manually
register("command", () => {
    detectRoomType();
}).setName("checkroom");

export { checkAreaAndWarp };