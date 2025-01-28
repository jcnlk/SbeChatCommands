import config from "../config";
import defaultData from "./defaultData";
import { getAverageTps, getCurrentTps, getPing } from "./serverUtils";
import { checkAlphaStatusSbe } from "./alphaCheck";
import { getPlayerNetworth, formatNetworthMessage } from "./networth";
import { getElectionData, formatMayorData, formatElectionData } from "./election";
import { getSlayerData, formatSlayerData } from "./slayer";
import {
  getSecretsData,
  formatSecrets,
  getDungeonData,
  formatCataLevel,
  formatPBs,
  formatClassLevels,
  formatCompletions,
  parseParameters,
} from "./dungeon";
import { getMagicalPower, formatMagicalPower } from "./magicalPower";
import { getSkyblockLevel, formatLevelData } from "./level";
import { formatTaxMessage, parseNumberInput, getTaxInfo } from "./taxes";
import { getSkillsData, formatSkillAverage, formatSkills } from "./skills";
import { getLowestBin, formatLowestBin } from "./lowestBin";
import { chatPrefix, cleanChatPrefix, RED, RESET } from "./constants";

// Load command messages from JSON
let commandMessages;
try {
  const jsonPath = "./data/sbeChatCommands.json";
  const jsonContent = FileLib.read("SbeChatCommands", jsonPath);
  if (!jsonContent) {
    throw new Error(`sbeChatCommands.json not found at path: ${jsonPath}`);
  }
  commandMessages = JSON.parse(jsonContent);
} catch (error) {
  console.error(`Error loading sbeChatCommands.json:`, error);
  commandMessages = {};
}

class CommandHandler {
  constructor() {
    this.commands = new Map();
    this.initializeCommands();
    this.initializeChatListener();
  }

  initializeChatListener() {
    register("chat", (name, message, event) => {
      if (config.hideCommandMessages && message.startsWith("!")) {
        cancel(event);
        return;
      }

      if (config.hideCommandOutputs && message.includes("[SCC]")) {
        cancel(event);
        return;
      }

      let senderName = name.replace(/\[.*?\]\s*/, "");

      if (defaultData.isBlocked(senderName)) {
        cancel(event);
        return;
      }

      if (senderName === Player.getName()) {
        defaultData.setFirstMessageSent();
      }

      if (message.toLowerCase() === "meow") {
        this.handleMeowMessage(senderName);
        return;
      }

      if (!message.startsWith("!")) return;
      if (defaultData.isBlacklisted(senderName)) return;
      if (!config.enableAllCommands) return;

      const args = message.slice(1).split(" ");
      const commandName = args.shift().toLowerCase();

      this.executeCommand(senderName, commandName, args);
    }).setCriteria("SBE Chat > ${name}: ${message}");
  }

