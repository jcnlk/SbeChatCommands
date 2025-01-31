import defaultData from "../utils/defaultData";
import { AQUA, GRAY, GREEN, chatPrefix, RED, WHITE, YELLOW } from "../utils/constants";

export const quote = (action, ...args) => {
  switch (action) {
    case "add":
      if (!args) {
        ChatLib.chat(`${chatPrefix} ${RED}Please provide a quote to add! ${GRAY}(/scc quote add <quote>)`);
        return;
      }
      const quote = args.join(" ");
      const quoteNumber = defaultData.addQuote(quote);
      ChatLib.chat(`${chatPrefix} ${GREEN}Successfully added quote #${quoteNumber}!`);
      break;

    case "remove":
      if (!args) {
        ChatLib.chat(`${chatPrefix} ${RED}Please provide a quote number to remove! ${GRAY}(/scc quote remove <number>)`);
        return;
      }
      const index = parseInt(args[0]);
      if (defaultData.removeQuote(index)) {
        ChatLib.chat(`${chatPrefix} ${GREEN}Successfully removed quote #${index}!`);
      } else {
        ChatLib.chat(`${chatPrefix} ${RED}Invalid quote number!`);
      }
      break;

    case "list":
      const quotes = defaultData.getQuotes();
      if (quotes.length === 0) {
        ChatLib.chat(`${chatPrefix} ${RED}No quotes found!`);
        return;
      }
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
      ChatLib.chat(`${chatPrefix} ${YELLOW}Saved Quotes:`);
      ChatLib.chat("");
      quotes.forEach((quote, index) => {
        ChatLib.chat(`${AQUA}#${index + 1} ${WHITE}${quote}`);
      });
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
      break;

    default:
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
      ChatLib.chat(`${chatPrefix} ${YELLOW}Quote Commands:`);
      ChatLib.chat("");
      ChatLib.chat(`${AQUA}/scc quote add <quote> ${GRAY}- Add a new quote`);
      ChatLib.chat(`${AQUA}/scc quote remove <number> ${GRAY}- Remove a quote by its number`);
      ChatLib.chat(`${AQUA}/scc quote list ${GRAY}- List all saved quotes`);
      ChatLib.chat("");
      ChatLib.chat(`${YELLOW}NOTE: ${GRAY}Use ${AQUA}!quote${GRAY} in SBE Chat to get a random quote!`);
      ChatLib.chat(ChatLib.getChatBreak(`${AQUA}=`));
      break;
  }
};
