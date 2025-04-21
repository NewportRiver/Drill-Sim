// === Progress Bar Module ===
import { triggerReward } from './rewards.js';
import { debugLog } from './utils.js';

let lastFilledSegment = 0;
let finalRewardGiven = false;

/**
 * Updates the progress bar based on .word.correct spans
 */
export function updateProgressBar() {
    const wordSpans = document.querySelectorAll('#scriptText .word');
    const matchedCount = Array.from(wordSpans).filter(span =>
      span.classList.contains('correct')
    ).length;
  
    const percentComplete = matchedCount / wordSpans.length;
    debugLog('progress.updateProgressBar', `Matched ${matchedCount}/${wordSpans.length} words (${(percentComplete * 100).toFixed(1)}%)`);
  
    const segments = document.querySelectorAll('.progress-segment');
    const filledSegmentCount = Math.floor(percentComplete * segments.length);
    debugLog('progress.updateProgressBar', `Filling ${filledSegmentCount}/${segments.length} segments`);
  
    const clampedSegmentCount = matchedCount > 0 ? Math.max(1, filledSegmentCount) : 0;
    segments.forEach((seg, i) => {
      seg.classList.toggle('filled', i < clampedSegmentCount);
    });
  
    if (filledSegmentCount > lastFilledSegment) {
      console.log(`🎖️ Segment ${filledSegmentCount} filled – triggering reward`);
      triggerReward();
      lastFilledSegment = filledSegmentCount;
    }
  
    if (filledSegmentCount === segments.length && !finalRewardGiven) {
      finalRewardGiven = true;
      console.log("🌟 100% Completion! Prepare for final reward...");
      const barEl = document.getElementById('progressBar');
      if (barEl) {
        barEl.classList.add('flash');
        setTimeout(() => {
          barEl.classList.remove('flash');
        }, 500);
      }
    }
  
    const percentDisplay = document.getElementById('progressPercent');
    if (percentDisplay) {
      percentDisplay.textContent = `${Math.round(percentComplete * 100)}%`;
    }
  
    console.log(`🧠 ${Math.round(percentComplete * 100)}% complete`);
  }

/**
 * Initializes the visual progress bar
 */
export function renderProgressBar(segmentCount = 10) {
  debugLog('progress.renderProgressBar', 'Rendering progress bar UI...');
  const bar = document.getElementById('progressBar');
  if (!bar) {
    console.warn('⚠️ progressBar element not found');
    return;
  }

  bar.innerHTML = '';
  for (let i = 0; i < segmentCount; i++) {
    const seg = document.createElement('div');
    seg.className = 'progress-segment';
    bar.appendChild(seg);
  }
}