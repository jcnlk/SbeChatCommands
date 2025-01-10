import apiWrapper from "./apiWrapper";

export function getMagicalPower(username) {
  return apiWrapper.getSkyCryptProfile(username, true).then((result) => {
    if (!result.success) return result;

    // Find the selected profile
    const selectedProfile = Object.values(result.data.profiles).find((profile) => profile.current);

    if (!selectedProfile?.data?.accessories) {
      return {
        success: false,
        error: "No magical power data found for " + username,
      };
    }

    const magicalPower = selectedProfile.data.accessories?.magical_power?.total || 0;

    return {
      success: true,
      data: {
        magicalPower: magicalPower,
      },
    };
  });
}

export function formatMagicalPower(data, username) {
  return username + "'s Magical Power: " + data.magicalPower.toLocaleString();
}
