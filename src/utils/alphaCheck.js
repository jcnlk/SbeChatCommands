import apiWrapper from "./apiWrapper";
import { Prefix, GREEN, RED, YELLOW, GRAY } from "./constants";

let lastCheckTime = 0;
let lastSbeCheckTime = 0;
const CHECK_INTERVAL = 300000; // 5 minutes for regular command
const SBE_CHECK_INTERVAL = 60000; // 1 minute for SBE chat command

const isAlphaOpen = (maxPlayers) => {
  return maxPlayers >= 100 && maxPlayers <= 999;
};

const checkAlphaStatus = () => {
  const currentTime = Date.now();
  if (currentTime - lastCheckTime < CHECK_INTERVAL) {
    const remainingTime = Math.ceil((CHECK_INTERVAL - (currentTime - lastCheckTime)) / 1000);
    ChatLib.chat(`${Prefix} ${RED}Please wait ${remainingTime} seconds before checking again.`);
    return;
  }

  lastCheckTime = currentTime;

  apiWrapper.getAlphaStatus().then((result) => {
    if (!result.success) {
      ChatLib.chat(`${Prefix} ${RED}Error while checking Alpha Server status.`);
      return;
    }

    const serverData = result.data;

    if (!serverData.online) {
      ChatLib.chat(`${Prefix} ${RED}Alpha Server is offline.`);
      return;
    }

    const maxPlayers = serverData.players?.max;
    if (!maxPlayers && maxPlayers !== 0) {
      ChatLib.chat(`${Prefix} ${RED}Could not fetch player slots.`);
      return;
    }

    if (isAlphaOpen(maxPlayers)) {
      ChatLib.chat(`${Prefix} ${GREEN}Alpha Server might be open! ${GRAY}(${maxPlayers} slots)`);
      World.playSound("random.orb", 1, 1);
    } else {
      ChatLib.chat(`${Prefix} ${YELLOW}Alpha Server is currently closed. ${GRAY}(${maxPlayers} slots)`);
    }
  });
};

const checkAlphaStatusSbe = (callback) => {
  const currentTime = Date.now();
  if (currentTime - lastSbeCheckTime < SBE_CHECK_INTERVAL) {
    return;
  }

  lastSbeCheckTime = currentTime;

  apiWrapper.getAlphaStatus().then((result) => {
    if (!result.success) {
      callback(null, 0);
      return;
    }

    const serverData = result.data;
    const maxPlayers = serverData.players?.max;

    // Only consider it a failure if we truly can't get the data
    if (!serverData.online || maxPlayers === undefined || maxPlayers === null) {
      callback(null, 0);
      return;
    }

    // If we have the maxPlayers value, even if it's 0, process it
    callback(isAlphaOpen(maxPlayers), maxPlayers);
  });
};

// Register regular command
register("command", () => {
  checkAlphaStatus();
})
  .setName("checkalpha")
  .setAliases(["alphastatus", "as"]);

export { checkAlphaStatus, checkAlphaStatusSbe };
