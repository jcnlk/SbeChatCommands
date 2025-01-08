import { onChatPacket } from "../../BloomCore/utils/Events";

const S03PacketTimeUpdate = Java.type("net.minecraft.network.play.server.S03PacketTimeUpdate");

let prevTime = 0;
let averageTps = 20.0;
let tps = 20.0;
let lastPingCommand;
let waitingPingCommand = false;
let pingCallback = null;

// TPS calculation
register("worldLoad", () => {
    prevTime = 0;
    averageTps = 20.0;
});

register("packetReceived", (packet) => {
    if (!(packet instanceof S03PacketTimeUpdate)) return;
    tps = 20000 / (Date.now() - prevTime + 1);
    tps = tps > 20 ? 20.0 : tps < 0 ? 0.0 : tps;
    
    if (prevTime !== 0) {
        averageTps = tps * 0.182 + averageTps * 0.818;
    }
    prevTime = Date.now();
});

// Ping calculation
onChatPacket((event) => {
    if (!waitingPingCommand || !pingCallback) return;
    
    let ping = Date.now() - lastPingCommand;
    cancel(event);
    
    pingCallback(ping);
    waitingPingCommand = false;
    pingCallback = null;
}).setCriteria(`Unknown command. Type "/help" for help. ('fbkjgblsbnljhh')`); //}).setCriteria(/^Unknown command\. Type \"\/help\" for help\. \(\".+\"\)$/);

// Network utility functions
export const getAverageTps = () => averageTps.toFixed(1);
export const getCurrentTps = () => tps.toFixed(1);
export const getPing = (callback) => {
    lastPingCommand = Date.now();
    waitingPingCommand = true;
    pingCallback = callback;
    ChatLib.command("fbkjgblsbnljhh", false);
};