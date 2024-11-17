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
    @SwitchProperty   } from 'Vigilance';

const ConfigHeader = `${Prefix} ${YELLOW}${ModuleVersion} \nMade by ${Creator}${RESET}`

@Vigilant(`${ModuleName}`, `${ModuleName}`, {
    getCategoryComparator: () => (a, b) => {
        const order = ["General", "Mining", "Commands", "WIP", "Dev Stuff"];
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
        name: `Join Command ${DARK_AQUA}!join${RESET}`,
        description: "Enable the Join command for SBE Chat (joins/invites player to party)",
        category: "General",
        subcategory: "Commands"
    })
    joinCommand = true;

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

    // Mining Category
    @SwitchProperty({
        name: "Auto Warp Party in Mineshafts",
        description: "Automatically warps your party into Mineshafts",
        category: "Mining",
        subcategory: "Mineshaft"
    })
    autoWarpPartyInMineshaft = false;

    @SwitchProperty({
        name: "Enable Announce Mineshafts to SBE Chat",
        description: "Announce Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    enableAnnounceMineshaftToSbeChat = false

    @SwitchProperty({
        name: "Announce Topaz Mineshaft",
        description: "Announce Topaz Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceTopazMineshaft = false

    @SwitchProperty({
        name: "Announce Sapphire Mineshaft",
        description: "Announce Sapphire Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceSapphireMineshaft = false

    @SwitchProperty({
        name: "Announce Amethyst Mineshaft",
        description: "Announce Amethyst Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceAmethystMineshaft = false

    @SwitchProperty({
        name: "Announce Amber Mineshaft",
        description: "Announce Amber Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceAmberMineshaft = false

    @SwitchProperty({
        name: "Announce Jade Mineshaft",
        description: "Announce Jade Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceJadeMineshaft = false

    @SwitchProperty({
        name: "Announce Titanium Mineshaft",
        description: "Announce Titanium Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceTitaniumMineshaft = false

    @SwitchProperty({
        name: "Announce Umber Mineshaft",
        description: "Announce Umber Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceUmberMineshaft = false

    @SwitchProperty({
        name: "Announce Tungsten Mineshaft",
        description: "Announce Tungsten Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceTungstenMineshaft = false

    @SwitchProperty({
        name: "Announce Vanguard Mineshaft",
        description: "Announce Vanguard Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceVanguardMineshaft = false

    @SwitchProperty({
        name: "Announce Ruby Mineshaft",
        description: "Announce Ruby Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceRubyMineshaft = false

    @SwitchProperty({
        name: "Announce Onyx Mineshaft",
        description: "Announce Onyx Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceOnyxMineshaft = false

    @SwitchProperty({
        name: "Announce Aquamarine Mineshaft",
        description: "Announce Aquamarine Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceAquamarineMineshaft = false

    @SwitchProperty({
        name: "Announce Citrine Mineshaft",
        description: "Announce Citrine Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceCitrineMineshaft = false

    @SwitchProperty({
        name: "Announce Peridot Mineshaft",
        description: "Announce Peridot Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announcePeridotMineshaft = false

    @SwitchProperty({
        name: "Announce Jasper Mineshaft",
        description: "Announce Jasper Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceJasperMineshaft = false

    @SwitchProperty({
        name: "Announce Opal Mineshaft",
        description: "Announce Opal Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceOpalMineshaft = false

    constructor() {
        this.initialize(this);

        // Category descriptions
        this.setCategoryDescription("General", `${ConfigHeader}`);
        this.setCategoryDescription("Mining", `${ConfigHeader}`);
    
        // Dependencies
        this.addDependency(`RNG Command ${DARK_AQUA}!rng${RESET}`, "SBE Chat Commands");
        this.addDependency(`Coinflip Command ${DARK_AQUA}!cf${RESET}`, "SBE Chat Commands");
        this.addDependency(`8Ball Command ${DARK_AQUA}!8ball${RESET}`, "SBE Chat Commands");
        this.addDependency(`Throw Command ${DARK_AQUA}!throw${RESET}`, "SBE Chat Commands");
        this.addDependency(`Dice Command ${DARK_AQUA}!dice${RESET}`, "SBE Chat Commands");
        this.addDependency(`Simp Command ${DARK_AQUA}!simp${RESET}`, "SBE Chat Commands");
        this.addDependency(`Sus Command ${DARK_AQUA}!sus${RESET}`, "SBE Chat Commands");
        this.addDependency(`Join Command ${DARK_AQUA}!join${RESET}`, "SBE Chat Commands");
        this.addDependency(`Help Command ${DARK_AQUA}!<commands, command>${RESET}`, "SBE Chat Commands");
        this.addDependency(`Meow Command ${DARK_AQUA}!meow${RESET}`, "SBE Chat Commands");

        this.addDependency("Announce Topaz Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Sapphire Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Amethyst Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Amber Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Jade Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Titanium Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Umber Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Tungsten Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Vanguard Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Ruby Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Onyx Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Aquamarine Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Citrine Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Peridot Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Jasper Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        this.addDependency("Announce Opal Mineshaft", "Enable Announce Mineshafts to SBE Chat");
        
    }
}

export default new Config();