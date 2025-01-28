import defaultData from "../utils/defaultData";
import { help } from "./help";
import { AQUA, GOLD, GRAY, GREEN, chatPrefix, RED, WHITE, YELLOW } from "../utils/constants";

export const block = (action, username) => {
  if (!action) {
    help("block");

    const blocked = defaultData.getBlockedUsers();
    if (blocked.length > 0) {
      ChatLib.chat("");
      ChatLib.chat(`${YELLOW}Currently blocked users:`);
      blocked.forEach((user) => {
        ChatLib.chat(`${AQUA}• ${WHITE}${user}`);
      });
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
    }
    return;
  }

  switch (action) {
    case "add":
      if (!username) {
        ChatLib.chat(`${chatPrefix} ${RED}Please specify a username! ${GRAY}(/scc block add <username>)`);
        return;
      }
      if (defaultData.addToBlocked(username)) {
        ChatLib.chat(`${chatPrefix} ${GREEN}Successfully blocked ${GOLD}${username}${GREEN}!`);
      } else {
        ChatLib.chat(`${chatPrefix} ${RED}${username} ${GRAY}is already blocked!`);
      }
      break;

    case "remove":
      if (!username) {
        ChatLib.chat(`${chatPrefix} ${RED}Please specify a username! ${GRAY}(/scc block remove <username>)`);
        return;
      }
      if (defaultData.removeFromBlocked(username)) {
        ChatLib.chat(`${chatPrefix} ${GREEN}Successfully unblocked ${GOLD}${username}${GREEN}!`);
      } else {
        ChatLib.chat(`${chatPrefix} ${RED}${username} ${GRAY}is not blocked!`);
      }
      break;

    default:
      help("block");
      break;
  }
};
