import defaultData from "../utils/defaultData";
import { help } from "./help";
import { AQUA, GOLD, GRAY, GREEN, chatPrefix, RED, WHITE, YELLOW } from "../utils/constants";

export const blacklist = (action, username) => {
  if (!action) {
    help("blacklist");

    const blacklist = defaultData.getBlacklist();
    if (blacklist.length > 0) {
      ChatLib.chat("");
      ChatLib.chat(`${YELLOW}Currently blacklisted users:`);
      blacklist.forEach((user) => {
        ChatLib.chat(`${AQUA}• ${WHITE}${user}`);
      });
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
    }
    return;
  }

  switch (action) {
    case "add":
      if (!username) {
        ChatLib.chat(`${chatPrefix} ${RED}Please specify a username! ${GRAY}(/scc bl add <username>)`);
        return;
      }
      if (defaultData.addToBlacklist(username)) {
        ChatLib.chat(`${chatPrefix} ${GREEN}Successfully added ${GOLD}${username} ${GREEN}to the blacklist!`);
      } else {
        ChatLib.chat(`${chatPrefix} ${RED}${username} ${GRAY}is already blacklisted!`);
      }
      break;

    case "remove":
      if (!username) {
        ChatLib.chat(`${chatPrefix} ${RED}Please specify a username! ${GRAY}(/scc bl remove <username>)`);
        return;
      }
      if (defaultData.removeFromBlacklist(username)) {
        ChatLib.chat(`${chatPrefix} ${GREEN}Successfully removed ${GOLD}${username} ${GREEN}from the blacklist!`);
      } else {
        ChatLib.chat(`${chatPrefix} ${RED}${username} ${GRAY}is not blacklisted!`);
      }
      break;

    default:
      help("blacklist");
      break;
  }
};
