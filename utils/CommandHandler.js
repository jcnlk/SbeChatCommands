import config from '../config';
import defaultData from '../utils/Data';
import { getCurrentArea } from '../utils/Area';
import { getAverageTps, getCurrentTps, getPing } from '../utils/Network';
import { checkAlphaStatusSbe } from '../utils/AlphaCheck';
import { getPlayerNetworth, formatNetworthMessage } from '../utils/Networth';
import { 
    Prefix, 
    RED, 
    RESET, 
    YELLOW, 
    AQUA, 
    WHITE, 
    GRAY, 
    GOLD, 
    GREEN 
} from '../utils/Constants';

// Load command messages from JSON
let commandMessages;
try {
    const jsonPath = "./data/SbeChatCommands.json";
    const jsonContent = FileLib.read("SbeChatCommands", jsonPath);
    if (!jsonContent) {
        throw new Error(`SbeChatCommands.json not found at path: ${jsonPath}`);
    }
    commandMessages = JSON.parse(jsonContent);
} catch (error) {
    console.error("Error loading SbeChatCommands.json:", error);
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
            let senderName = name.replace(/\[.*?\]\s*/, '');
            
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

            if (!message.startsWith('!')) return;
            if (defaultData.isBlacklisted(senderName)) return;
            if (!config.enableAllCommands) return;

            const args = message.slice(1).split(' ');
            const commandName = args.shift().toLowerCase();

            this.executeCommand(senderName, commandName, args);
        }).setCriteria("SBE Chat > ${name}: ${message}");
    }

    initializeCommands() {
        // RNG Command
        this.registerCommand('rng', (sender, args) => {
            if (!config.rngCommand) return;
            const rng = Math.floor(Math.random() * 101);
            const item = args.join(" ").toLowerCase() || null;
            this.sendMessage('rng', { playerName: sender, rng, dropString: item ? ` for ${item}` : '' });
        }, 'rngCommand');

        // Coinflip Command
        this.registerCommand('cf', (sender, args) => {
            if (!config.cfCommand) return;
            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            this.sendMessage('cf', { playerName: sender, result });
        }, 'cfCommand');

        // 8Ball Command
        this.registerCommand('8ball', (sender, args) => {
            if (!config.eightBallCommand) return;
            const responses = commandMessages['8ballResponses'];
            const response = responses[Math.floor(Math.random() * responses.length)];
            ChatLib.command(`sbechat ${response}`, true);
        }, 'eightBallCommand');

        // Throw Command
        this.registerCommand('throw', (sender, args) => {
            if (!config.throwCommand) return;
            const throwIntensity = Math.floor(Math.random() * 101);
            const target = args[0] || sender;
            this.sendMessage('throw', { playerName: target, throwIntensity });
        }, 'throwCommand');

        // Dice Command
        this.registerCommand('dice', (sender, args) => {
            if (!config.diceCommand) return;
            const result = Math.floor(Math.random() * 6) + 1;
            this.sendMessage('dice', { playerName: sender, result });
        }, 'diceCommand');

        // Simp Command
        this.registerCommand('simp', (sender, args) => {
            if (!config.simpCommand) return;
            const target = args[0] || sender;
            const percentage = Math.floor(Math.random() * 101);
            this.sendMessage('simp', { playerName: target, percentage });
        }, 'simpCommand');

        // Sus Command
        this.registerCommand('sus', (sender, args) => {
            if (!config.susCommand) return;
            const target = args[0] || sender;
            const percentage = Math.floor(Math.random() * 101);
            this.sendMessage('sus', { playerName: target, percentage });
        }, 'susCommand');

        // Join Command
        this.registerCommand('join', (sender, args) => {
            if (!config.joinCommand) return;
            const playerToJoin = args[0];
            if (!playerToJoin) return;
            
            const clientUsername = Player.getName();
            if (playerToJoin.toLowerCase() === clientUsername.toLowerCase()) {
                ChatLib.command(`party ${sender}`);
            }
        }, 'joinCommand');

        // Meow Command
        this.registerCommand('meow', (sender, args) => {
            if (!config.meowCommand) return;
            const total = defaultData.getMeowTotal();
            this.sendMessage('meow', { total });
        }, 'meowCommand');

        // Quote Command
        this.registerCommand('quote', (sender, args) => {
            if (!config.quoteCommand) return;
            const randomQuote = defaultData.getRandomQuote();
            if (randomQuote) {
                ChatLib.command(`sbechat Quote: "${randomQuote}"`, true);
            } else {
                ChatLib.command(`sbechat No quotes found! Add some with /scc quote add <quote>`, true);
            }
        }, 'quoteCommand');

        // TPS Command
        this.registerCommand('tps', (sender, args) => {
            if (!config.tpsCommand) return;
            const avgTps = getAverageTps();
            const currentTps = getCurrentTps();
            ChatLib.command(`sbechat Current TPS: ${currentTps} | Average: ${avgTps}`, true);
        }, 'tpsCommand');

        // Ping Command
        this.registerCommand('ping', (sender, args) => {
            if (!config.pingCommand) return;
            getPing((ping) => {
                ChatLib.command(`sbechat Current Ping: ${ping}ms`, true);
            });
        }, 'pingCommand');

        // Alpha Command
        this.registerCommand('alpha', (sender, args) => {
            if (!config.alphaCommand) return;
            checkAlphaStatusSbe((status, slots) => {
                const message = status === null ? 
                    "Could not fetch Alpha Server status. Try again later." :
                    status ? 
                        `Alpha Server might be open! (${slots} slots)` : 
                        `Alpha Server is currently closed. (${slots} slots)`;
                ChatLib.command(`sbechat ${message}`, true);
            });
        }, 'alphaCommand');

        // Networth Command
        this.registerCommand('nw', (sender, args) => {
            if (!config.networthCommand) return;
            const playerToCheck = args[0] || sender;
            getPlayerNetworth(playerToCheck).then(result => {
                if (result.success) {
                    ChatLib.command(`sbechat ${formatNetworthMessage(result.data)}`, true);
                } else {
                    ChatLib.command(`sbechat ${result.error}`, true);
                }
            });
        }, 'networthCommand');

        // Commands Command
        this.registerCommand('commands', (sender, args) => {
            if (!config.commandsCommand) return;
            if (!args || args.length === 0 || args[0].toLowerCase() === "list") {
                ChatLib.command(`sbechat Available commands: !rng, !cf, !8ball, !throw, !dice, !simp, !sus, !join, !commands, !meow, !quote, !tps, !ping`, true);
                return;
            }
            if (args[0].toLowerCase() === "help") {
                if (args.length === 1) {
                    ChatLib.command(`sbechat Use !commands help [command] for detailed help on a specific command.`, true);
                } else {
                    const specificCommand = args[1].toLowerCase();
                    const helpText = commandMessages.commands.specific[specificCommand] || 
                                   `Unknown command: ${specificCommand}. Use !commands list for available commands.`;
                    ChatLib.command(`sbechat ${helpText}`, true);
                }
            }
        }, 'commandsCommand');
    }

    registerCommand(name, handler, configKey = null) {
        this.commands.set(name.toLowerCase(), {
            handler,
            configKey
        });
    }

    handleMeowMessage(senderName) {
        defaultData.incrementMeowCount();
        
        if (senderName === Player.getName()) {
            defaultData.incrementPersonalMeowCount();
        }
        
        if (senderName !== Player.getName() && 
            !defaultData.isBlacklisted(senderName) &&
            defaultData.canAutoRespondMeow() && 
            config.autoMeowResponse) {
            defaultData.updateLastMeowResponse();
            ChatLib.command(`sbechat meow`, true);
        }
    }

    canExecuteCommand(sender) {
        if (defaultData.isBlacklisted(sender)) return false;
        if (defaultData.isOnCooldown(sender)) {
            if (sender === Player.getName()) {
                const remainingTime = defaultData.getRemainingCooldown(sender);
                ChatLib.chat(`${Prefix} ${RED}Please wait ${remainingTime} seconds before using another command!${RESET}`);
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
        if (sender === Player.getName()) {
            defaultData.addUsedCommand(commandName);
        }

        command.handler(sender, args);
    }

    generateMessage(commandType, variables) {
        if (!commandMessages[commandType]) {
            console.error(`Invalid command type: ${commandType}`);
            return null;
        }

        let templates;
        switch (commandType) {
            case 'rng':
                templates = variables.rng <= 30 ? commandMessages.rng.low :
                           variables.rng <= 70 ? commandMessages.rng.medium :
                           commandMessages.rng.high;
                break;
            case 'throw':
                templates = variables.throwIntensity <= 30 ? commandMessages.throw.low :
                           variables.throwIntensity <= 70 ? commandMessages.throw.medium :
                           commandMessages.throw.high;
                break;
            case 'cf':
                templates = commandMessages.cf[variables.result];
                break;
            case 'dice':
                templates = variables.result <= 2 ? commandMessages.dice.low :
                           variables.result <= 4 ? commandMessages.dice.medium :
                           commandMessages.dice.high;
                break;
            case 'simp':
            case 'sus':
                templates = variables.percentage <= 33 ? commandMessages[commandType].low :
                           variables.percentage <= 66 ? commandMessages[commandType].medium :
                           commandMessages[commandType].high;
                break;
            default:
                templates = commandMessages[commandType];
        }

        if (!Array.isArray(templates)) {
            console.error(`Invalid template array for ${commandType}`);
            return null;
        }

        const template = templates[Math.floor(Math.random() * templates.length)];
        return template.replace(/\${(\w+)}/g, (_, key) => variables[key] !== undefined ? variables[key] : '');
    }

    sendMessage(commandType, variables) {
        const message = this.generateMessage(commandType, variables);
        if (message) {
            ChatLib.command(`sbechat ${message}`, true);
        }
    }
}

export const commandHandler = new CommandHandler();
export default CommandHandler;