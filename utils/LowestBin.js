import request from "../../requestV2";
import Promise from "../../PromiseV2";
import { CleanPrefix } from "./Constants";

let skyblockItems = [];

// Load SkyBlock items from BloomCore
try {
    const itemsContent = FileLib.read("BloomCore", "data/skyblockItems.json");
    if (itemsContent) {
        skyblockItems = JSON.parse(itemsContent);
    }
} catch (error) {
    console.error(`${CleanPrefix} Error loading skyblockItems.json:`, error);
}

function formatPrice(price) {
    if (price >= 1000000000) {
        return (price / 1000000000).toFixed(1) + "b";
    }
    if (price >= 1000000) {
        return (price / 1000000).toFixed(1) + "m";
    }
    if (price >= 1000) {
        return (price / 1000).toFixed(1) + "k";
    }
    return price.toString();
}

/**
 * Converts normal item name to SkyBlock ID
 * @param {string} name - Normal item name
 * @returns {string|null} SkyBlock ID or null if not found
 */
function getItemId(name) {
    name = name.trim();
    
    // First try exact match
    const exactMatch = skyblockItems.find(function(item) {
        return item.name === name;
    });
    if (exactMatch) return exactMatch.id;
    
    // Then try case-insensitive match
    const caseInsensitiveMatch = skyblockItems.find(function(item) {
        return item.name && item.name.toLowerCase() === name.toLowerCase();
    });
    return caseInsensitiveMatch ? caseInsensitiveMatch.id : null;
}

/**
 * Formats search query for API
 * @param {string} query - Raw search query
 * @returns {string} Formatted query
 */
function formatSearchQuery(query) {
    return query
        .replace(/-/g, "_")           // Replace hyphens with underscores
        .replace(/\s+/g, "_")         // Replace spaces with underscores
        .toUpperCase();               // Convert to uppercase
}

/**
 * Gets lowest BIN price for an item from Moulberry"s API
 * @param {string} searchQuery - Item to search for
 * @returns {Promise} Price data or error
 */
export function getLowestBin(searchQuery) {
    return new Promise(function(resolve) {
        // Try to find item ID first
        const itemId = getItemId(searchQuery);
        const searchTerm = itemId || formatSearchQuery(searchQuery);

        request({
            url: "https://moulberry.codes/lowestbin.json",
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        }).then(function(response) {
            try {
                const data = JSON.parse(response);
                
                // Check for exact match first if we have an item ID
                if (itemId && data[itemId]) {
                    resolve({
                        success: true,
                        data: [{
                            name: itemId,
                            price: data[itemId]
                        }]
                    });
                    return;
                }

                // Prepare search terms for partial matching
                const searchTerms = searchTerm.split("_").filter(function(term) {
                    return term.length > 0;
                });
                
                // If no exact match, search for partial matches
                const matches = Object.entries(data)
                    .filter(function([id]) {
                        return searchTerms.every(function(term) {
                            return id.includes(term);
                        });
                    })
                    .map(function([id, price]) {
                        return {
                            name: id,
                            price: price
                        };
                    });

                if (matches.length === 0) {
                    resolve({
                        success: false,
                        error: 'No items found matching "' + searchQuery + '"'
                    });
                    return;
                }

                // Sort by price and take top 3
                matches.sort(function(a, b) {
                    return a.price - b.price;
                });
                const topMatches = matches.slice(0, 3);

                resolve({
                    success: true,
                    data: topMatches
                });
            } catch (error) {
                console.error(`${CleanPrefix} Error processing lowest BIN data:`, error);
                resolve({
                    success: false,
                    error: "Failed to process lowest BIN data"
                });
            }
        }).catch(function(error) {
            console.error(`${CleanPrefix} Error fetching lowest BIN data:`, error);
            resolve({
                success: false,
                error: "Failed to fetch lowest BIN data"
            });
        });
    });
}

/**
 * Formats lowest BIN data for chat output
 * @param {Object} data - Array of matching items and their prices
 * @returns {string} Formatted message
 */
export function formatLowestBin(data) {
    if (data.length === 1) {
        const item = data[0];
        return "Lowest BIN: " + '"' + item.name + '"' + " - " + formatPrice(item.price);
    }

    const formatted = data.map(function(item) {
        return '"' + item.name + '"' + " - " + formatPrice(item.price);
    }).join(" | ");

    return "Lowest BINs: " + formatted;
}