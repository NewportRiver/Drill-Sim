/**
 * Sanitizes a word by removing punctuation, converting to lowercase,
 * and trimming whitespace. This helps normalize user input and script text
 * for accurate comparison during speech or typing.
 *
 * @param {string} word - The input word to sanitize
 * @returns {string} - Cleaned and normalized word
 */
export function cleanWord(word) {
    return word
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") // Remove common punctuation
      .toLowerCase()                            // Convert to lowercase
      .trim();                                  // Trim whitespace
  }
  
  // === Debug Mode Toggle ===
  // Set to false to silence all debug logs for production or deployment
  export const DEBUG_MODE = true;
  
  /**
   * Global debug logger – outputs messages to the console with a clean format.
   * Controlled by the DEBUG_MODE toggle above.
   *
   * @param {string} source - Label to identify where the log is coming from
   * @param {string} message - The debug message to print
   */
  export function debugLog(source, message) {
    if (DEBUG_MODE) {
      console.log(
        `%c[DEBUG][${source}]`,
        'color: limegreen; font-weight: bold;',
        message
      );
    }
  }