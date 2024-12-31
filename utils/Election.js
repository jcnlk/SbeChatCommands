import request from "../../requestV2";
import Promise from "../../PromiseV2";

/**
 * Fetches election data from Hypixel API
 * @returns {Promise} Election data or error
 */
function getElectionData() {
    return new Promise((resolve) => {
        request({
            url: "https://api.hypixel.net/v2/resources/skyblock/election",
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        }).then(response => {
            try {
                const data = JSON.parse(response);
                if (!data.success) {
                    resolve({ 
                        success: false, 
                        error: "Failed to fetch election data" 
                    });
                    return;
                }

                resolve({
                    success: true,
                    data: data
                });
            } catch (error) {
                resolve({
                    success: false,
                    error: "Failed to process election data"
                });
            }
        }).catch(error => {
            resolve({
                success: false,
                error: "Failed to fetch election data"
            });
        });
    });
}

/**
 * Formats current mayor data for chat
 * @param {Object} data - Election data from API
 * @returns {string} Formatted message
 */
export function formatMayorData(data) {
    if (!data.mayor) {
        return "Could not fetch current mayor data!";
    }

    const mayor = data.mayor;
    let message = `Current Mayor: ${mayor.name} | Perks: `;
    
    const perkNames = mayor.perks.map(perk => perk.name).join(", ");
    message += perkNames;

    // Add minister information if available
    if (mayor.election && mayor.election.candidates) {
        const winningCandidate = mayor.election.candidates.find(c => c.key === mayor.key);
        if (winningCandidate) {
            const ministerPerk = winningCandidate.perks.find(perk => perk.minister);
            if (ministerPerk) {
                message += ` | Minister Perk: ${ministerPerk.name}`;
            }
        }
    }

    return message;
}

/**
 * Formats election candidate data for chat
 * @param {Object} data - Election data from API
 * @returns {string} Formatted message
 */
export function formatElectionData(data) {
    if (!data.current || !data.current.candidates) {
        return "Could not fetch current election data!";
    }

    let message = `Current Election - Year ${data.current.year} | `;
    
    const sortedCandidates = [...data.current.candidates].sort((a, b) => b.votes - a.votes);
    const totalVotes = getTotalVotes(sortedCandidates);
    
    const candidateInfos = sortedCandidates.map(candidate => {
        const votePercent = ((candidate.votes / totalVotes) * 100).toFixed(1);
        const ministerPerk = candidate.perks.find(perk => perk.minister);
        const perkInfo = ministerPerk ? ` (${ministerPerk.name})` : "";
        return `${candidate.name}: ${votePercent}%${perkInfo}`;
    });

    message += candidateInfos.join(" | ");
    
    return message;
}

/**
 * Calculates total votes
 * @param {Array} candidates - Array of candidates
 * @returns {number} Total votes
 */
function getTotalVotes(candidates) {
    return candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
}

/**
 * Register both mayor and election commands
 * @param {Object} commandHandler - The command handler instance
 */
export function registerMayorAndElectionCommands(commandHandler) {
    // Mayor command
    commandHandler.registerCommand("mayor", (sender, args) => {
        if (!commandHandler.config.mayorCommand) return;
        
        getElectionData().then(result => {
            if (!result.success) {
                ChatLib.command(`sbechat ${result.error}`, true);
                return;
            }

            const message = formatMayorData(result.data);
            ChatLib.command(`sbechat ${message}`, true);
        });
    }, "mayorCommand");

    // Election command
    commandHandler.registerCommand("election", (sender, args) => {
        if (!commandHandler.config.electionCommand) return;
        
        getElectionData().then(result => {
            if (!result.success) {
                ChatLib.command(`sbechat ${result.error}`, true);
                return;
            }

            const message = formatElectionData(result.data);
            ChatLib.command(`sbechat ${message}`, true);
        });
    }, "electionCommand");
}

export { getElectionData };