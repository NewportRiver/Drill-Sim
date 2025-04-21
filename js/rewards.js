    import { debugLog } from './utils.js';

    // === Dont leave the pop up reward active ===
    let popupActive = false;

    export function triggerReward() {
      const popup = document.getElementById('rewardPopup');
      if (!popup || popupActive) return;
    
      popupActive = true;
      console.log('🎯 triggerReward() fired');
      console.trace("Popup called from:");
      console.log('🎬 Resetting popup animation...');
      console.log('⏳ offsetHeight:', popup.offsetHeight);
    
      const messages = [
        "🎯 Target Down!",
        "🏅 Stack on Me!",
        "🔥 ALL CLEAR!",
        "✅ Target Acquired!"
      ];
    
      const message = messages[Math.floor(Math.random() * messages.length)];
      popup.textContent = message;
    
      // ✅ Make sure popup is visible BEFORE triggering animation
      popup.classList.remove('hidden'); // Show popup immediately

      // ✅ Wait one frame to ensure DOM has time to compute new layout
      requestAnimationFrame(() => {
        console.log('⏳ offsetHeight:', popup.offsetHeight); // <-- move here
        popup.style.animation = 'none';
        popup.offsetHeight;
        popup.style.animation = '';
        popup.classList.add('popFade');
        console.log('✅ Animation applied after DOM layout stabilized');
      });

      // ✅ Play random sound
      const sounds = Array.from({ length: 7 }, (_, i) =>
        document.getElementById(`successSound${i + 1}`)
      ).filter(Boolean);
    
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      sound?.play().catch(err => console.warn('⚠️ Sound playback failed:', err));
    
      // ✅ Cleanup after animation
      setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('popFade');
        popupActive = false;
      }, 1500); // Match your popFade duration
    }