// === Utility Imports ===
import { cleanWord, stripLineNumber, debugLog } from './utils.js';
import { updateProgressBar } from './progress.js';

let currentWordIndex = 0;

export function handleTyping(currentScript) {
  const typedText = document.getElementById('typingInput').value.trim().toLowerCase();
  const typedWords = typedText.split(/\s+/);
  const wordSpans = document.querySelectorAll('#scriptText span.word');

  const expectedWords = currentScript.flatMap(line =>
    stripLineNumber(line).split(/\s+/).map(cleanWord)
  );

  wordSpans.forEach((wordSpan, index) => {
    const expected = expectedWords[index] || '';
    const typed = cleanWord(typedWords[index] || '');
    const letterSpans = wordSpan.querySelectorAll('.letter');

    // Reset coloring
    letterSpans.forEach((letterSpan, i) => {
      const expectedChar = expected[i] || '';
      const typedChar = typed[i] || '';

      if (!typedChar) {
        letterSpan.style.color = ''; // neutral color
      } else if (typedChar === expectedChar) {
        letterSpan.style.color = 'limegreen';
      } else {
        letterSpan.style.color = 'red';
      }
    });

    // Add .correct to the word span if the full word matches
    if (typed === expected && typed.length === expected.length) {
      wordSpan.classList.add('correct');
    } else {
      wordSpan.classList.remove('correct'); // remove if mistyped after being correct
    }
  });

  updateProgressBar();
  debugLog('typing.handleTyping', 'Progress bar updated.');
}
