// === Utilities Import ===
// cleanWord: likely used for stripping punctuation and normalizing case
// debugLog: custom logger for labeled console messages
import { cleanWord, debugLog } from './utils.js';

/**
 * Loads a script module from an external JSON file.
 * If loading fails (e.g. offline), uses embedded fallback scripts.
 *
 * @param {number} module - The module number to load (e.g. 1 for module1_script.json)
 * @param {object} embeddedScripts - A local JS object holding fallback scripts keyed by module number
 * @returns {Promise<string[]>} currentScript - An array of words extracted from the script text
 */
export async function loadModule(module, embeddedScripts) {
  let currentScript = [];

  const url = `/script/module${module}_script.json`;
  debugLog('scriptLoader', `Attempting to fetch: ${url}`); // Log fetch attempt

  try {
    // === Attempt to fetch the module JSON from server ===
    const res = await fetch(url);

    // If response is not OK (e.g. 404), throw error to trigger fallback
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    // Extract script text from each step and split into individual words
    currentScript = data.script_steps
      .map(step => step.text) // Extract text content
      .join(' ')              // Combine into one long string
      .split(/\s+/);          // Split into words using whitespace

    debugLog('scriptLoader', `✅ Successfully fetched module ${module} (${currentScript.length} words)`);

  } catch (err) {
    // === Fallback if fetch fails ===
    debugLog('scriptLoader', `⚠️ Fetch failed – using fallback for module ${module}. Error: ${err}`);

    const fallback = embeddedScripts[module];

    if (!fallback) {
      debugLog('scriptLoader', `❌ No fallback found for module ${module}`);
      return [];
    }

    // Use fallback script and process the same way
    currentScript = fallback.script_steps
      .map(step => step.text)
      .join(' ')
      .split(/\s+/);

    debugLog('scriptLoader', `✅ Loaded fallback script (${currentScript.length} words)`);
  }

  // Return the parsed array of words for use in practice/typing modes
  return currentScript;
}