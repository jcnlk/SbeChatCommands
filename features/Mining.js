import { getCurrentArea } from "../utils/Area";
import config from "../config";

let checkingForMineshaft = false;

register("chat", (rank, name) => {
    if (!config.autoWarpPartyInMineshaft) {
        //ChatLib.chat("§7[§6Debug§7] Auto warp is disabled in config"); //debug
        return;
    }
    
    checkingForMineshaft = true;
    
    // Initial check after delay
    setTimeout(() => {
        checkAreaAndWarp();
    }, 1500);
}).setCriteria("MINESHAFT! A Mineshaft portal spawned nearby!");

// Enhanced check function with debug output
const checkAreaAndWarp = () => {
    if (!checkingForMineshaft) {
        return;
    }

    const currentArea = getCurrentArea();
    //ChatLib.chat(`§7[§6Debug§7] Current area check: "${currentArea}"`); //debug
    
    // Check for different possible area names
    const isMineshaft = currentArea.includes("Mineshaft");
    
    if (isMineshaft) {
        ChatLib.command("p warp");
        checkingForMineshaft = false;
    } else if (checkingForMineshaft) {
        // If not in Mineshaft yet, check again after a delay
        setTimeout(() => {
            checkAreaAndWarp();
        }, 2000);
    }
};

/** 
// Optional: Add a command to check current area manually
register("command", () => {
    const area = getCurrentArea();
    ChatLib.chat(`§7[§6Debug§7] Manual area check: "${area}"`);
}).setName("checkarea");
*/

export { checkAreaAndWarp };