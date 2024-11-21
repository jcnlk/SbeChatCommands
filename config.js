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
    @CheckboxProperty, 
    @ColorProperty, 
    @ButtonProperty,
    @CheckboxProperty } from 'Vigilance';

const ConfigHeader = `${Prefix} ${YELLOW}${ModuleVersion} \nMade by ${Creator}${RESET}`;
let ClickedDebugButton = false;

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
        description: `Automatically warps your party into Mineshafts. \n${RED}DOES NOT WORK AT THE MOMENT!${RESET} \n${RED}${BOLD}Note:${RESET} Currently the room/corpse detection can take a while.`,
        category: "Mining",
        subcategory: "Mineshaft"
    })
    autoWarpPartyInMineshaft = false;

    @SwitchProperty({
        name: "Announce Corpses with Mineshaft",
        description: `Include available Corpses in Mineshaft announcements. \n${RED}${BOLD}Note:${RESET} Currently the room/corpse detection can take a while.`,
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceCorpsesWithMineshaft = true

    @SwitchProperty({
        name: "Announce Mineshaft Type to Party",
        description: `Annouce Mineshaft Type tp Party. \n${RED}${BOLD}Note:${RESET} Currently the room/corpse detection can take a while.`,
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceMineshaftTypeToParty = true

    @SwitchProperty({
        name: "Announce Corpses to Party",
        description: `Announce available Corpses in Mineshaft to Party. \n${RED}${BOLD}Note:${RESET} Currently the room/corpse detection can take a while.`,
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceCorpsesToParty = true

    @SwitchProperty({
        name: "Enable Announce Mineshafts to SBE Chat",
        description: `Announce Mineshafts to SBE Chat. \n${RED}${BOLD}Note:${RESET} Currently the room/corpse detection can take a while.`,
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    enableAnnounceMineshaftToSbeChat = true


    @CheckboxProperty({
        name: "Announce Topaz Mineshaft",
        description: "Announce Topaz Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceTopazMineshaft = false

    @CheckboxProperty({
        name: "Announce Sapphire Mineshaft",
        description: "Announce Sapphire Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceSapphireMineshaft = false

    @CheckboxProperty({
        name: "Announce Amethyst Mineshaft",
        description: "Announce Amethyst Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceAmethystMineshaft = false

    @CheckboxProperty({
        name: "Announce Amber Mineshaft",
        description: "Announce Amber Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceAmberMineshaft = false

    @CheckboxProperty({
        name: "Announce Jade Mineshaft",
        description: "Announce Jade Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceJadeMineshaft = false

    @CheckboxProperty({
        name: "Announce Titanium Mineshaft",
        description: "Announce Titanium Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceTitaniumMineshaft = false

    @CheckboxProperty({
        name: "Announce Umber Mineshaft",
        description: "Announce Umber Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceUmberMineshaft = false

    @CheckboxProperty({
        name: "Announce Tungsten Mineshaft",
        description: "Announce Tungsten Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceTungstenMineshaft = false

    @CheckboxProperty({
        name: "Announce Vanguard Mineshaft",
        description: "Announce Vanguard Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceVanguardMineshaft = true

    @CheckboxProperty({
        name: "Announce Ruby Mineshaft",
        description: "Announce Ruby Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceRubyMineshaft = false

    @CheckboxProperty({
        name: "Announce Onyx Mineshaft",
        description: "Announce Onyx Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceOnyxMineshaft = false

    @CheckboxProperty({
        name: "Announce Aquamarine Mineshaft",
        description: "Announce Aquamarine Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceAquamarineMineshaft = false

    @CheckboxProperty({
        name: "Announce Citrine Mineshaft",
        description: "Announce Citrine Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceCitrineMineshaft = false

    @CheckboxProperty({
        name: "Announce Peridot Mineshaft",
        description: "Announce Peridot Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announcePeridotMineshaft = false

    @CheckboxProperty({
        name: "Announce Jasper Mineshaft",
        description: "Announce Jasper Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceJasperMineshaft = false

    @CheckboxProperty({
        name: "Announce Opal Mineshaft",
        description: "Announce Opal Mineshafts to SBE Chat",
        category: "Mining",
        subcategory: "Mineshaft Announce"
    })
    announceOpalMineshaft = false

    // Dev Stuff
    @ButtonProperty({
        name: "Debug Mode",
        description: "Just for debugging ig..",
        category: "Dev Stuff",
        subcategory: "Dev Stuff",
        placeholder: "Click me!"
    })
    coolMessage() {
        ClickedDebugButton = true;
        ChatLib.chat(`${YELLOW}[NPC] ${GOLD}Debugron${RESET}: Welcome, brave adventurer! I see you're interested in the mysteries of technology.`);
        
        setTimeout(() => {
            ChatLib.chat(`${YELLOW}[NPC] ${GOLD}Debugron${RESET}: Let me check your chat module... ${ITALIC}*taps glass screen*`);
            ChatLib.command(`sbechat @Cinshay do you like cats??`, true);
        }, 2000);
        
        setTimeout(() => {
            ChatLib.chat(`${YELLOW}[NPC] ${GOLD}Debugron${RESET}: Oh my! Something strange appeared in the ancient circuits!`);
        }, 3500);
        
        setTimeout(() => {
            ChatLib.chat(`${YELLOW}[NPC] ${GOLD}Debugron${RESET}: Quick, we must stabilize the magical chat essence before it's too late!`);
        }, 5000);
        
        setTimeout(() => {
            const npcText = new TextComponent(`${YELLOW}[NPC] ${GOLD}Debugron${RESET}: ${GREEN}[Use Magical Debug Crystal]`);
            npcText.setHover("show_text", "Click to answer");
            npcText.setClick("run_command", "/getMeowed");
            ChatLib.chat(npcText);
        }, 6500);
    }

    constructor() {
        this.initialize(this);

        // Category descriptions
        this.setCategoryDescription("General", `${ConfigHeader}`);
        this.setCategoryDescription("Mining", `${ConfigHeader}`);
        this.setCategoryDescription("Dev Stuff", `${ConfigHeader}`);
    
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

register("command", () => {
    if (ClickedDebugButton) {
        const playerName = Player.getName();
        ChatLib.chat(`${YELLOW}[NPC] ${GOLD}Debugron${RESET}: OHOHO! You activated my trap card!`);
        setTimeout(() => {
            ChatLib.chat(`${YELLOW}[NPC] ${GOLD}Debugron${RESET}: ${ITALIC}*pulls magical lever*`);
            ChatLib.command(`sbechat OH NO! ${playerName} just got ambushed and meowed by @jcnlk! How embarrassing!`, true);
        }, 1000);
        ClickedDebugButton = false
    }
    else {
        ChatLib.chat(`${Prefix} ${RED}Stop running random commands!${RESET}`)
    }
}).setName("getMeowed");