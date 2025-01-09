import { defaultData } from "src";
import { help } from "./help";
import { AQUA, GOLD, GRAY, GREEN, Prefix, RED, WHITE, YELLOW } from "src/utils/constantsa";

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
        ChatLib.chat(`${Prefix} ${RED}Please specify a username! ${GRAY}(/scc bl add <username>)`);
        return;
      }
      if (defaultData.addToBlacklist(username)) {
        ChatLib.chat(`${Prefix} ${GREEN}Successfully added ${GOLD}${username} ${GREEN}to the blacklist!`);
      } else {
        ChatLib.chat(`${Prefix} ${RED}${username} ${GRAY}is already blacklisted!`);
      }
      break;

    case "remove":
      if (!username) {
        ChatLib.chat(`${Prefix} ${RED}Please specify a username! ${GRAY}(/scc bl remove <username>)`);
        return;
      }
      if (defaultData.removeFromBlacklist(username)) {
        ChatLib.chat(`${Prefix} ${GREEN}Successfully removed ${GOLD}${username} ${GREEN}from the blacklist!`);
      } else {
        ChatLib.chat(`${Prefix} ${RED}${username} ${GRAY}is not blacklisted!`);
      }
      break;

    default:
      help("blacklist");
      break;
  }
};
