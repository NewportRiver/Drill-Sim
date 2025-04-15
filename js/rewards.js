import { debugLog } from './utils.js';

/**
 * Triggers a reward popup with a random motivational message
 * and plays one of several reward sounds.
 */
export function triggerReward() {
  const popup = document.getElementById('rewardPopup');

  if (!popup) {
    debugLog('rewards', '❌ rewardPopup element not found.');
    return;
  }

  const messages = [
    "🎯 Target Down!",
    "🏅 Stack on Me!",
    "🔥 ALL CLEAR!",
    "✅ Target Acquired!"
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];
  popup.textContent = message;
  debugLog('rewards', `🎖️ Displaying message: "${message}"`);

  // Select one of the reward sounds
  const sounds = Array.from({ length: 7 }, (_, i) =>
    document.getElementById(`successSound${i + 1}`)
  ).filter(Boolean); // Filter out nulls just in case

  if (sounds.length === 0) {
    debugLog('rewards', '❌ No sound elements found.');
    return;
  }

  const sound = sounds[Math.floor(Math.random() * sounds.length)];
  debugLog('rewards', `🔊 Playing sound ID: "${sound.id}"`);

  // Show popup and play animation
  popup.classList.remove('hidden');
  void popup.offsetWidth; // Force reflow to re-trigger animation
  popup.style.animation = 'popFade 1.5s ease';

  sound.play().catch(err => {
    debugLog('rewards', `⚠️ Sound playback failed: ${err}`);
  });

  setTimeout(() => {
    popup.classList.add('hidden');
    debugLog('rewards', 'Popup hidden after 2 seconds');
  }, 2000);
}