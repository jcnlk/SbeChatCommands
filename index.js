import config from "./config"
import "./utils/Constants"
import MeowCounter from "./utils/MeowCounter"

let commandOutputs;
try {
    const jsonPath = "./data/SbeChatCommands.json";
    const jsonContent = FileLib.read("SbeChatCommands", jsonPath);
    if (!jsonContent) {
        throw new Error(`SbeChatCommands.json is empty or not found at path: ${jsonPath}`);
    }
    commandOutputs = JSON.parse(jsonContent);
    if (!commandOutputs || typeof commandOutputs !== 'object') {
        throw new Error("Invalid JSON format in SbeChatCommands.json");
    }
} catch (error) {
    console.error("Error loading SbeChatCommands.json:", error);
    commandOutputs = {}; // Set an empty object fallback
}

function generateMessage(commandType, variables) {
    if (!commandOutputs[commandType]) {
        console.error(`Invalid or missing command type: ${commandType}`);
        return null;
    }

    let templates;
    switch (commandType) {
        case 'rng':
            templates = variables.rng <= 30 ? commandOutputs.rng.low :
                        variables.rng <= 70 ? commandOutputs.rng.medium :
                        commandOutputs.rng.high;
            break;
        case 'throw':
            templates = variables.throwIntensity <= 30 ? commandOutputs.throw.low :
                        variables.throwIntensity <= 70 ? commandOutputs.throw.medium :
                        commandOutputs.throw.high;
            break;
        case 'cf':
            templates = commandOutputs.cf[variables.result];
            break;
        case 'dice':
            templates = variables.result <= 2 ? commandOutputs.dice.low :
                        variables.result <= 4 ? commandOutputs.dice.medium :
                        commandOutputs.dice.high;
            break;
        case 'simp':
        case 'sus':
            templates = variables.percentage <= 33 ? commandOutputs[commandType].low :
                        variables.percentage <= 66 ? commandOutputs[commandType].medium :
                        commandOutputs[commandType].high;
            break;
        case 'meow':
            templates = commandOutputs.meow.responses;
            break;
        default:
            templates = commandOutputs[commandType];
    }

    if (!Array.isArray(templates)) {
        console.error(`Invalid template array for command type: ${commandType}`);
        return null;
    }

    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace(/\${(\w+)}/g, (_, key) => variables[key] !== undefined ? variables[key] : '');
}

function handleCommandsCommand(args) {
    if (!commandOutputs.commands) {
        return "Error: Commands information not available";
    }

    if (args.length === 0 || args[0].toLowerCase() === "list") {
        const availableCommands = [
            "!rng", "!cf", "!8ball", "!throw", "!dice", 
            "!simp", "!sus", "!p", "!commands", "!meow"
        ];
        return `Available commands: ${availableCommands.join(", ")}`;
    } else if (args[0].toLowerCase() === "help") {
        if (args.length === 1) {
            return commandOutputs.commands.help || "Help information not available";
        } else {
            let specificCommand = args[1].toLowerCase();
            return (commandOutputs.commands.specific && commandOutputs.commands.specific[specificCommand]) || 
                    `Unknown command: ${specificCommand}. Use !commands list for a list of available commands.`;
        }
    }
    return "Invalid usage. Try !commands list or !commands help [command]";
}

register("chat", (name, message, event) => {
    // Auto respond to "meow" in SBE Chat
    if (message.toLowerCase() === "meow" && 
        config.enableAllCommands && 
        //config.meowCommand && 
        config.autoMeowResponse) {
        if (MeowCounter.canMeow()) {
            MeowCounter.increment();
            ChatLib.command(`sbechat meow`, true);
            //ChatLib.chat(`Output: meow`); //Just for Debugging
        }
        return;
    }

    if (!message.startsWith("!")) return;
   
    let commandParts = message.split(" ");
    let command = commandParts[0].toLowerCase();

    // Check if commands are enabled globally
    if (!config.enableAllCommands) return;

    // Check individual command toggles
    switch(command) {
        case "!rng":
            if (!config.rngCommand) return;
            break;
        case "!cf":
            if (!config.cfCommand) return;
            break;
        case "!8ball":
            if (!config.eightBallCommand) return;
            break;
        case "!throw":
            if (!config.throwCommand) return;
            break;
        case "!dice":
            if (!config.diceCommand) return;
            break;
        case "!simp":
            if (!config.simpCommand) return;
            break;
        case "!sus":
            if (!config.susCommand) return;
            break;
        case "!p":
            if (!config.partyCommand) return;
            break;
        case "!meow":
            if (!config.meowCommand) return;
            break;
        case "!commands":
        case "!command":
            if (!config.commandsCommand) return;
            break;
        default:
            return;
    }

    let senderName = name.replace(/\[.*?\]\s*/, '');
    let targetName = commandParts[1] && !commandParts[1].startsWith('!') ? commandParts[1] : senderName;
    
    let generatedMessage;

    switch(command) {
        case "!rng":
            let rng = Math.floor(Math.random() * 101);
            let item = commandParts.slice(2).join(" ").toLowerCase() || null;
            generatedMessage = generateMessage("rng", {
                playerName: targetName, 
                rng, 
                dropString: item ? ` for ${item}` : ''
            });
            break;

        case "!cf":
            let result = Math.random() < 0.5 ? "heads" : "tails";
            generatedMessage = generateMessage("cf", {
                playerName: targetName, 
                result: result
            });
            break;

        case "!8ball":
            let question = commandParts.slice(1).join(" ");
            if (!question) {
                generatedMessage = "Please ask a question after !8ball";
            } else {
                generatedMessage = commandOutputs["8ballResponses"][
                    Math.floor(Math.random() * commandOutputs["8ballResponses"].length)
                ];
            }
            break;

        case "!throw":
            let throwIntensity = Math.floor(Math.random() * 101);
            generatedMessage = generateMessage("throw", {
                playerName: targetName, 
                throwIntensity
            });
            break;

        case "!dice":
            let diceResult = Math.floor(Math.random() * 6) + 1;
            generatedMessage = generateMessage("dice", {
                playerName: targetName, 
                result: diceResult
            });
            break;

        case "!commands":
        case "!command":
            generatedMessage = handleCommandsCommand(commandParts.slice(1));
            break;

        case "!simp":
        case "!sus":
            let percentage = Math.floor(Math.random() * 101);
            generatedMessage = generateMessage(command.slice(1), {
                playerName: targetName, 
                percentage: percentage
            });
            break;

        case "!p":
            let playerToInvite = commandParts[1] || senderName;
            ChatLib.command(`party ${playerToInvite}`);
            return;

        case "!meow":
            let total = MeowCounter.getTotal();
            generatedMessage = generateMessage("meow", { total });
            if (generatedMessage === null) {
                generatedMessage = `MEOW! There have been ${total} meows in SBE Chat!`;
            }
            break;
    }

    if (generatedMessage) {
        ChatLib.command(`sbechat ${generatedMessage}`, true);
        //ChatLib.chat(`Output: ${generatedMessage}`); //Just for Debugging
    }
}).setCriteria("SBE Chat > ${name}: ${message}");

register("command", () => {
    config.openGUI();
}).setName("SbeChatCommands");