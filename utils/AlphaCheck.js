import request from "requestV2";
import { CleanPrefix, Prefix, GREEN, RED, YELLOW, GRAY } from "./Constants";

let lastCheckTime = 0;
let lastSbeCheckTime = 0;
const CHECK_INTERVAL = 300000; // 5 minutes for regular command
const SBE_CHECK_INTERVAL = 60000; // 1 minute for SBE chat command
const API_URL = "https://api.mcsrvstat.us/2/alpha.hypixel.net";

const isAlphaOpen = (maxPlayers) => {
    return maxPlayers >= 100 && maxPlayers <= 999;
};

const checkAlphaStatus = () => {
    const currentTime = Date.now();
    if (currentTime - lastCheckTime < CHECK_INTERVAL) {
        const remainingTime = Math.ceil((CHECK_INTERVAL - (currentTime - lastCheckTime)) / 1000);
        ChatLib.chat(`${Prefix} ${RED}Please wait ${remainingTime} seconds before checking again.`);
        return;
    }

    lastCheckTime = currentTime;

    try {
        request({
            url: API_URL,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        }).then(response => {
            const serverData = JSON.parse(response);
            
            if (!serverData.online) {
                ChatLib.chat(`${Prefix} ${RED}Alpha Server is offline.`);
                return;
            }

            const maxPlayers = serverData.players?.max;
            if (!maxPlayers && maxPlayers !== 0) {
                ChatLib.chat(`${Prefix} ${RED}Could not fetch player slots.`);
                return;
            }

            if (isAlphaOpen(maxPlayers)) {
                ChatLib.chat(`${Prefix} ${GREEN}Alpha Server might be open! ${GRAY}(${maxPlayers} slots)`);
                World.playSound("random.orb", 1, 1);
            } else {
                ChatLib.chat(`${Prefix} ${YELLOW}Alpha Server is currently closed. ${GRAY}(${maxPlayers} slots)`);
            }
        }).catch(error => {
            console.error(`${CleanPrefix} Error checking alpha server:`, error);
            ChatLib.chat(`${Prefix} ${RED}Error while checking Alpha Server status.`);
        });
    } catch (error) {
        console.error(`${CleanPrefix} Error in checkAlphaStatus:`, error);
        ChatLib.chat(`${Prefix} ${RED}Error while checking Alpha Server status.`);
    }
};

const checkAlphaStatusSbe = (callback) => {
    const currentTime = Date.now();
    if (currentTime - lastSbeCheckTime < SBE_CHECK_INTERVAL) {
        return;
    }

    lastSbeCheckTime = currentTime;

    try {
        request({
            url: API_URL,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        }).then(response => {
            const serverData = JSON.parse(response);
            
            const maxPlayers = serverData.players?.max;

            // Only consider it a failure if we truly can't get the data
            if (!serverData.online || (maxPlayers === undefined || maxPlayers === null)) {
                callback(null, 0);
                return;
            }

            // If we have the maxPlayers value, even if it's 0, process it
            callback(isAlphaOpen(maxPlayers), maxPlayers);
            
        }).catch(error => {
            console.error(`${CleanPrefix} Error checking alpha server (SBE):`, error);
            callback(null, 0);
        });
    } catch (error) {
        console.error(`${CleanPrefix} Error in checkAlphaStatusSbe:`, error);
        callback(null, 0);
    }
};

// Register regular command
register("command", () => {
    checkAlphaStatus();
}).setName("checkalpha").setAliases(["alphastatus", "as"]);

export { checkAlphaStatus, checkAlphaStatusSbe };