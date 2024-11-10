import { 
    BLACK, 
    DARK_BLUE, 
    DARK_GREEN, 
    DARK_AQUA, 
    DARK_RED, 
    DARK_PURPLE, 
    GOLD, 
    GRAY, 
    DARK_GRAY, 
    BLUE, 
    GREEN, 
    AQUA, 
    RED, 
    LIGHT_PURPLE, 
    YELLOW, 
    WHITE,
    OBFUSCATED, 
    BOLD, 
    STRIKETHROUGH, 
    UNDERLINE, 
    ITALIC, 
    RESET,
    ModuleVersion, 
    ModuleName,  
    Creator,
    Prefix  } from "./utils/Constants";
import { 
    @Vigilant, 
    @SwitchProperty, 
    @DecimalSliderProperty, 
    @TextProperty, 
    @SliderProperty, 
    @SelectorProperty, 
    @ColorProperty, 
    @ButtonProperty,    
    @CheckboxProperty   } from 'Vigilance';

const ConfigHeader = `${Prefix} ${YELLOW}${ModuleVersion} \nMade by ${Creator}${RESET}`

@Vigilant(`${ModuleName}`, `${ModuleName}`, {
    getCategoryComparator: () => (a, b) => {
        const order = ["General", "Commands", "WIP", "Dev Stuff"];
        return order.indexOf(a.name) - order.indexOf(b.name);
    }
})

class Config {
    // General Settings
    @SwitchProperty({
        name: "SBE Chat Commands",
        description: "Enable all commands for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    enableAllCommands = true;

    @SwitchProperty({
        name: `RNG Command ${DARK_AQUA}!rng${RESET}`,
        description: "Enable the RNG command for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    rngCommand = true;

    @SwitchProperty({
        name: `Coinflip Command ${DARK_AQUA}!cf${RESET}`,
        description: "Enable the Coinflip command for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    cfCommand = true;

    @SwitchProperty({
        name: `8Ball Command ${DARK_AQUA}!8ball${RESET}`,
        description: "Enable the 8ball command for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    eightBallCommand = true;

    @SwitchProperty({
        name: `Throw Command ${DARK_AQUA}!throw${RESET}`,
        description: "Enable the Throw command for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    throwCommand = true;

    @SwitchProperty({
        name: `Dice Command ${DARK_AQUA}!dice${RESET}`,
        description: "Enable the Dice command for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    diceCommand = true;

    @SwitchProperty({
        name: `Simp Command ${DARK_AQUA}!simp${RESET}`,
        description: "Enable the Simp command for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    simpCommand = true;

    @SwitchProperty({
        name: `Sus Command ${DARK_AQUA}!sus${RESET}`,
        description: "Enable the Sus command for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    susCommand = true;

    @SwitchProperty({
        name: `Invite Command (Party) ${DARK_AQUA}!p${RESET}`,
        description: "Enable the Invite (to Party) command for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    partyCommand = true;

    @SwitchProperty({
        name: `Help Command ${DARK_AQUA}!<commands, command>${RESET}`,
        description: "Enable the Help command for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    commandsCommand = true;

    @SwitchProperty({
        name: `Meow Command ${DARK_AQUA}!meow${RESET}`,
        description: "Enable the Meow command for SBE Chat",
        category: "General",
        subcategory: "Commands"
    })
    meowCommand = true;

    @SwitchProperty({
        name: "Auto Meow Response",
        description: "Automatically responds with 'meow' when someone says 'meow' in SBE Chat",
        category: "General",
        subcategory: "Auto Respnse"
    })
    autoMeowResponse = true;

    constructor() {
        this.initialize(this);

        // Category descriptions
        this.setCategoryDescription("General", `${ConfigHeader}`);
    
        // Dependencies
        this.addDependency(`RNG Command ${DARK_AQUA}!rng${RESET}`, "SBE Chat Commands");
        this.addDependency(`Coinflip Command ${DARK_AQUA}!cf${RESET}`, "SBE Chat Commands");
        this.addDependency(`8Ball Command ${DARK_AQUA}!8ball${RESET}`, "SBE Chat Commands");
        this.addDependency(`Throw Command ${DARK_AQUA}!throw${RESET}`, "SBE Chat Commands");
        this.addDependency(`Dice Command ${DARK_AQUA}!dice${RESET}`, "SBE Chat Commands");
        this.addDependency(`Simp Command ${DARK_AQUA}!simp${RESET}`, "SBE Chat Commands");
        this.addDependency(`Sus Command ${DARK_AQUA}!sus${RESET}`, "SBE Chat Commands");
        this.addDependency(`Invite Command (Party) ${DARK_AQUA}!p${RESET}`, "SBE Chat Commands");
        this.addDependency(`Help Command ${DARK_AQUA}!<commands, command>${RESET}`, "SBE Chat Commands");
        this.addDependency(`Meow Command ${DARK_AQUA}!meow${RESET}`, "SBE Chat Commands");
        
    }
}

export default new Config();