  initializeCommands() {
    // RNG Command
    this.registerCommand(
      "rng",
      (sender, args) => {
        if (!config.rngCommand) return;
        const rng = Math.floor(Math.random() * 101);
        const item = args.join(" ").toLowerCase() || null;
        this.sendMessage("rng", { playerName: sender, rng, dropString: item ? ` for ${item}` : "" });
      },
      "rngCommand"
    );

    // Coinflip Command
    this.registerCommand(
      ["cf", "coinflip"],
      (sender, args) => {
        if (!config.cfCommand) return;
        const result = Math.random() < 0.5 ? "heads" : "tails";
        this.sendMessage("cf", { playerName: sender, result });
      },
      "cfCommand"
    );

    // 8Ball Command
    this.registerCommand(
      ["8ball", "ask"],
      (sender, args) => {
        if (!config.eightBallCommand) return;
        const responses = commandMessages["8ballResponses"];
        const response = responses[Math.floor(Math.random() * responses.length)];
        ChatLib.command(`sbechat ${cleanChatPrefix} ${response}`, true);
      },
      "eightBallCommand"
    );

    // Throw Command
    this.registerCommand(
      ["throw", "shitter"],
      (sender, args) => {
        if (!config.throwCommand) return;
        const throwIntensity = Math.floor(Math.random() * 101);
        const target = args[0] || sender;
        this.sendMessage("throw", { playerName: target, throwIntensity });
      },
      "throwCommand"
    );

    // Dice Command
    this.registerCommand(
      ["dice", "roll"],
      (sender, args) => {
        if (!config.diceCommand) return;
        const result = Math.floor(Math.random() * 6) + 1;
        this.sendMessage("dice", { playerName: sender, result });
      },
      "diceCommand"
    );

    // Simp Command
    this.registerCommand(
      "simp",
      (sender, args) => {
        if (!config.simpCommand) return;
        const target = args[0] || sender;
        const percentage = Math.floor(Math.random() * 101);
        this.sendMessage("simp", { playerName: target, percentage });
      },
      "simpCommand"
    );

    // Sus Command
    this.registerCommand(
      "sus",
      (sender, args) => {
        if (!config.susCommand) return;
        const target = args[0] || sender;
        const percentage = Math.floor(Math.random() * 101);
        this.sendMessage("sus", { playerName: target, percentage });
      },
      "susCommand"
    );

    // Join Command
    this.registerCommand(
      ["join", "j"],
      (sender, args) => {
        if (!config.joinCommand) return;
        const playerToJoin = args[0];
        if (!playerToJoin) return;

        const clientUsername = Player.getName();
        if (playerToJoin.toLowerCase() === clientUsername.toLowerCase()) {
          ChatLib.command(`party ${sender}`);
        }
      },
      "joinCommand"
    );

    // Meow Command
    this.registerCommand(
      "meow",
      (sender, args) => {
        if (!config.meowCommand) return;
        const personal = defaultData.getPersonalMeowCount();
        this.sendMessage("meow", { personal });
      },
      "meowCommand"
    );

    // Quote Command
    this.registerCommand(
      "quote",
      (sender, args) => {
        if (!config.quoteCommand) return;
        const randomQuote = defaultData.getRandomQuote();
        if (randomQuote) {
          ChatLib.command(`sbechat ${cleanChatPrefix} Quote: "${randomQuote}"`, true);
        } else {
          ChatLib.chat(`${chatPrefix} No quotes found! Add some with /scc quote add <quote>`);
        }
      },
      "quoteCommand"
    );

    // TPS Command
    this.registerCommand(
      "tps",
      (sender, args) => {
        if (!config.tpsCommand) return;
        const avgTps = getAverageTps();
        const currentTps = getCurrentTps();
        ChatLib.command(`sbechat ${cleanChatPrefix} Current TPS: ${currentTps} | Average: ${avgTps}`, true);
      },
      "tpsCommand"
    );

    // Ping Command
    this.registerCommand(
      "ping",
      (sender, args) => {
        if (!config.pingCommand) return;
        getPing((ping) => {
          ChatLib.command(`sbechat ${cleanChatPrefix} Current Ping: ${ping}ms`, true);
        });
      },
      "pingCommand"
    );

    // Alpha Command
    this.registerCommand(
      ["alpha", "alphastatus", "alphastate"],
      (sender, args) => {
        if (!config.alphaCommand) return;
        checkAlphaStatusSbe((status, slots) => {
          const message =
            status === null
              ? "Could not fetch Alpha Server status. Try again later."
              : status
              ? `Alpha Server is open! (${slots} slots)`
              : `Alpha Server is currently closed. (${slots} slots)`;
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "alphaCommand"
    );

    // Networth Command
    this.registerCommand(
      ["nw", "networth"],
      (sender, args) => {
        if (!config.networthCommand) return;
        const playerToCheck = args[0] || sender;
        getPlayerNetworth(playerToCheck).then((result) => {
          if (result.success) {
            ChatLib.command(`sbechat ${cleanChatPrefix} ${formatNetworthMessage(result.data)}`, true);
          } else {
            console.error(`${cleanChatPrefix} ${result.error}`);
          }
        });
      },
      "networthCommand"
    );

    // Mayor Command
    this.registerCommand(
      "mayor",
      (sender, args) => {
        if (!config.mayorCommand) return;
        getElectionData().then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ${result.error}`);
            return;
          }
          const message = formatMayorData(result.data);
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "mayorCommand"
    );

    // Tax Command
    this.registerCommand(
      ["tax", "taxes"],
      (sender, args) => {
        if (!config.taxCommand) return;

        if (!args.length) {
          return;
        }

        const amount = parseNumberInput(args[0]);

        if (!amount || isNaN(amount) || amount <= 0) {
          return;
        }

        getTaxInfo(amount).then((taxInfo) => {
          ChatLib.command("sbechat " + `${cleanChatPrefix} ` + formatTaxMessage(taxInfo), true);
        });
      },
      "taxCommand"
    );

    // Election Command
    this.registerCommand(
      "election",
      (sender, args) => {
        if (!config.electionCommand) return;
        getElectionData().then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ${result.error}`);
            return;
          }
          const message = formatElectionData(result.data);
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "electionCommand"
    );

    // Slayer Command
    this.registerCommand(
      "slayer",
      (sender, args) => {
        if (!config.slayerCommand) return;
        const playerToCheck = args[0] || sender;
        getSlayerData(playerToCheck).then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ${result.error}`);
            return;
          }
          const message = formatSlayerData(result.data, playerToCheck);
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "slayerCommand"
    );

    // Lowest BIN Command
    this.registerCommand(
      ["lbin", "lowestbin"],
      (sender, args) => {
        if (!config.lowestBinCommand) return;

        const searchQuery = args.join(" ");
        getLowestBin(searchQuery).then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ${result.error}`);
            return;
          }
          const message = formatLowestBin(result.data, searchQuery);
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "lowestBinCommand"
    );

    // Skills Command
    this.registerCommand(
      ["skills", "skill", "skilllvl", "skilllevel"],
      (sender, args) => {
        if (!config.skillsCommand) return;
        const playerToCheck = args[0] || sender;
        getSkillsData(playerToCheck).then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ${result.error}`);
            return;
          }
          const message = formatSkills(result.data, playerToCheck);
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "skillsCommand"
    );

    // Skill Average Command
    this.registerCommand(
      ["skillaverage", "sa"],
      (sender, args) => {
        if (!config.skillAverageCommand) return;
        const playerToCheck = args[0] || sender;
        getSkillsData(playerToCheck).then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ${result.error}`);
            return;
          }
          const message = formatSkillAverage(result.data, playerToCheck);
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "skillAverageCommand"
    );

    // Level Command
    this.registerCommand(
      ["level", "lvl", "sblvl", "sblevel", "skyblocklvl", "skyblocklevel"],
      (sender, args) => {
        if (!config.levelCommand) return;
        const playerToCheck = args[0] || sender;

        getSkyblockLevel(playerToCheck).then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ${result.error}`);
            return;
          }
          const message = formatLevelData(result.data, playerToCheck);
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "levelCommand"
    );

    // Magical Power Command
    this.registerCommand(
      ["mp", "magicalpower"],
      (sender, args) => {
        if (!config.magicalPowerCommand) return;

        const playerToCheck = args[0] || sender;

        getMagicalPower(playerToCheck).then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ${result.error}`);
            return;
          }
          const message = formatMagicalPower(result.data, playerToCheck);
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "magicalPowerCommand"
    );

