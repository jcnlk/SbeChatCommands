import request from "../../requestV2";
import Promise from "../../PromiseV2";

/**
 * Gets the Skyblock level of a player using the SkyCrypt API
 * @param {string} username - Minecraft username
 * @returns {Promise} Level data or error
 */
function getSkyblockLevel(username) {
    return new Promise((resolve) => {
        request({
            url: `https://sky.shiiyu.moe/api/v2/profile/${username}`,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        }).then(response => {
            try {
                const data = JSON.parse(response);
                
                // Find the selected profile
                let selectedProfile = null;
                for (const profileId in data.profiles) {
                    if (data.profiles[profileId].current) {
                        selectedProfile = data.profiles[profileId];
                        break;
                    }
                }
                
                if (!selectedProfile || !selectedProfile.data || !selectedProfile.data.skyblock_level) {
                    resolve({ 
                        success: false, 
                        error: "No Skyblock level data found for " + username
                    });
                    return;
                }

                const levelData = selectedProfile.data.skyblock_level;
                
                resolve({
                    success: true,
                    data: {
                        level: Math.floor(levelData.levelWithProgress),
                        progress: ((levelData.levelWithProgress % 1) * 100).toFixed(0)
                    }
                });
            } catch (error) {
                console.error("Error processing level data:", error);
                resolve({
                    success: false,
                    error: "Failed to process level data for " + username
                });
            }
        }).catch(error => {
            console.error("Error fetching level data:", error);
            resolve({
                success: false,
                error: "Failed to fetch level data for " + username
            });
        });
    });
}

/**
 * Formats level data for chat output
 * @param {Object} data - Level data from API
 * @param {string} username - Player username
 * @returns {string} Formatted message
 */
function formatLevelData(data, username) {
    return `${username}'s Skyblock Level: ${data.level} (${data.progress}%)`;
}

export { getSkyblockLevel, formatLevelData };