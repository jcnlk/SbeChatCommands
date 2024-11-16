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

// Room type mappings
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

let checkingForMineshaft = false;
let currentRoom = "";

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