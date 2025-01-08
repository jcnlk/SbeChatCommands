import Promise from "../../PromiseV2";
import ApiWrapper from "./ApiWrapper";

const SKILL_NAMES = [
    "taming",
    "farming",
    "mining",
    "combat",
    "foraging",
    "fishing",
    "enchanting",
    "alchemy",
    "carpentry",
    "runecrafting",
    "social"
];

/**
 * Gets skills data for a player using SkyCrypt API
 * @param {string} username - Minecraft username
 * @returns {Promise} Skills data or error
 */
export function getSkillsData(username) {
    return ApiWrapper.getSkyCryptProfile(username, true)
        .then(result => {
            if (!result.success) return result;
            
            // Find the selected profile
            const selectedProfile = Object.values(result.data.profiles)
                .find(profile => profile.current);
            
            if (!selectedProfile?.data?.skills?.skills) {
                return { 
                    success: false, 
                    error: "No skills data found for " + username
                };
            }

            const skillsData = {
                average: selectedProfile.data.skills.averageSkillLevel || 0,
                skills: {}
            };

            // Get individual skill levels
            SKILL_NAMES.forEach(skillName => {
                const skillData = selectedProfile.data.skills.skills[skillName];
                if (skillData?.levelWithProgress !== undefined) {
                    skillsData.skills[skillName] = skillData.levelWithProgress;
                }
            });

            return {
                success: true,
                data: skillsData
            };
        });
}

/**
 * Formats skills average for chat output
 * @param {Object} data - Skills data from API
 * @param {string} username - Player username
 * @returns {string} Formatted message
 */
export function formatSkillAverage(data, username) {
    return `${username}'s Skill Average: ${data.average.toFixed(2)}`;
}

/**
 * Formats individual skills for chat output
 * @param {Object} data - Skills data from API
 * @param {string} username - Player username
 * @returns {string} Formatted message
 */
export function formatSkills(data, username) {
    const skillsList = Object.entries(data.skills)
        .map(([name, level]) => `${capitalize(name)}: ${level.toFixed(2)}`)
        .join(" | ");

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
