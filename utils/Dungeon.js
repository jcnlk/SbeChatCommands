import request from "../../requestV2";
import Promise from "../../PromiseV2";

function getDungeonData(username) {
    return new Promise((resolve) => {
        request({
            url: `https://sky.shiiyu.moe/api/v2/dungeons/${username}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        }).then(response => {
            try {
                const data = JSON.parse(response);
                const selectedProfile = Object.values(data.profiles).find(profile => profile.selected);
                
                if (!selectedProfile || !selectedProfile.dungeons) {
                    resolve({ 
                        success: false, 
                        error: `No dungeon data found for ${username}` 
                    });
                    return;
                }

                resolve({
                    success: true,
                    data: selectedProfile.dungeons
                });
            } catch (error) {
                resolve({
                    success: false,
                    error: `Failed to process dungeon data for ${username}`
                });
            }
        }).catch(error => {
            resolve({
                success: false,
                error: `Failed to fetch dungeon data for ${username}`
            });
        });
    });
}

function formatCataLevel(data, username) {
    const catacombs = data.catacombs;
    const masterCatacombs = data.master_catacombs;
    
    if (!catacombs?.level && !masterCatacombs?.level) {
        return `No catacombs data found for ${username}`;
    }
    
    let message = `${username}'s `;
    
    if (catacombs?.level) {
        const level = catacombs.level;
        const progress = Math.floor(level.progress * 100);
        message += `Cata: ${level.level} (${progress}%)`;
    }
    
    if (masterCatacombs?.level) {
        const level = masterCatacombs.level;
        const progress = Math.floor(level.progress * 100);
        if (level.level > 0) {
            message += ` | Master: ${level.level} (${progress}%)`;
        }
    }
    
    const totalXp = data.catacombs?.level?.xp || 0;
    message += ` | Total XP: ${Math.floor(totalXp).toLocaleString()}`;
    
    return message;
}

function formatPBs(data, username) {
    const catacombs = data.catacombs;
    const masterCatacombs = data.master_catacombs;
    
    if (!catacombs?.floors && !masterCatacombs?.floors) {
        return `No floor data found for ${username}`;
    }
    
    const pbs = [];
    const floorOrder = ['0', '1', '2', '3', '4', '5', '6', '7'];
    
    // Normal mode PBs
    floorOrder.forEach(floorNum => {
        const floor = catacombs?.floors?.[floorNum];
        if (floor?.stats?.fastest_time) {
            const floorName = floorNum === '0' ? 'E' : floorNum;
            let timeStr = formatTime(floor.stats.fastest_time);
            
            if (floor.stats.fastest_time_s_plus && 
                floor.stats.fastest_time_s_plus < floor.stats.fastest_time) {
                timeStr += ` (S+: ${formatTime(floor.stats.fastest_time_s_plus)})`;
            } else if (floor.stats.fastest_time_s && 
                      floor.stats.fastest_time_s < floor.stats.fastest_time) {
                timeStr += ` (S: ${formatTime(floor.stats.fastest_time_s)})`;
            }
            
            pbs.push(`F${floorName}: ${timeStr}`);
        }
    });
    
    // Master mode PBs
    floorOrder.slice(1).forEach(floorNum => {
        const floor = masterCatacombs?.floors?.[floorNum];
        if (floor?.stats?.fastest_time) {
            let timeStr = formatTime(floor.stats.fastest_time);
            
            if (floor.stats.fastest_time_s_plus && 
                floor.stats.fastest_time_s_plus < floor.stats.fastest_time) {
                timeStr += ` (S+: ${formatTime(floor.stats.fastest_time_s_plus)})`;
            } else if (floor.stats.fastest_time_s && 
                      floor.stats.fastest_time_s < floor.stats.fastest_time) {
                timeStr += ` (S: ${formatTime(floor.stats.fastest_time_s)})`;
            }
            
            pbs.push(`M${floorNum}: ${timeStr}`);
        }
    });
    
    return `${username}'s PBs: ${pbs.join(" | ")}`;
}

function formatClassLevels(data, username) {
    const classes = data.classes;
    if (!classes?.classes) {
        return `No class data found for ${username}`;
    }
    
    const classOrder = ['healer', 'mage', 'berserk', 'archer', 'tank'];
    const classLevels = [];
    
    classOrder.forEach(className => {
        const classData = classes.classes[className];
        if (classData?.level) {
            const progress = Math.floor(classData.level.progress * 100);
            const current = classData.current ? '*' : '';
            classLevels.push(`${capitalize(className)}${current}: ${classData.level.level} (${progress}%)`);
        }
    });
    
    return `${username}'s Class Levels: ${classLevels.join(" | ")}`;
}

function formatCompletions(data, username) {
    const catacombs = data.catacombs;
    const masterCatacombs = data.master_catacombs;
    
    if (!catacombs?.floors && !masterCatacombs?.floors) {
        return `No completion data found for ${username}`;
    }
    
    const completions = [];
    const floorOrder = ['0', '1', '2', '3', '4', '5', '6', '7'];
    
    // Normal mode completions
    floorOrder.forEach(floorNum => {
        const floor = catacombs?.floors?.[floorNum];
        if (floor?.stats?.tier_completions) {
            const floorName = floorNum === '0' ? 'E' : floorNum;
            completions.push(`F${floorName}: ${floor.stats.tier_completions.toLocaleString()}`);
        }
    });
    
    // Master mode completions
    floorOrder.slice(1).forEach(floorNum => {
        const floor = masterCatacombs?.floors?.[floorNum];
        if (floor?.stats?.tier_completions) {
            completions.push(`M${floorNum}: ${floor.stats.tier_completions.toLocaleString()}`);
        }
    });
    
    const totalCompletions = (catacombs?.completions || 0) + (masterCatacombs?.completions || 0);
    return `${username}'s Completions: ${completions.join(" | ")} | Total: ${totalCompletions.toLocaleString()}`;
}

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes}:${seconds.padStart(4, '0')}`;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { getDungeonData, formatCataLevel, formatPBs, formatClassLevels, formatCompletions };