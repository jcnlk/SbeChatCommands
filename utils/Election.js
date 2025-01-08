import Promise from "../../PromiseV2";
import { CleanPrefix } from "./Constants";
import ApiWrapper from "./ApiWrapper";

/**
 * Fetches election data from Hypixel's SkyBlock API
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
 */
export function getElectionData() {
    return ApiWrapper.getHypixelElection();
}

/**
 * Formats the current Mayor data for display in chat
 * @param {Object} data - The API response object (e.g., result.data)
 * @returns {string} A formatted message about the current Mayor and perks
 */
export function formatMayorData(data) {
    // Basic validation
    if (!data || !data.mayor) {
        console.error(`${CleanPrefix} Could not fetch current mayor data!`);
        return `${CleanPrefix} [Error] No mayor data found.`;
    }

    const mayor = data.mayor;
    let message = `Current Mayor: ${mayor.name}`;

    // Gather mayor's normal perks
    if (mayor.perks && mayor.perks.length > 0) {
        const perkNames = mayor.perks.map((p) => p.name).join(", ");
        message += ` (Perks: ${perkNames})`;
    } else {
        message += ` (No perks found)`;
    }

    // If there's a Minister and a Minister Perk, display it
    if (mayor.minister && mayor.minister.perk) {
        message += ` | Minister: ${mayor.minister.name} (Perk: ${mayor.minister.perk.name})`;
    }

    return message;
}

/**
 * Formats the current election data for display in chat
 * @param {Object} data - The API response object (e.g., result.data)
 * @returns {string} A formatted message about the ongoing election, sorted by votes
 */
export function formatElectionData(data) {
    // Basic validation
    if (!data || !data.mayor || !data.mayor.election) {
        console.error(`${CleanPrefix} Could not fetch current election data!`);
        return `${CleanPrefix} [Error] No election data found.`;
    }

    const election = data.mayor.election;
    if (!election.year || !election.candidates) {
        console.error(`${CleanPrefix} Incomplete election data!`);
        return `${CleanPrefix} [Error] Incomplete election data.`;
    }

    // Start building our output
    let message = `Current Election - Year ${election.year} | `;

    // Sort candidates by votes (descending)
    const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes);
    const totalVotes = getTotalVotes(sortedCandidates);

    // For each candidate, show:
    // "Name: percentage% (Perk1, Perk2, Perk3)"
    const candidateStrings = sortedCandidates.map((candidate) => {
        const votePercent = ((candidate.votes / totalVotes) * 100).toFixed(1);

        // List all perks
        let perkInfo = "";
        if (candidate.perks && candidate.perks.length > 0) {
            const perkNames = candidate.perks.map((p) => p.name).join(", ");
            perkInfo = ` (${perkNames})`;
        }

        return `${candidate.name}: ${votePercent}%${perkInfo}`;
    });

    message += candidateStrings.join(" | ");
    return message;
}

/**
 * Calculates the total number of votes across all candidates
 * @param {Array} candidates - An array of candidate objects
 * @returns {number} Sum of votes from all candidates
 */
function getTotalVotes(candidates) {
    return candidates.reduce((acc, candidate) => acc + (candidate.votes || 0), 0);
}