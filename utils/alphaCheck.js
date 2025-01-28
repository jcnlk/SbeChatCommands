import apiWrapper from "./apiWrapper";
import { chatPrefix, GREEN, RED, YELLOW, GRAY } from "./constants";

let lastCheckTime = 0;
let lastSbeCheckTime = 0;
const CHECK_INTERVAL = 300000;
const SBE_CHECK_INTERVAL = 60000;

const isAlphaOpen = (maxPlayers) => {
  return maxPlayers >= 100 && maxPlayers <= 999;
};

export const checkAlphaStatus = () => {
  const currentTime = Date.now();
  if (currentTime - lastCheckTime < CHECK_INTERVAL) {
    const remainingTime = Math.ceil((CHECK_INTERVAL - (currentTime - lastCheckTime)) / 1000);
    ChatLib.chat(`${chatPrefix} ${RED}Please wait ${remainingTime} seconds before checking again.`);
    return;
  }

  lastCheckTime = currentTime;

  apiWrapper.getAlphaStatus().then((result) => {
    if (!result.success) {
      ChatLib.chat(`${chatPrefix} ${RED}Error while checking Alpha Server status.`);
      return;
    }

    const serverData = result.data;

    if (!serverData.online) {
      ChatLib.chat(`${chatPrefix} ${RED}Alpha Server is offline.`);
      return;
    }

    const maxPlayers = serverData.players?.max;
    if (!maxPlayers && maxPlayers !== 0) {
      ChatLib.chat(`${chatPrefix} ${RED}Could not fetch player slots.`);
      return;
    }

    if (isAlphaOpen(maxPlayers)) {
      ChatLib.chat(`${chatPrefix} ${GREEN}Alpha Server might be open! ${GRAY}(${maxPlayers} slots)`);
      World.playSound("random.orb", 1, 1);
    } else {
      ChatLib.chat(`${chatPrefix} ${YELLOW}Alpha Server is currently closed. ${GRAY}(${maxPlayers} slots)`);
    }
  });
};

export const checkAlphaStatusSbe = (callback) => {
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

    if (!serverData.online || maxPlayers === undefined || maxPlayers === null) {
      callback(null, 0);
      return;
    }

    callback(isAlphaOpen(maxPlayers), maxPlayers);
  });
};

register("command", () => {
  checkAlphaStatus();
})
  .setName("checkalpha")
  .setAliases(["alphastatus", "as"]);
