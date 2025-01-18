let currentArea = "";
let retryCount = 0;

/**
 * Updates the current area based on the TabList and Scoreboard
 */
const updateCurrentArea = () => {
  try {
    const tabList = TabList.getNames();
    if (!tabList) {
      throw new Error("TabList is null");
    }

    const areaLine = tabList.find((name) => name.includes("Area") || name.includes("Dungeon: "));
    if (areaLine) {
      if (areaLine.includes("Dungeon: ") || areaLine.includes("Kuudra")) {
        setTimeout(() => {
          const scoreboard = Scoreboard.getLines();
          const zoneLine = scoreboard.find((line) => line.getName().includes("⏣") || line.getName().includes("ф"));
          if (zoneLine) {
            const zone = zoneLine
              .getName()
              .replace("⏣ ", "")
              .replace("ф ", "")
              .removeFormatting()
              .replace(/[^\x00-\x7F]/g, "")
              .trim();
            if (currentArea !== zone) {
              currentArea = zone;
              //ChatLib.chat(`Current area updated to: ${currentArea}`); //debug
            }
          } else {
            retryCount++;
            if (retryCount < 20) {
              setTimeout(updateCurrentArea, 1000);
            } else {
              //ChatLib.chat("Failed to get zone from scoreboard after 20 attempts"); //debug
            }
          }
        }, 1000);
      } else if (areaLine.includes("Area")) {
        const area = areaLine.replace("Area: ", "").removeFormatting();
        if (currentArea !== area) {
          currentArea = area;
          //ChatLib.chat(`Current area updated to: ${currentArea}`); //debug
        }
      }
    } else {
      if (retryCount < 20) {
        retryCount++;
        setTimeout(updateCurrentArea, 1000);
      } else {
        //ChatLib.chat("Failed to get current area :("); //debug
      }
    }
  } catch (e) {
    //ChatLib.chat(`Error in updateCurrentArea: ${e.message}`); //debug
    console.error(e);
  }
};

/**
 * Gets the current area
 * @returns {string} The current area
 */
export const getCurrentArea = () => currentArea;

/**
 * Gets the current zone from the scoreboard
 * @returns {string} The current zone
 */
export const getCurrentZone = () => {
  const scoreboard = Scoreboard.getLines();
  const zoneLine = scoreboard.find((l) => l.getName().includes("⏣") || l.getName().includes("ф"));
  if (zoneLine) {
    return zoneLine
      .getName()
      .replace("⏣ ", "")
      .replace("ф ", "")
      .removeFormatting()
      .replace(/[^\x00-\x7F]/g, "")
      .trim();
  }
  return "";
};

// Register event handlers
register("worldLoad", () => {
  retryCount = 0;
  updateCurrentArea();
});

register("worldUnload", () => {
  retryCount = 0;
  currentArea = "";
});

export { updateCurrentArea };
