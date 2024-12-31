import request from "../../requestV2";
import Promise from "../../PromiseV2";

const SKILL_NAMES = [
    'taming',
    'farming',
    'mining',
    'combat',
    'foraging',
    'fishing',
    'enchanting',
    'alchemy',
    'carpentry',
    'runecrafting',
    'social'
];

/**
 * Gets skills data for a player using SkyCrypt API
 * @param {string} username - Minecraft username
 * @returns {Promise} Skills data or error
 */
function getSkillsData(username) {
    return new Promise((resolve) => {
        request({
            url: `https://sky.shiiyu.moe/api/v2/profile/${username}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0'
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
                
                if (!selectedProfile || !selectedProfile.data || !selectedProfile.data.skills || !selectedProfile.data.skills.skills) {
                    resolve({ 
                        success: false, 
                        error: 'No skills data found for ' + username
                    });
                    return;
                }

                const skillsData = {
                    average: selectedProfile.data.skills.averageSkillLevel || 0,
                    skills: {}
                };

                // Get individual skill levels
                SKILL_NAMES.forEach(skillName => {
                    const skillData = selectedProfile.data.skills.skills[skillName];
                    if (skillData && skillData.levelWithProgress !== undefined) {
                        skillsData.skills[skillName] = skillData.levelWithProgress;
                    }
                });

                resolve({
                    success: true,
                    data: skillsData
                });
            } catch (error) {
                console.error('Error processing skills data:', error);
                resolve({
                    success: false,
                    error: 'Failed to process skills data for ' + username
                });
            }
        }).catch(error => {
            console.error('Error fetching skills data:', error);
            resolve({
                success: false,
                error: 'Failed to fetch skills data for ' + username
            });
        });
    });
}

/**
 * Formats skills average for chat output
 * @param {Object} data - Skills data from API
 * @param {string} username - Player username
 * @returns {string} Formatted message
 */
function formatSkillAverage(data, username) {
    return `${username}'s Skill Average: ${data.average.toFixed(2)}`;
}

/**
 * Formats individual skills for chat output
 * @param {Object} data - Skills data from API
 * @param {string} username - Player username
 * @returns {string} Formatted message
 */
function formatSkills(data, username) {
    const skillsList = Object.entries(data.skills)
        .map(([name, level]) => `${capitalize(name)}: ${level.toFixed(1)}`)
        .join(' | ');

    return `${username}'s Skills: ${skillsList}`;
}

/**
 * Capitalizes first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { getSkillsData, formatSkillAverage, formatSkills };