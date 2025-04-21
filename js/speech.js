// === Utility Imports ===
// cleanWord: utility to sanitize and normalize words for comparison
// debugLog: custom logger for namespaced debug messages
// triggerReward: triggers a visual/sound reward on script completion
// updateProgressBar: updates the visual progress tracker
import { cleanWord, debugLog } from './utils.js';
import { triggerReward } from './rewards.js';
import { updateProgressBar } from './progress.js';

/**
 * Initializes continuous speech recognition and handles real-time
 * word-matching against the provided training script.
 * 
 * @param {string[]} currentScript - Array of expected script words in sequence
 * @param {function} onCompleteWord - Callback function triggered after each correct word
 */

// === Fire reward only once
let rewardGiven = false;

export function startSpeechRecognition(currentScript, onCompleteWord) {
  debugLog('speech.init', 'Initializing Speech Recognition');

  // === Initialize browser-native SpeechRecognition ===
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;          // Keep listening after each result
  recognition.interimResults = true;      // Capture words as they're spoken
  recognition.lang = 'en-US';             // Language configuration

  const spans = document.querySelectorAll('#scriptText span'); // All script word spans in DOM
  let currentWordIndex = 0; // Tracks the current expected word index

  // === Main event listener for speech results ===
  recognition.onresult = (event) => {
    // Extract the full interim transcript
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join(' ')
      .toLowerCase()
      .trim();

    debugLog('speech.transcript', `Heard: "${transcript}"`);

    // Clean and normalize transcript and expected word
    const cleaned = cleanWord(transcript);
    const expected = cleanWord(currentScript[currentWordIndex] || '');

    debugLog('speech.matchCheck', `Expecting: "${expected}" | Cleaned Transcript: "${cleaned}"`);

    // === Word Match Check ===
    if (cleaned.includes(expected)) {
      // Highlight the current word in green
      spans[currentWordIndex].classList.add('correct');
      debugLog('speech.match', `✅ Match at word ${currentWordIndex}: "${expected}"`);

      // Move to the next word
      currentWordIndex++;

      // Scroll to the next word smoothly (if exists)
      spans[currentWordIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

     // === Fire reward ONCE only on last word ===
  if (currentWordIndex >= currentScript.length && !rewardGiven) {
    recognition.stop();
    rewardGiven = true;
    debugLog('speech.complete', '🎉 Script completed – triggering reward');
    triggerReward();
  }

      // Notify progress externally
      onCompleteWord(currentWordIndex);
    }

    // Always update progress bar after every transcript
    updateProgressBar();
    debugLog('speech.update', 'Progress bar updated');
  };

  // === Handles recognition errors ===
  recognition.onerror = (e) => {
    console.warn('Speech Error:', e);
    debugLog('speech.error', `Error occurred: ${e.error}`);

    // Auto-restart after short delay if error occurs
    setTimeout(() => recognition.start(), 500);
  };

  // === Handles recognition ending unexpectedly ===
  recognition.onend = () => {
    debugLog('speech.end', `Recognition ended – current index: ${currentWordIndex}`);

    // Restart recognition if not yet complete
    if (currentWordIndex < currentScript.length) {
      debugLog('speech.restart', 'Restarting recognition...');
      recognition.start();
    }
  };

  // === Start listening ===
  recognition.start();
  debugLog('speech.start', 'Speech recognition started');
}