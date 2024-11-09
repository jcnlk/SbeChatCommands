
/** 
*   Credits to 'SBEChat Module' by ooffyy: https://www.chattriggers.com/modules/v/SBEChat
*   Needed to make ChatLib work in SBE Chat (pls fix)
*/  
import PogObject from "../PogData/index"

const data = new PogObject("SBEChat", {
    firstInstall: true,
    hypixel: false,
    chat: '',
    sbeChat: false,
}, "data.json")

const chats = {
    'ALL': 'A',
    'PARTY': 'P',
    'GUILD': 'G',
    'OFFICER': 'O',
    'SKYBLOCK-COOP': ['SKYBLOCK','COOP']
}

const ALREADY_MESSAGE = "&cYou're already in this channel!&r"
const hypixelRegex = /([^.\s]+)?.?hypixel.net.?/i // if i ever want to make 
// https://regex101.com/r/9nBFFO/1
// old regex (just in case): /.*.?hypixel.net.?/i
const chatRegex = /\/chat (.+)\b/

const SBE = '&cSB&fE&r'
const CHAT = '&cChat&r'

register("messageSent", (m, e) => {
    if (!data.hypixel) return
    const msg = m.toLocaleLowerCase()

    if (!msg.startsWith('/') && data.sbeChat) {
        cancel(e)
        ChatLib.command(`sbechat ${m}`, true)
    }

    else if (msg.startsWith('/chat')) {
        if (msg.startsWith('/chat sbe')) {
            cancel(e)

            if (!data.sbeChat) {
                ChatLib.chat(`&aYou are now in the ${SBE}&a channel&r`)
                data.sbeChat = true
                data.save()
            }

            else if (data.sbeChat) ChatLib.chat(ALREADY_MESSAGE)
        }
        
        else {
            if (chatRegex.test(msg)) {
                let prompt = msg.match(chatRegex)[1].toLocaleUpperCase()
                Object.entries(chats).forEach(([key, value]) => {

                    if (prompt === key || value.includes(prompt)) {
                        if (data.sbeChat && data.chat === key) {
                            ChatLib.chat(`&aYou are now in the &r&6${key}&r&a channel&r`)
                        }
                        else if (data.chat === key) {
                            ChatLib.chat(`${ALREADY_MESSAGE}`)
                        }
                        data.sbeChat = false
                        data.save()
                        return
                    }
                })
            }
        }
    }
})

register("chat", (chat) => {
    if (!data.hypixel) return
    data.chat = chat.toLocaleUpperCase()
    data.save()
}).setCriteria('&aYou are now in the &r&6${chat}&r&a channel&r')

register("chat", () => {
    if (!data.hypixel) return
    data.chat = 'DM'
    data.sbeChat = false
    data.save()
}).setCriteria(/Opened a chat conversation with .* for the next 5 minutes. Use \/chat a to leave/)

register("chat", (e) => {
    if (!data.hypixel) return
    cancel(e)
}).setCriteria(ALREADY_MESSAGE)

function hypixelInit() { 
    const ip = Server.getIP()
    if (hypixelRegex.test(ip)) {
        const match = ip.match(hypixelRegex)[1]?.toLocaleLowerCase()
        if (match === 'alpha') data.hypixel = false
        else data.hypixel = true
    }
    else data.hypixel = false
    data.save()
    //ChatLib.chat(`${Server.getIP()}: ${data.hypixel}`)
}
register("serverConnect", hypixelInit)
register("serverDisconnect", () => { data.hypixel = false; data.save() })
register("worldLoad", hypixelInit)

let firstInstall = register("tick", (t) => {
    if (t%100!=0) return
    if (data.firstInstall) {
        if (data.hypixel) {
            ChatLib.say("/chat a")
            data.chat = 'ALL'
            data.save()
            ChatLib.chat('&aYou are now in the &r&6ALL&r&a channel&r')

            ChatLib.chat(`&c&m${ChatLib.getChatBreak(" ")}`)
            ChatLib.chat(`&aInitialised ${SBE}${CHAT}!\nThis module is made for ${SBE} &rusers using the &6/sbechat &rfeature.\n&cPlease note that this module currently only works on the main Hypixel server!\nUse &6/chat sbe &rto switch to the ${SBE} chat channel.`)
            ChatLib.chat(`&c&m${ChatLib.getChatBreak(" ")}`)
            
            data.firstInstall = false
            data.save()
        } else {
            ChatLib.chat("&aYou've imported &cSB&fE&cChat&a! &rJoin 'hypixel.net' to complete setup.\nOr &c/ct delete SBEChat&r.")
        }
    }
    else firstInstall.unregister()
})

let LastChannel = data.chat

/**
 * Now the actual code (Thanks SBE Devs)
 */
// Chat Commands
register("chat", (name, message, event) => {
    if (!data.hypixel) return;
    
    // Command handler for !meow
    if (message.trim().toLowerCase() === "!meow") {
        ChatLib.chat("!meow found")
        // Switch to SBE chat
        ChatLib.say("/chat sbe");
        
        // Small delay to ensure chat switch
        setTimeout(() => {
            // Send the meow message
            ChatLib.say("Meow!");
            
            // Switch back to previous channel
            setTimeout(() => {
                ChatLib.say(`/chat ${LastChannel}`);
            }, 150);
        }, 150);
    }
}).setCriteria("SBE Chat > ${name}: ${message}"); // TODO: Include special SBE Ranks in this Criteria
