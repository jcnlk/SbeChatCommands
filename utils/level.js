import apiWrapper from "./apiWrapper";

/**
 * Gets the Skyblock level of a player using the SkyCrypt API
 * @param {string} username - Minecraft username
 * @returns {Promise} Level data or error
 */
export function getSkyblockLevel(username) {
  return apiWrapper.getSkyCryptProfile(username, true).then((result) => {
    if (!result.success) return result;

    // Find the current profile
    const selectedProfile = Object.values(result.data.profiles).find((profile) => profile.current);

    if (!selectedProfile?.data?.skyblock_level) {
      return {
        success: false,
        error: "No Skyblock level data found for " + username,
      };
    }

    const levelData = selectedProfile.data.skyblock_level;
    return {
      success: true,
      data: {
        level: Math.floor(levelData.levelWithProgress),
        progress: ((levelData.levelWithProgress % 1) * 100).toFixed(0),
      },
    };
  });
}

/**
 * Formats level data for chat output
 * @param {Object} data - Level data from API
 * @param {string} username - Player username
 * @returns {string} Formatted message
 */
export function formatLevelData(data, username) {
  return `${username}'s Skyblock Level: ${data.level} (${data.progress}%)`;
}
