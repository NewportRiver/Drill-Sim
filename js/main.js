// === Import modules ===
import { triggerReward } from './rewards.js';
import { loadModule } from './scriptloader.js';
import { handleTyping } from './typing.js';
import { startSpeechRecognition } from './speech.js';
import { updateProgressBar, renderProgressBar } from './progress.js';
import { debugLog } from './utils.js'; // ✅ Add debug logger

// === Expose reward to the Global Window and fire only once
window.triggerReward = triggerReward;
let rewardGiven = false;
let finalRewardGiven = false; // ✅ Needed for 100% reward logic

// === Global Script State ===
let currentScript = [];

// === Embedded fallback scripts (local/offline use) ===
const embeddedScripts = { 
        "module": "1",
        "title": "Position of Attention",
        "script_steps": [
          { "step_number": 1, "text": "The next position, which I will name, explain, have demonstrated, and which you will conduct practical work on, is the position of attention." },
          { "step_number": 2, "text": "The position of attention is the key position for all stationary, facing, and marching movements." },
          { "step_number": 3, "text": "The commands for this position are FALL IN and ATTENTION." },
          { "step_number": 4, "text": "FALL IN is a combined command. ATTENTION is a two part command when proceeded by a preparatory command, such as Squad, Platoon, or Demonstrator." },
          { "step_number": 5, "text": "I will use Demonstrator as the preparatory command and ATTENTION as the command of execution." },
          { "step_number": 6, "text": "When given, these commands are as follows: FALL IN. Demonstrator, ATTENTION." },
          { "step_number": 7, "text": "Demonstrator, POST. I will use the talk through method of instruction." },
          { "step_number": 8, "text": "On the command FALL IN or on the command of execution ATTENTION of Demonstrator, ATTENTION, bring the heels together sharply on line, with the toes pointing out equally, forming a forty five degree angle." },
          { "step_number": 9, "text": "Rest the weight of the body evenly on the heels and balls of both feet." },
          { "step_number": 10, "text": "Keep the legs straight without locking the knees." },
          { "step_number": 11, "text": "Hold the body erect with the hips level, chest lifted and arched, and the shoulders square." },
          { "step_number": 12, "text": "Keep the head erect and face straight to the front with the chin drawn in so that the alignment of the head and neck is vertical." },
          { "step_number": 13, "text": "Let the arms hang straight without stiffness." },
          { "step_number": 14, "text": "Curl the fingers so that the tips of the thumbs are alongside and touching the first joint of the forefingers." },
          { "step_number": 15, "text": "Keep the thumbs straight along the seams of the trouser leg with the first joint of the fingers touching the trousers." },
          { "step_number": 16, "text": "Remain silent and do not move unless otherwise directed. RELAX." },
          { "step_number": 17, "text": "At normal cadence, this position would look as follows: FALL IN. RELAX. Demonstrator, ATTENTION. RELAX." },
          { "step_number": 18, "text": "What are your questions pertaining to this position when executed at normal cadence or using the talk-through method of instruction?" },
          { "step_number": 19, "text": "Demonstrator, ATTENTION. You will now become my assistant instructor. FALL OUT." }
        ]
      };

// === Load Script Module ===
window.loadModule = async function (module) {
    debugLog('main.loadModule', `Loading module ${module}`);
    rewardGiven = false; // ✅ Reset reward
    currentScript = await loadModule(module, embeddedScripts);
    debugLog('main.loadModule', `Script loaded with ${currentScript.length} lines`);

    renderProgressBar();     // Setup bar visually
    updateProgressBar();     // Set initial fill state 
 };

// === Handle Typing Input from Window Scope ===
window.handleTyping = () => {
    debugLog('main.handleTyping', 'Typing input triggered');
    handleTyping(currentScript);
  };
  
  // === Start Practice Mode ===
  window.startPracticeMode = () => {
    debugLog('main.startPracticeMode', 'Practice mode started');
    document.getElementById('typingMode').style.display = 'none';
    startSpeechRecognition(currentScript, updateProgressBar);
  };
  
  // === Start Testing Mode ===
  window.startTestingMode = () => {
    debugLog('main.startTestingMode', 'Testing mode started');
    document.getElementById('typingMode').style.display = 'none';
    startSpeechRecognition(currentScript, updateProgressBar);
  };
  
  // === Start Typing Mode (Manual) ===
  window.startTypingMode = () => {
    debugLog('main.startTypingMode', 'Typing mode started');
    document.getElementById('typingMode').style.display = 'block';
  };
  
      // TEST LOAD OF MAIN.JS ===
  console.log("✅ main.js fully loaded");