// Storage key to avoid typos everywhere
const HISTORY_KEY = "xray_history";

/**
 * Save history array to localStorage
 * @param {Array} data
 */
export const saveHistory = (data) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save history:", error);
  }
};

/**
 * Load history from localStorage
 * @returns {Array}
 */
export const loadHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
};


export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
};
