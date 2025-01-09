import Promise from "../../PromiseV2";
import ApiWrapper from "./ApiWrapper";

/**
 * Formats a number as a readable string with suffixes (K, M, B)
 * @param {number} num - The number to format
 * @returns {string} - Formatted string
 */
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + "B";
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toFixed(0);
}

/**
 * Gets the networth data for a player from SkyCrypt API
 * @param {string} username - Minecraft username
 * @returns {Promise} - Networth data or error
 */
export function getPlayerNetworth(username) {
    return ApiWrapper.getSkyCryptProfile(username, true).then(result => {
        if (!result.success) return result;

        // Find current profile
        const currentProfile = Object.values(result.data.profiles)
            .find(profile => profile.current);

        if (!currentProfile?.data?.networth) {
            return { 
                success: false, 
                error: `No networth data available for ${username}` 
            };
        }

        const networthData = currentProfile.data.networth;
        return {
            success: true,
            data: {
                username: username,
                profileName: currentProfile.cute_name,
                gameMode: currentProfile.game_mode,
                networth: formatNumber(networthData.networth),
                unsoulboundNetworth: formatNumber(networthData.unsoulboundNetworth),
                noInventory: networthData.noInventory,
                raw: {
                    networth: networthData.networth,
                    unsoulboundNetworth: networthData.unsoulboundNetworth
                }
            }
        };
    });
}

/**
 * Formats the networth message for chat
 * @param {Object} data - Networth data from getPlayerNetworth
 * @returns {string} - Formatted message
 */
export function formatNetworthMessage(data) {
    const gameModeSuffix = data.gameMode !== "normal" ? ` [${data.gameMode}]` : "";
    return `${data.username}'s Networth (${data.profileName}${gameModeSuffix}): ` +
           `${data.networth} | Unsoulbound: ${data.unsoulboundNetworth}`;
}