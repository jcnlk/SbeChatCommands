// Constants for easier chat formating     
export const BLACK = "§0";
export const DARK_BLUE = "§1";
export const DARK_GREEN = "§2";
export const DARK_AQUA = "§3";
export const DARK_RED = "§4";
export const DARK_PURPLE = "§5";
export const GOLD = "§6";
export const GRAY = "§7";
export const DARK_GRAY = "§8";
export const BLUE = "§9";
export const GREEN = "§a";
export const AQUA = "§b";
export const RED = "§c";
export const LIGHT_PURPLE = "§d";
export const YELLOW = "§e";
export const WHITE = "§f";
export const OBFUSCATED = "§k";
export const BOLD = "§l";
export const STRIKETHROUGH = "§m";
export const UNDERLINE = "§n";
export const ITALIC = "§o";
export const RESET = "§r";

//Basic Stuff
export const ModuleName = "SBEChatCommands"
export const ModuleVersion = "1.0.2" // IMPORTANT: This will define the module version (metadata.json excluded)
export const Creator = "jcnlk"  // idk probably just me
export const Prefix = `${DARK_GRAY}[${GOLD}SCC${DARK_GRAY}]${RESET}`

// Checks if current server is hypixel
export const InSkyblock = () => {
    if (Server.getIP().includes("hypixel") && ChatLib.removeFormatting(Scoreboard.getTitle()).includes("SKYBLOCK"))
        return true;
    return false;
}

// Checks if current area is the garden
export const InGarden = () => {
    let inGarden = false;
    Scoreboard.getLines().forEach((line) => {
        if (ChatLib.removeFormatting(line).includes("The Garden")) InGarden = true;
    });
    return inGarden;
}