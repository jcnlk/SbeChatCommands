import request from "../../requestV2";
import Promise from "../../PromiseV2";
import { CleanPrefix } from "./Constants";

/**
 * Fetches slayer data from SkyCrypt API
 * @param {string} username - Minecraft username
 * @returns {Promise} Slayer data or error
 */
export function getSlayerData(username) {
    return new Promise((resolve) => {
        request({
            url: `https://sky.shiiyu.moe/api/v2/slayers/${username}`,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        }).then(response => {
            try {
                const data = JSON.parse(response);
                
                // Find selected profile
                const selectedProfile = Object.values(data).find(profile => profile.selected);
                
                if (!selectedProfile || !selectedProfile.data || !selectedProfile.data.slayers) {
                    resolve({ 
                        success: false, 
                        error: `No slayer data found for ${username}` 
                    });
                    return;
                }

                resolve({
                    success: true,
                    data: selectedProfile.data.slayers,
                    totalXp: selectedProfile.data.total_slayer_xp || 0
                });
            } catch (error) {
                console.error(`${CleanPrefix} Error processing slayer data:`, error);
                resolve({
                    success: false,
                    error: `Failed to process slayer data for ${username}`
                });
            }
        }).catch(error => {
            console.error(`${CleanPrefix} Error fetching slayer data:`, error);
            resolve({
                success: false,
                error: `Failed to fetch slayer data for ${username}`
            });
        });
    });
}

/**
 * Formats slayer data for chat
 * @param {Object} data - Slayer data from API
 * @param {string} username - Player username
 * @returns {string} Formatted message
 */
export function formatSlayerData(data, username) {
    const slayerTypes = [
        { key: "zombie", name: "Revenant" },
        { key: "spider", name: "Tarantula" },
        { key: "wolf", name: "Sven" },
        { key: "enderman", name: "Voidgloom" },
        { key: "blaze", name: "Inferno" },
        { key: "vampire", name: "Riftstalker" }
    ];
    
    const slayerLevels = slayerTypes
        .filter(type => data[type.key] && data[type.key].level)
        .map(type => `${type.name} ${data[type.key].level.currentLevel}`);

    if (slayerLevels.length === 0) {
        console.error(`${CleanPrefix} ${username} has no slayer data`);
    }

    return `${username}'s Slayer Levels: ${slayerLevels.join(", ")}`;
}