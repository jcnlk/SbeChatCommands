import { AQUA, GRAY, Prefix, WHITE, YELLOW } from "src/utils/constantsa";

export const showHelpMenu = () => {
  ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
  ChatLib.chat(`${Prefix} ${YELLOW}Available Commands:`);
  ChatLib.chat("");
  ChatLib.chat(`${AQUA}/scc ${GRAY}- Opens the config menu`);
  ChatLib.chat(`${AQUA}/scc help ${GRAY}- Shows this help menu`);
  ChatLib.chat(`${AQUA}/scc help commands ${GRAY}- Shows all SBE chat commands`);
  ChatLib.chat(`${AQUA}/scc help blacklist ${GRAY}- Shows blacklist help`);
  ChatLib.chat(`${AQUA}/scc help block ${GRAY}- Shows block help`);
  ChatLib.chat(`${AQUA}/scc bl ${GRAY}- Manage blacklisted users`);
  ChatLib.chat(`${AQUA}/scc block ${GRAY}- Manage blocked users`);
  ChatLib.chat(`${AQUA}/scc quote ${GRAY}- Manage quotes`);
  ChatLib.chat(`${AQUA}/scc version ${GRAY}- Shows version info`);
  ChatLib.chat("");
  ChatLib.chat(`${YELLOW}TIP: ${GRAY}Use ${WHITE}/scc${GRAY} to open the config menu!`);
  ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
};

export const help = (topic) => {
  if (!topic) {
    showHelpMenu();
    return;
  }
  switch (topic.toLowerCase()) {
    case "commands":
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
      ChatLib.chat(`${Prefix} ${YELLOW}SBE Chat Commands:`);
      ChatLib.chat("");
      ChatLib.chat(`${AQUA}!rng [item] ${GRAY}- Get RNG chance for an item`);
      ChatLib.chat(`${AQUA}!cf ${GRAY}- Flip a coin`);
      ChatLib.chat(`${AQUA}!8ball ${GRAY}- Ask the magic 8ball`);
      ChatLib.chat(`${AQUA}!throw [player] ${GRAY}- Throw something at someone`);
      ChatLib.chat(`${AQUA}!dice ${GRAY}- Roll a dice`);
      ChatLib.chat(`${AQUA}!simp [player] ${GRAY}- Check simp level`);
      ChatLib.chat(`${AQUA}!sus [player] ${GRAY}- Check sus level`);
      ChatLib.chat(`${AQUA}!join <player> ${GRAY}- Join player's party (Player need to have this module to work)`);
      ChatLib.chat(`${AQUA}!meow ${GRAY}- Meow!`);
      ChatLib.chat(`${AQUA}!quote ${GRAY}- Get a random quote`);
      ChatLib.chat(`${AQUA}!tps ${GRAY}- Show server TPS`);
      ChatLib.chat(`${AQUA}!ping ${GRAY}- Show your ping to the server`);
      ChatLib.chat(`${AQUA}!alpha ${GRAY}- Check Alpha Server status`);
      ChatLib.chat(`${AQUA}!nw [player] ${GRAY}- Check player's networth`);
      ChatLib.chat(`${AQUA}!mayor ${GRAY}- Show current mayor`);
      ChatLib.chat(`${AQUA}!election ${GRAY}- Show election status`);
      ChatLib.chat(`${AQUA}!slayer [player] ${GRAY}- Show player's slayer levels`);
      ChatLib.chat(`${AQUA}!mp [player] ${GRAY}- Show player's magical power`);
      ChatLib.chat(`${AQUA}!level [player] ${GRAY}- Show player's Skyblock level`);
      ChatLib.chat(`${AQUA}!secrets [player] ${GRAY}- Show player's total secrets`);
      ChatLib.chat(`${AQUA}!tax <amount> ${GRAY}- Calculate auction/BIN taxes`);
      ChatLib.chat(`${AQUA}!skills [player] ${GRAY}- Show player's skill levels`);
      ChatLib.chat(`${AQUA}!skillaverage [player] ${GRAY}- Show player's skill average`);
      ChatLib.chat(`${AQUA}!cata [player] ${GRAY}- Show player's Catacombs level`);
      ChatLib.chat(`${AQUA}!pbs [player] ${GRAY}- Show player's dungeon PBs`);
      ChatLib.chat(`${AQUA}!class [player] ${GRAY}- Show player's class levels`);
      ChatLib.chat(`${AQUA}!comp [player] ${GRAY}- Show player's completion counts`);
      ChatLib.chat(`${AQUA}!lbin <item> ${GRAY}- Check lowest BIN price`);
      ChatLib.chat(`${AQUA}!commands ${GRAY}- Show available commands`);
      ChatLib.chat("");
      ChatLib.chat(`${YELLOW}TIP: ${GRAY}Commands can be enabled/disabled in config!`);
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
      break;

    case "blacklist":
    case "bl":
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
      ChatLib.chat(`${Prefix} ${YELLOW}Blacklist Commands:`);
      ChatLib.chat("");
      ChatLib.chat(`${AQUA}/scc bl ${GRAY}- Show blacklisted users`);
      ChatLib.chat(`${AQUA}/scc bl add <username> ${GRAY}- Add user to blacklist`);
      ChatLib.chat(`${AQUA}/scc bl remove <username> ${GRAY}- Remove user from blacklist`);
      ChatLib.chat("");
      ChatLib.chat(`${YELLOW}NOTE: ${GRAY}Blacklisted users cannot use any commands!`);
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
      break;

    case "block":
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
      ChatLib.chat(`${Prefix} ${YELLOW}Block Commands:`);
      ChatLib.chat("");
      ChatLib.chat(`${AQUA}/scc block ${GRAY}- Show blocked users`);
      ChatLib.chat(`${AQUA}/scc block add <username> ${GRAY}- Block a user`);
      ChatLib.chat(`${AQUA}/scc block remove <username> ${GRAY}- Unblock a user`);
      ChatLib.chat("");
      ChatLib.chat(`${YELLOW}NOTE: ${GRAY}Blocked users' messages will not appear in SBE Chat!`);
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
      break;

    default:
      showHelpMenu();
      break;
  }
};
