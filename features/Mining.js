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

// Function to announce special rooms in SBE Chat
function announceSpecialRoom(roomType, isCrystal) {
    const playerName = Player.getName();
    const cleanName = CLEAN_ROOM_NAMES[roomType];
    const displayName = isCrystal ? `${cleanName} Crystal` : cleanName;

    // Test output for each room type
    switch(roomType) {
        case "TOPA":
            if (config.announceTopazMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "SAPP":
            if (config.announceSapphireMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "AMET":
            if (config.announceAmethystMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "AMBE":
            if (config.announceAmberMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "JADE":
            if (config.announceJadeMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "TITA":
            if (config.announceTitaniumMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`, true);
            }
            break;
        case "UMBE":
            if (config.announceUmberMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "TUNG":
            if (config.announceTungstenMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "FAIR":
            if (config.announceVanguardMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} found! Type '!join ${playerName}' for invite.`, true);
            }
            break;
        case "RUBY":
            if (config.announceRubyMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "ONYX":
            if (config.announceOnyxMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "AQUA":
            if (config.announceAquamarineMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "CITR":
            if (config.announceCitrineMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "PERI":
            if (config.announcePeridotMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
        case "JASP":
            if (!config.announceJasperMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`, true);
            }
            break;
        case "OPAL":
            if (!config.announceOpalMineshaft) {
            //ChatLib.chat(`[TEST] sbechat: ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`); //debug
            ChatLib.command(`sbechat ${displayName} Mineshaft found! Type '!join ${playerName}' for invite.`);
            }
            break;
    }
}

// Function to detect room type
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
            ChatLib.chat(`${Prefix}: ${displayName}${RESET}`);
            
            // Check if room should be announced
            announceSpecialRoom(roomType, isCrystal);
        }
    }
}

register("chat", (rank, name) => {
    if (!config.autoWarpPartyInMineshaft) {
        return;
    }
   
    checkingForMineshaft = true;
   
    // Initial check after delay
    setTimeout(() => {
        checkAreaAndWarp();
    }, 1500);
}).setCriteria("MINESHAFT! A Mineshaft portal spawned nearby!");

// Enhanced check function with room type detection
const checkAreaAndWarp = () => {
    if (!checkingForMineshaft) {
        return;
    }
    const currentArea = getCurrentArea();
    const isMineshaft = currentArea.includes("Mineshaft");
   
    if (isMineshaft) {
        ChatLib.command("p warp");
        // Start checking room type
        detectRoomType();
        // Continue monitoring room type changes
        register("step", () => {
            if (getCurrentArea().includes("Mineshaft")) {
                detectRoomType();
            }
        }).setDelay(1);
       
        checkingForMineshaft = false;
    } else if (checkingForMineshaft) {
        // If not in Mineshaft yet, check again after a delay
        setTimeout(() => {
            checkAreaAndWarp();
        }, 1000);
    }
};

// Optional debug command to check room type manually
register("command", () => {
    detectRoomType();
}).setName("checkroom");

export { checkAreaAndWarp };