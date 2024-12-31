import request from "../../requestV2";
import Promise from "../../PromiseV2";

function getMagicalPower(username) {
    return new Promise(function(resolve) {
        request({
            url: "https://sky.shiiyu.moe/api/v2/profile/" + username,
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
                
                if (!selectedProfile || !selectedProfile.data || !selectedProfile.data.accessories) {
                    resolve({ 
                        success: false, 
                        error: "No magical power data found for " + username
                    });
                    return;
                }

                const magicalPower = selectedProfile.data.accessories?.magical_power?.total || 0;

                resolve({
                    success: true,
                    data: {
                        magicalPower: magicalPower
                    }
                });
            } catch (error) {
                console.error("Error processing magical power data:", error);
                resolve({
                    success: false,
                    error: "Failed to process magical power data for " + username
                });
            }
        }).catch(function(error) {
            console.error("Error fetching magical power data:", error);
            resolve({
                success: false,
                error: "Failed to fetch magical power data for " + username
            });
        });
    });
}

function formatMagicalPower(data, username) {
    return username + "'s Magical Power: " + data.magicalPower.toLocaleString();
}

export { getMagicalPower, formatMagicalPower };