    // Dungeon PBs Command
    this.registerCommand(
      ["pbs", "pb"],
      (sender, args) => {
        if (!config.pbsCommand) return;

        const params = parseParameters(args);
        const playerToCheck = params.playerName || sender;

        getDungeonData(playerToCheck).then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ${result.error}`);
            return;
          }
          const message = formatPBs(result.data, playerToCheck, params.isMasterMode);
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "pbsCommand"
    );

    // Completions Command
    this.registerCommand(
      ["comp", "comps", "runs"],
      (sender, args) => {
        if (!config.compCommand) return;

        const params = parseParameters(args);
        const playerToCheck = params.playerName || sender;

        getDungeonData(playerToCheck).then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ${result.error}`);
            return;
          }
          const message = formatCompletions(result.data, playerToCheck, params.isMasterMode);
          ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
        });
      },
      "compCommand"
    );

    // Class Levels Command
    this.registerCommand(
      ["class", "classlvl", "classlevel"],
      (sender, args) => {
        if (!config.classCommand) return;
        const playerToCheck = args[0] || sender;
        getDungeonData(playerToCheck).then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ` + result.error);
            return;
          }
          const message = formatClassLevels(result.data, playerToCheck);
          ChatLib.command("sbechat " + `${cleanChatPrefix} ` + message, true);
        });
      },
      "classCommand"
    );

    // Catacombs Level Command
    this.registerCommand(
      ["cata", "catalvl", "catalevel"],
      (sender, args) => {
        if (!config.cataCommand) return;
        const playerToCheck = args[0] || sender;
        getDungeonData(playerToCheck).then((result) => {
          if (!result.success) {
            console.error(`${cleanChatPrefix} ` + result.error);
            return;
          }
          const message = formatCataLevel(result.data, playerToCheck);
          ChatLib.command("sbechat " + `${cleanChatPrefix} ` + message, true);
        });
      },
      "cataCommand"
    );

    // Secrets Command
    this.registerCommand(
      ["secrets", "secret"],
      (sender, args) => {
        if (!config.secretsCommand) return;
        const playerToCheck = args[0] || sender;
        getSecretsData(playerToCheck).then((result) => {
          if (!result.success) {
            console.error(`$${cleanChatPrefix} ` + result.error);
            return;
          }
          const message = formatSecrets(result.data, playerToCheck);
          ChatLib.command("sbechat " + `${cleanChatPrefix} ` + message, true);
        });
      },
      "secretsCommand"
    );

    // Commands/Help Command
    this.registerCommand(
      ["commands", "help", "command"],
      (sender, args) => {
        if (!config.commandsCommand) return;
        if (!args || args.length === 0 || args[0].toLowerCase() === "list") {
          ChatLib.command(
            `sbechat ${cleanChatPrefix} Available commands: !rng, !cf, !8ball, !throw, !dice, !simp, !sus, !join, !meow, !quote, !tps, !ping, !alpha, !nw, !mayor, !election, !slayer, !mp, !level, !secrets, !tax, !skills, !skillaverage, !cata, !pbs, !class, !comp, !lbin`,
            true
          );
          return;
        }
      },
      "commandsCommand"
    );
  }

  registerCommand(names, handler, configKey = null) {
    const commandNames = typeof names === "string" ? [names] : names;

    commandNames.forEach((name) => {
      if (typeof name !== "string") {
        console.error("Invalid command name:", name);
        return;
      }
      this.commands.set(name.toLowerCase(), {
        handler,
        configKey,
      });
    });
  }

  handleMeowMessage(senderName) {
    defaultData.incrementMeowCount();

    if (senderName === Player.getName()) {
      defaultData.incrementPersonalMeowCount();
    }

    if (
      senderName !== Player.getName() &&
      !defaultData.isBlacklisted(senderName) &&
      defaultData.canAutoRespondMeow() &&
      config.autoMeowResponse
    ) {
      defaultData.updateLastMeowResponse();
      ChatLib.command(`sbechat meow`, true);
    }
  }

  canExecuteCommand(sender) {
    if (defaultData.isBlacklisted(sender)) return false;
    if (defaultData.isOnCooldown(sender)) {
      if (sender === Player.getName()) {
        const remainingTime = defaultData.getRemainingCooldown(sender);
        ChatLib.chat(`${chatPrefix} ${RED}Please wait ${remainingTime} seconds before using another command!${RESET}`);
      }
      return false;
    }
    return true;
  }

  executeCommand(sender, commandName, args) {
    const command = this.commands.get(commandName);
    if (!command) return;

    if (!this.canExecuteCommand(sender)) return;
    defaultData.setCooldown(sender);

    const immediateCommands = ["tps", "ping", "meow"];
    if (immediateCommands.includes(commandName)) {
        command.handler(sender, args);
        return;
    }

    getPing((ping) => {
        const baseWait = 3 * ping;
        const randomExtra = Math.floor(Math.random() * 1500);
        let totalWait = baseWait + randomExtra;

        if (totalWait < 500) {
            totalWait = 500;
        } else if (totalWait > 4000) {
            totalWait = 4000;
        }

        ChatLib.chat(`Waiting time: ${totalWait}`); //debug

        let canceled = false;

        const tempChatTrigger = register("chat", (msg, event) => {
            if (msg.includes("[SCC]")) {
                canceled = true;
            }
        }).setCriteria("${msg}");

        setTimeout(() => {
            tempChatTrigger.unregister();

            if (!canceled) {
                command.handler(sender, args);
            }
        }, totalWait);
    });
  }

  generateMessage(commandType, variables) {
    if (!commandMessages[commandType]) {
      console.error(`${cleanChatPrefix} Invalid command type: ${commandType}`);
      return null;
    }

    let templates;
    switch (commandType) {
      case "rng":
        templates =
          variables.rng <= 30 ? commandMessages.rng.low : variables.rng <= 70 ? commandMessages.rng.medium : commandMessages.rng.high;
        break;
      case "throw":
      case "shitter":
        templates =
          variables.throwIntensity <= 30
            ? commandMessages.throw.low
            : variables.throwIntensity <= 70
            ? commandMessages.throw.medium
            : commandMessages.throw.high;
        break;
      case "cf":
      case "coinflip":
        templates = commandMessages.cf[variables.result];
        break;
      case "dice":
        templates =
          variables.result <= 2
            ? commandMessages.dice.low
            : variables.result <= 4
            ? commandMessages.dice.medium
            : commandMessages.dice.high;
        break;
      case "simp":
      case "sus":
        templates =
          variables.percentage <= 33
            ? commandMessages[commandType].low
            : variables.percentage <= 66
            ? commandMessages[commandType].medium
            : commandMessages[commandType].high;
        break;
      default:
        templates = commandMessages[commandType];
    }

    if (!Array.isArray(templates)) {
      console.error(`${cleanChatPrefix} Invalid template array for ${commandType}`);
      return null;
    }

    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace(/\${(\w+)}/g, (_, key) => (variables[key] !== undefined ? variables[key] : ""));
  }

  sendMessage(commandType, variables) {
    const message = this.generateMessage(commandType, variables);
    if (message) {
      ChatLib.command(`sbechat ${cleanChatPrefix} ${message}`, true);
    }
  }
}

const commandHandler = new CommandHandler();
export default commandHandler;
