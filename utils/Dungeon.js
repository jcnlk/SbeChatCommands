import request from "../../requestV2";
import Promise from "../../PromiseV2";
import { CleanPrefix } from "./Constants";

function filterByMode(items, isMasterMode) {
    return items.filter(item => isMasterMode ? item.startsWith("M") : item.startsWith("F"));
}

/**
 * Prepares username for API requests by handling special characters
 * @param {string} username - Raw username input
 * @returns {string} - Encoded username safe for API requests
 */
function prepareUsername(username) {
    // First encode the username properly for URLs
    return encodeURIComponent(username.trim());
}

/**
 * Gets dungeon data for a player using SkyCrypt API
 * @param {string} username - Minecraft username
 * @returns {Promise} - Player"s dungeon data or error
 */
export function getDungeonData(username) {
    const encodedUsername = prepareUsername(username);
    
    return new Promise(function(resolve) {
        request({
            url: `https://sky.shiiyu.moe/api/v2/profile/${encodedUsername}`,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        }).then(function(response) {
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
                
                if (!selectedProfile || !selectedProfile.data || !selectedProfile.data.dungeons) {
                    resolve({ 
                        success: false, 
                        error: "No dungeon data found for " + username
                    });
                    return;
                }

                resolve({
                    success: true,
                    data: selectedProfile.data.dungeons
                });
            } catch (error) {
                console.error(`${CleanPrefix} Error processing dungeon data:`, error);
                resolve({
                    success: false,
                    error: "Failed to process dungeon data for " + username
                });
            }
        }).catch(function(error) {
            console.error(`${CleanPrefix} Error fetching dungeon data:`, error);
            resolve({
                success: false,
                error: "Failed to fetch dungeon data for " + username
            });
        });
    });
}

/**
 * Gets the total secrets found for a player using SkyCrypt API
 * @param {string} username - Minecraft username
 * @returns {Promise} - Player's total secrets or error
 */
export function getSecretsData(username) {
    const encodedUsername = prepareUsername(username);
    
    return new Promise(function(resolve) {
        request({
            url: `https://sky.shiiyu.moe/api/v2/dungeons/${encodedUsername}`,
            method: "GET",
            headers: { 
                "User-Agent": "Mozilla/5.0",
                "Content-Type": "application/json"
            }
        }).then(function(response) {
            try {
                const data = JSON.parse(response);
                
                // Get profile with highest cata level as fallback for selected profile
                const getCataLevel = profile => profile.dungeons?.catacombs?.level?.uncappedLevel;
                const profile = Object.values(data.profiles)
                    .filter(x => getCataLevel(x))
                    .sort((a, b) => getCataLevel(b) - getCataLevel(a))[0];

                if (!profile || !profile.dungeons) {
                    resolve({ 
                        success: false, 
                        error: "No dungeon data found for " + username
                    });
                    return;
                }

                const secrets = profile.dungeons.secrets_found || 0;
                
                resolve({
                    success: true,
                    data: {
                        total_secrets: secrets
                    }
                });
            } catch (error) {
                console.error(`${CleanPrefix} Error processing secrets data:`, error);
                resolve({
                    success: false,
                    error: "Failed to process secrets data for " + username
                });
            }
        }).catch(function(error) {
            console.error(`${CleanPrefix} Error fetching secrets data:`, error);
            resolve({
                success: false,
                error: "Failed to fetch secrets data for " + username
            });
        });
    });
}

/**
 * Formats secrets data for chat output
 * @param {Object} data - Secrets data from API
 * @param {string} username - Player username
 * @returns {string} Formatted message
 */
export function formatSecrets(data, username) {
    return username + "'s Total Secrets Found: " + data.total_secrets.toLocaleString();
}

/**
 * Formats catacombs level data for chat output
 * @param {Object} data - Dungeon data from API
 * @param {string} username - Player username
 * @returns {string} Formatted message
 */
export function formatCataLevel(data, username) {
    const catacombs = data.catacombs;
    const masterCatacombs = data.master_catacombs;
    
    if (!catacombs || !catacombs.level) {
        console.error(`${CleanPrefix} No catacombs data found for ` + username);
    }
    
    const level = catacombs.level;
    const progress = Math.floor(level.progress * 100);
    let message = username + "'s Catacombs: Level " + level.level + 
                 " (" + progress + "%) | Experience: " + Math.floor(level.xp).toLocaleString();
    
    if (masterCatacombs && masterCatacombs.level && masterCatacombs.level.level > 0) {
        const masterLevel = masterCatacombs.level;
        const masterProgress = Math.floor(masterLevel.progress * 100);
        message += " | Master: Level " + masterLevel.level + " (" + masterProgress + "%)";
    }
    
    return message;
}

/**
 * Formats class levels data for chat output
 * @param {Object} data - Dungeon data from API
 * @param {string} username - Player username
 * @returns {string} Formatted message
 */
