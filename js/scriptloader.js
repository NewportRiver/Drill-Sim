// === Utilities Import ===
import { cleanWord, debugLog, stripLineNumber } from './utils.js';

/**
 * Loads a script module from an external JSON file.
 * If loading fails (e.g. offline), uses embedded fallback scripts.
 *
 * @param {number} module - The module number to load (e.g. 1 for module1_script.json)
 * @param {object} embeddedScripts - A local JS object holding fallback scripts keyed by module number
 * @returns {Promise<string[]>} currentScript - Array of raw lines for use in typing logic
 */
export async function loadModule(module, embeddedScripts) {
  let currentScript = [];

  const url = `/script/module${module}_script.json`;
  debugLog('scriptLoader', `Attempting to fetch: ${url}`);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // Store original script lines
    currentScript = data.script_steps.map(step => step.text);

    // Render script visually
    renderScript(currentScript);

    debugLog('scriptLoader', `✅ Successfully fetched module ${module} (${currentScript.length} lines)`);

  } catch (err) {
    debugLog('scriptLoader', `⚠️ Fetch failed – using fallback for module ${module}. Error: ${err}`);

    const fallback = embeddedScripts[module];
    if (!fallback) {
      debugLog('scriptLoader', `❌ No fallback found for module ${module}`);
      return [];
    }

    currentScript = fallback.script_steps.map(step => step.text);

    renderScript(currentScript);

    debugLog('scriptLoader', `✅ Loaded fallback script (${currentScript.length} lines)`);
  }

  return currentScript;
}

/**
 * Renders the script as word-level <span> elements inside #scriptText
 * Each word gets its own span, spaced for highlighting during typing.
 *
 * @param {string[]} scriptLines - Array of script lines
 */
function renderScript(scriptLines) {
  const container = document.getElementById('scriptText');
  container.innerHTML = '';

  scriptLines.forEach((line, i) => {
    const originalLine = line;
    const cleanedLine = stripLineNumber(line);
    const words = cleanedLine.split(/\s+/);

    const lineWrapper = document.createElement('div');
    lineWrapper.className = 'script-line';

    const lineNumberSpan = document.createElement('span');
    lineNumberSpan.className = 'line-number';
    lineNumberSpan.textContent = `${i + 1}. `;
    lineNumberSpan.style.fontWeight = 'bold';
    lineWrapper.appendChild(lineNumberSpan);

    words.forEach(word => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';

      // Wrap each letter in its own span
      for (let char of word) {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = char;
        letterSpan.className = 'letter';
        wordSpan.appendChild(letterSpan);
      }

      lineWrapper.appendChild(wordSpan);
      lineWrapper.appendChild(document.createTextNode(' '));
    });

    container.appendChild(lineWrapper);
  });
}