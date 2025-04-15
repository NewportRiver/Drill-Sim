// === Utility Imports ===
// cleanWord: strips punctuation and normalizes casing for comparison
// debugLog: namespaced debug logging utility
import { cleanWord, debugLog } from './utils.js';

// Progress bar updater (shared with other modes)
import { updateProgressBar } from './main.js';

/**
 * Processes user typing input from the typing box,
 * compares it word-by-word against the script,
 * applies visual highlighting for correct words,
 * and updates the progress bar.
 *
 * @param {string[]} currentScript - Array of expected words in script order
 */
export function handleTyping(currentScript) {
  // === Capture and normalize typed input ===
  const typedText = document.getElementById('typingInput').value.trim().toLowerCase();
  debugLog('typing.handleTyping', `Typed raw text: "${typedText}"`);

  // Split typed input into individual words
  const typedWords = typedText.split(/\s+/);

  // Get all span elements representing script words
  const spans = document.querySelectorAll('#scriptText span');

  // === Reset all highlights before re-evaluation ===
  spans.forEach(span => span.classList.remove('correct'));
  debugLog('typing.handleTyping', `Cleared previous highlights.`);

  // === Compare typed words to script one-by-one ===
  spans.forEach((span, index) => {
    const expected = cleanWord(currentScript[index] || '');
    const typed = cleanWord(typedWords[index] || '');

    debugLog('typing.matchCheck', `Word ${index} → Expected: "${expected}" | Typed: "${typed}"`);

    // If words match, highlight the word in green
    if (typed === expected) {
      span.classList.add('correct');
      debugLog('typing.match', `✅ Matched at index ${index}: "${typed}"`);
    }
  });

  // Update visual progress bar based on matches
  updateProgressBar();
  debugLog('typing.handleTyping', 'Progress bar updated.');
}