export function formatClassLevels(data, username) {
    const classes = data.classes;
    if (!classes || !classes.classes) {
        console.error(`${CleanPrefix} No class data found for ` + username);
    }
    
    const classOrder = ["healer", "mage", "berserk", "archer", "tank"];
    const classLevels = [];
    
    classOrder.forEach(function(className) {
        const classData = classes.classes[className];
        if (classData && classData.level) {
            const progress = Math.floor(classData.level.progress * 100);
            const current = classData.current ? "*" : "";
            classLevels.push(capitalize(className) + current + ": " + 
                           classData.level.level + " (" + progress + "%)");
        }
    });
    
    if (classLevels.length === 0) {
        console.error(`${CleanPrefix} No class levels found for ` + username);
    }
    
    return username + "'s Class Levels: " + classLevels.join(" | ");
}

/**
 * Formats personal best times for chat output
 * @param {Object} data - Dungeon data from API
 * @param {string} username - Player username
 * @param {boolean} isMasterMode - Whether to show master mode floors
 * @returns {string} Formatted message
 */
export function formatPBs(data, username, isMasterMode = false) {
    const catacombs = data.catacombs;
    const masterCatacombs = data.master_catacombs;
    
    if (!catacombs && !masterCatacombs) {
        console.error(`${CleanPrefix} No floor data found for ` + username);
    }
    
    const pbs = [];
    const floorOrder = isMasterMode ? ["1", "2", "3", "4", "5", "6", "7"] : ["0", "1", "2", "3", "4", "5", "6", "7"];
    const dungeonData = isMasterMode ? masterCatacombs : catacombs;
    
    floorOrder.forEach(floorNum => {
        if (dungeonData?.floors?.[floorNum]?.stats?.fastest_time) {
            const floor = dungeonData.floors[floorNum];
            const floorName = !isMasterMode && floorNum === "0" ? "E" : floorNum;
            let timeStr = formatTime(floor.stats.fastest_time);
            
            if (floor.stats.fastest_time_s_plus && 
                floor.stats.fastest_time_s_plus < floor.stats.fastest_time) {
                timeStr += " (S+: " + formatTime(floor.stats.fastest_time_s_plus) + ")";
            } else if (floor.stats.fastest_time_s && 
                      floor.stats.fastest_time_s < floor.stats.fastest_time) {
                timeStr += " (S: " + formatTime(floor.stats.fastest_time_s) + ")";
            }
            
            pbs.push((isMasterMode ? "M" : "F") + floorName + ": " + timeStr);
        }
    });
    
    if (pbs.length === 0) {
        console.error(`${CleanPrefix} No PB data found for ` + username + (isMasterMode ? " in Master Mode" : ""));
    }
    
    return username + "'s PBs: " + pbs.join(" | ");
}

/**
 * Formats completion counts for chat output
 * @param {Object} data - Dungeon data from API
 * @param {string} username - Player username
 * @param {boolean} isMasterMode - Whether to show master mode floors
 * @returns {string} Formatted message
 */
export function formatCompletions(data, username, isMasterMode = false) {
    const catacombs = data.catacombs;
    const masterCatacombs = data.master_catacombs;
    
    if (!catacombs && !masterCatacombs) {
        console.error(`${CleanPrefix} No completion data found for ` + username);
    }
    
    const completions = [];
    const floorOrder = isMasterMode ? ["1", "2", "3", "4", "5", "6", "7"] : ["0", "1", "2", "3", "4", "5", "6", "7"];
    const dungeonData = isMasterMode ? masterCatacombs : catacombs;
    
    floorOrder.forEach(floorNum => {
        if (dungeonData?.floors?.[floorNum]?.stats?.tier_completions) {
            const floor = dungeonData.floors[floorNum];
            const floorName = !isMasterMode && floorNum === "0" ? "E" : floorNum;
            completions.push((isMasterMode ? "M" : "F") + floorName + ": " + 
                           floor.stats.tier_completions.toLocaleString());
        }
    });
    
    if (completions.length === 0) {
        console.error(`${CleanPrefix} No completion data found for ` + username + (isMasterMode ? " in Master Mode" : ""));
    }
    
    const total = dungeonData?.completions || 0;
    return username + "'s Completions: " + 
           completions.join(" | ") + " | Total: " + total.toLocaleString();
}

/**
 * Formats time in milliseconds to minutes:seconds.tenths
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
function formatTime(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(1);
    return minutes + ":" + seconds.padStart(4, "0");
}

/**
 * Capitalizes first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Parses command parameters for dungeon commands
 * @param {Array} args - Command arguments
 * @returns {Object} Parsed parameters
 */
export function parseParameters(args) {
    const params = {
        playerName: null,
        isMasterMode: false
    };
    
    // Check for master mode flag
    const mmIndex = args.findIndex(arg => arg.toLowerCase() === "mm");
    if (mmIndex !== -1) {
        params.isMasterMode = true;
        args.splice(mmIndex, 1);
    }
    
    // After removing mm flag, first arg is player name if exists
    if (args.length > 0) {
        params.playerName = args[0];
    }

    return params;
}