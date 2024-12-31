import { getElectionData } from "./Election";
import Promise from "../../PromiseV2";

// Cache system for mayor status
let mayorCache = {
    isDerpy: false,
    lastUpdate: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

/**
 * Converts various number formats to a raw number
 * @param {string} input - Input string (e.g., "100k", "1.5m", "100000")
 * @returns {number|null} - Converted number or null if invalid
 */
function parseNumberInput(input) {
    if (!input) return null;
    
    input = input.toLowerCase().replace(/\s+/g, "");
    
    const suffixes = {
        "k": 1000,
        "m": 1000000,
        "b": 1000000000
    };
    
    try {
        const lastChar = input.slice(-1);
        if (suffixes[lastChar]) {
            const number = parseFloat(input.slice(0, -1));
            return number * suffixes[lastChar];
        }
        
        return parseFloat(input);
    } catch (e) {
        return null;
    }
}

/**
 * Formats a number with abbreviations
 * @param {number} num - Number to format
 * @returns {string} - Formatted string (e.g., "1.5M", "100k")
 */
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + "B";
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k";
    }
    return num.toFixed(0);
}

/**
 * Checks if Mayor Derpy is active, using cache
 * @returns {Promise} - Promise resolving to boolean indicating if Derpy is active
 */
function isDerpyMayor() {
    return new Promise((resolve) => {
        const currentTime = Date.now();
        
        if (currentTime - mayorCache.lastUpdate < CACHE_DURATION) {
            resolve(mayorCache.isDerpy);
            return;
        }
        
        getElectionData().then(result => {
            if (!result.success) {
                resolve(mayorCache.isDerpy);
                return;
            }

            mayorCache.isDerpy = result.data.mayor?.name === "Derpy";
            mayorCache.lastUpdate = currentTime;
            
            resolve(mayorCache.isDerpy);
        }).catch(error => {
            console.error("Error checking mayor status:", error);
            resolve(mayorCache.isDerpy);
        });
    });
}

/**
 * Calculates auction/BIN taxes
 * @param {number} initialPrice - Starting price
 * @param {boolean} isDerpyActive - Whether Derpy is active
 * @returns {Object} - Tax information
 */
function calculateTax(initialPrice, isDerpyActive = false) {
    let taxRate;
    if (initialPrice < 10_000_000) {
        taxRate = 0.01;
    } else if (initialPrice < 100_000_000) {
        taxRate = 0.02;
    } else {
        taxRate = 0.025;
    }
    
    if (isDerpyActive) {
        taxRate *= 2;
    }
    
    const taxAmount = initialPrice * taxRate;
    const finalPrice = initialPrice * (1 - taxRate);
    
    return {
        originalPrice: initialPrice,
        taxRate: taxRate * 100,
        taxAmount: taxAmount,
        finalPrice: finalPrice,
        isDerpyActive: isDerpyActive
    };
}

/**
 * Formats tax calculation result for chat
 * @param {Object} taxInfo - Tax calculation result
 * @returns {string} - Formatted message
 */
function formatTaxMessage(taxInfo) {
    const derpyStatus = taxInfo.isDerpyActive ? " (Derpy Active)" : "";
    return `Price: ${formatNumber(taxInfo.originalPrice)} | ` +
           `Tax Rate: ${taxInfo.taxRate}% | ` +
           `Tax: ${formatNumber(taxInfo.taxAmount)} | ` +
           `After Tax: ${formatNumber(taxInfo.finalPrice)}${derpyStatus}`;
}

/**
 * Gets tax information for a given amount
 * @param {number} amount - Input amount
 * @returns {Promise} - Promise resolving to tax information
 */
function getTaxInfo(amount) {
    return new Promise((resolve) => {
        isDerpyMayor().then(isDerpy => {
            resolve(calculateTax(amount, isDerpy));
        });
    });
}

export { parseNumberInput, getTaxInfo, formatTaxMessage, calculateTax, formatNumber };