import defaultData from "./utils/defaultData";
import "./utils/CommandHandler";
import config from "./config";
import "./utils/magicalPower";
import "./utils/serverUtils";
import "./utils/alphaCheck";
import "./utils/apiWrapper";
import "./features/mining";
import "./utils/lowestBin";
import "./utils/networth";
import "./utils/election";
import "./utils/dungeon";
import "./utils/skills";
import "./utils/slayer";
import "./utils/level";
import "./utils/taxes";
import "./utils/area";
import { AQUA, YELLOW, moduleVersion, moduleCreator, chatPrefix } from "./utils/constants";
import commands from "./commands";
import { showHelpMenu } from "./commands/help";

register("command", () => {
  defaultData.displayAchievements();
})
  .setName("sccachievements")
  .setAliases(["scca"]);

register("command", (...args) => {
  if (!args || args.length === 0 || !args[0]) {
    config.openGUI();
    return;
  }

  const subCommand = String(args[0]).toLowerCase();
  const action = args.length > 1 ? String(args[1]).toLowerCase() : null;
  const username = args.length > 2 ? args[2] : null;

  switch (subCommand) {
    case "blacklist":
    case "bl":
      commands.blacklist(action, username);
      break;

    case "block":
      commands.block(action, username);
      break;

    case "quote":
      commands.quote(action, ...args.slice(2));
      break;

    case "config":
    case "gui":
    case "setting":
    case "settings":
      config.openGUI();
      break;

    case "help":
    case "?":
      commands.help(action);
      break;

    case "version":
    case "ver":
      ChatLib.chat(`${chatPrefix} ${YELLOW}Version: ${AQUA}${moduleVersion}`);
      ChatLib.chat(`${chatPrefix} ${YELLOW}Created by: ${AQUA}${moduleCreator}`);
      break;

    default:
      showHelpMenu();
      break;
  }
})
  .setName("sbechatcommands")
  .setAliases(["scc"]);
