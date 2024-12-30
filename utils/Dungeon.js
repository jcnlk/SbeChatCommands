import request from "../../requestV2";
import Promise from "../../PromiseV2";

function filterByMode(items, isMasterMode) {
    return items.filter(item => isMasterMode ? item.startsWith('M') : item.startsWith('F'));
}

function getDungeonData(username) {
    return new Promise(function(resolve) {
        request({
            url: 'https://sky.shiiyu.moe/api/v2/dungeons/' + username,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        }).then(function(response) {
            try {
                const data = JSON.parse(response);
                const profiles = Object.values(data.profiles);
                const selectedProfile = profiles.find(function(profile) { return profile.selected; });
                
                if (!selectedProfile || !selectedProfile.dungeons) {
                    resolve({ 
                        success: false, 
                        error: 'No dungeon data found for ' + username
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
                    error: 'Failed to process dungeon data for ' + username
                });
            }
        }).catch(function(error) {
            resolve({
                success: false,
                error: 'Failed to fetch dungeon data for ' + username
            });
        });
    });
}

function formatCataLevel(data, username) {
    const catacombs = data.catacombs;
    const masterCatacombs = data.master_catacombs;
    
    if (!catacombs || !catacombs.level) {
        return 'No catacombs data found for ' + username;
    }
    
    const level = catacombs.level;
    const progress = Math.floor(level.progress * 100);
    let message = username + "'s Catacombs: Level " + level.level + 
                 ' (' + progress + '%) | Experience: ' + Math.floor(level.xp).toLocaleString();
    
    if (masterCatacombs && masterCatacombs.level && masterCatacombs.level.level > 0) {
        const masterLevel = masterCatacombs.level;
        const masterProgress = Math.floor(masterLevel.progress * 100);
        message += ' | Master: Level ' + masterLevel.level + ' (' + masterProgress + '%)';
    }
    
    return message;
}

function formatClassLevels(data, username) {
    const classes = data.classes;
    if (!classes || !classes.classes) {
        return 'No class data found for ' + username;
    }
    
    const classOrder = ['healer', 'mage', 'berserk', 'archer', 'tank'];
    const classLevels = [];
    
    classOrder.forEach(function(className) {
        const classData = classes.classes[className];
        if (classData && classData.level) {
            const progress = Math.floor(classData.level.progress * 100);
            const current = classData.current ? '*' : '';
            classLevels.push(capitalize(className) + current + ': ' + 
                           classData.level.level + ' (' + progress + '%)');
        }
    });
    
    if (classLevels.length === 0) {
        return 'No class levels found for ' + username;
    }
    
    return username + "'s Class Levels: " + classLevels.join(' | ');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatPBs(data, username, isMasterMode = false) {
    const catacombs = data.catacombs;
    const masterCatacombs = data.master_catacombs;
    
    if (!catacombs && !masterCatacombs) {
        return 'No floor data found for ' + username;
    }
    
    const pbs = [];
    const floorOrder = isMasterMode ? ['1', '2', '3', '4', '5', '6', '7'] : ['0', '1', '2', '3', '4', '5', '6', '7'];
    const dungeonData = isMasterMode ? masterCatacombs : catacombs;
    
    floorOrder.forEach(floorNum => {
        if (dungeonData?.floors?.[floorNum]?.stats?.fastest_time) {
            const floor = dungeonData.floors[floorNum];
            const floorName = !isMasterMode && floorNum === '0' ? 'E' : floorNum;
            let timeStr = formatTime(floor.stats.fastest_time);
            
            if (floor.stats.fastest_time_s_plus && 
                floor.stats.fastest_time_s_plus < floor.stats.fastest_time) {
                timeStr += ' (S+: ' + formatTime(floor.stats.fastest_time_s_plus) + ')';
            } else if (floor.stats.fastest_time_s && 
                      floor.stats.fastest_time_s < floor.stats.fastest_time) {
                timeStr += ' (S: ' + formatTime(floor.stats.fastest_time_s) + ')';
            }
            
            pbs.push((isMasterMode ? 'M' : 'F') + floorName + ': ' + timeStr);
        }
    });
    
    if (pbs.length === 0) {
        return 'No PB data found for ' + username + (isMasterMode ? ' in Master Mode' : '');
    }
    
    return username + "'s PBs" + ': ' + pbs.join(' | '); //(isMasterMode ? ' (Master Mode)' : '') +
}

function formatCompletions(data, username, isMasterMode = false) {
    const catacombs = data.catacombs;
    const masterCatacombs = data.master_catacombs;
    
    if (!catacombs && !masterCatacombs) {
        return 'No completion data found for ' + username;
    }
    
    const completions = [];
    const floorOrder = isMasterMode ? ['1', '2', '3', '4', '5', '6', '7'] : ['0', '1', '2', '3', '4', '5', '6', '7'];
    const dungeonData = isMasterMode ? masterCatacombs : catacombs;
    
    floorOrder.forEach(floorNum => {
        if (dungeonData?.floors?.[floorNum]?.stats?.tier_completions) {
            const floor = dungeonData.floors[floorNum];
            const floorName = !isMasterMode && floorNum === '0' ? 'E' : floorNum;
            completions.push((isMasterMode ? 'M' : 'F') + floorName + ': ' + 
                           floor.stats.tier_completions.toLocaleString());
        }
    });
    
    if (completions.length === 0) {
        return 'No completion data found for ' + username + (isMasterMode ? ' in Master Mode' : '');
    }
    
    const total = dungeonData?.completions || 0;
    return username + "'s Completions" + ': ' + //+ (isMasterMode ? ' (Master Mode)' : '')
           completions.join(' | ') + ' | Total: ' + total.toLocaleString();
}

function formatTime(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(1);
    return minutes + ':' + seconds.padStart(4, '0');
}

function parseParameters(args) {
    const params = {
        playerName: null,
        isMasterMode: false
    };
    
    // Check for master mode flag
    const mmIndex = args.findIndex(arg => arg.toLowerCase() === 'mm');
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

export { 
    getDungeonData, 
    formatPBs, 
    formatCompletions, 
    parseParameters,
    formatCataLevel,
    formatClassLevels 
};