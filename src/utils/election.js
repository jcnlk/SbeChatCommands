import apiWrapper from "./apiWrapper";
import { CleanPrefix } from "./constants";

/**
 * Fetches election data from Hypixel's SkyBlock API
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
 */
export function getElectionData() {
  return apiWrapper.getHypixelElection();
}

/**
 * Formats the current Mayor data for display in chat
 * @param {Object} data - The API response object (e.g., result.data)
 * @returns {string} A formatted message about the current Mayor and perks
 */
export function formatMayorData(data) {
  if (!data || !data.mayor) {
    console.error(`${CleanPrefix} Could not fetch current mayor data!`);
    //return `${CleanPrefix} [Error] No mayor data found.`;
  }

  const mayor = data.mayor;
  let message = `Current Mayor: ${mayor.name}`;

  // Perks
  if (mayor.perks && mayor.perks.length > 0) {
    const perkNames = mayor.perks.map((p) => p.name).join(", ");
    message += ` (Perks: ${perkNames})`;
  } else {
    message += ` (No perks found)`;
  }

  // Minister
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
  let election = null;
  
  if (data?.current?.candidates?.length > 0) {
    election = {
      year: data.current.year,
      candidates: data.current.candidates
    };
  } else if (data?.mayor?.election?.candidates?.length > 0) {
    election = {
      year: data.mayor.election.year,
      candidates: data.mayor.election.candidates
    };
  }

  if (!election) {
    console.error(`${CleanPrefix} Could not fetch election data!`);
    //return `${CleanPrefix} [Error] No (valid) election data found.`;
  }

  let message = `Current Election - Year ${election.year} | `;

  const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes);
  const totalVotes = getTotalVotes(sortedCandidates);

  const candidateStrings = sortedCandidates.map((candidate) => {
    const votePercent = ((candidate.votes / totalVotes) * 100).toFixed(1);

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

function getTotalVotes(candidates) {
  return candidates.reduce((acc, candidate) => acc + (candidate.votes || 0), 0);
}