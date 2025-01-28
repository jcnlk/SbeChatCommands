import apiWrapper from "./apiWrapper";
import { cleanChatPrefix } from "./constants";

export function getSlayerData(username) {
  return apiWrapper.getSkyCryptSlayers(username, true).then((result) => {
    if (!result.success) return result;

    // Find selected profile
    const selectedProfile = Object.values(result.data).find((profile) => profile.selected);

    if (!selectedProfile?.data?.slayers) {
      return {
        success: false,
        error: `No slayer data found for ${username}`,
      };
    }

    return {
      success: true,
      data: selectedProfile.data.slayers,
      totalXp: selectedProfile.data.total_slayer_xp || 0,
    };
  });
}

export function formatSlayerData(data, username) {
  const slayerTypes = [
    { key: "zombie", name: "Revenant" },
    { key: "spider", name: "Tarantula" },
    { key: "wolf", name: "Sven" },
    { key: "enderman", name: "Voidgloom" },
    { key: "blaze", name: "Inferno" },
    { key: "vampire", name: "Riftstalker" },
  ];

  const slayerLevels = slayerTypes
    .filter((type) => data[type.key] && data[type.key].level)
    .map((type) => `${type.name} ${data[type.key].level.currentLevel}`);

  if (slayerLevels.length === 0) {
    console.error(`${cleanChatPrefix} ${username} has no slayer data`);
  }

  return `${username}'s Slayer Levels: ${slayerLevels.join(", ")}`;
}
