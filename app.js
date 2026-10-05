/* ==========================================================================
   RECALL — Interactive Frontend Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAudioEngine();
  initCollapsibleIslandNav();
  initStarfield();
  initLiveClock();
  initHeroNotch();
  initGSAPAndLenis();
  initCinematicDemoShowcase();
  initSlotDrumAndAppsMatrix();
  initVoicenotesController();
  initLiveStage();
  initRoadmap();
  initFAQ();
  initModals();
  initMobileMenu();
  initDraggableWidgets();
  initFeedbackForm();
});

/* ==========================================================================
   1. PROCEDURAL SOUND ENGINE (Disabled)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioEngine() {
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (!soundToggleBtn) return;
  const soundStateLabel = document.getElementById('sound-state-label');
  const soundIconOn = document.querySelector('.sound-icon-on');
  const soundIconOff = document.querySelector('.sound-icon-off');

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundStateLabel) soundStateLabel.textContent = soundEnabled ? 'ON' : 'OFF';
    if (soundEnabled) {
      if (soundIconOn) soundIconOn.classList.remove('hidden');
      if (soundIconOff) soundIconOff.classList.add('hidden');
      playUiSound('click');
    } else {
      if (soundIconOn) soundIconOn.classList.add('hidden');
      if (soundIconOff) soundIconOff.classList.remove('hidden');
    }
  });
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playUiSound(type = 'click') {
  // SFX disabled on buttons
  return;
}

/* ==========================================================================
   1B. EXACT MACBOOK NOTCH CONTROLLER & 5-STATE CYCLE ENGINE
   ========================================================================== */
function initCollapsibleIslandNav() {
  const hardwareNotch = document.getElementById('macbook-hardware-notch');
  if (!hardwareNotch) return;

  const states = ['recording', 'music', 'clipboard', 'timer', 'stats'];
  let currentStateIdx = 0;
  let cycleInterval = null;
  let isHovered = false;

  const leftItems = hardwareNotch.querySelectorAll('#notch-slot-left .notch-state-item');
  const rightItems = hardwareNotch.querySelectorAll('#notch-slot-right .notch-state-item');

  function setActiveState(stateName) {
    leftItems.forEach(item => {
      if (item.dataset.state === stateName) item.classList.add('active');
      else item.classList.remove('active');
    });
    rightItems.forEach(item => {
      if (item.dataset.state === stateName) item.classList.add('active');
      else item.classList.remove('active');
    });
  }

  function startCycle() {
    if (cycleInterval) clearInterval(cycleInterval);
    cycleInterval = setInterval(() => {
      if (!isHovered && !hardwareNotch.classList.contains('expanded')) {
        currentStateIdx = (currentStateIdx + 1) % states.length;
        setActiveState(states[currentStateIdx]);
      }
    }, 3500);
  }

  // Hover expansion & cycle pause
  hardwareNotch.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  hardwareNotch.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Toggle on click or keyboard
  hardwareNotch.addEventListener('click', (e) => {
    // If click was on a link or button or clipboard item, let their default/custom action run
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.notch-clip-item')) return;
    hardwareNotch.classList.toggle('expanded');
    playUiSound('expand');
  });

  // Active state for notch nav links
  const notchNavLinks = hardwareNotch.querySelectorAll('.notch-nav-link');
  notchNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      notchNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Keyboard shortcut 'N' to toggle Notch
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      hardwareNotch.classList.toggle('expanded');
      playUiSound('expand');
    }
  });

  // Collapse arrow button
  const collapseBtn = document.getElementById('notch-collapse-btn');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hardwareNotch.classList.remove('expanded');
      playUiSound('pop');
    });
  }

  // 6 Tab Switching
  const catBtns = hardwareNotch.querySelectorAll('.notch-cat-btn');
  const tabViews = hardwareNotch.querySelectorAll('.notch-tab-view');

  catBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetTab = btn.dataset.tab;
      if (!targetTab) return;

      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabViews.forEach(view => view.classList.remove('active'));
      const activeView = document.getElementById(`notch-view-${targetTab}`);
      if (activeView) activeView.classList.add('active');

      // Also set compact bar state to match
      if (states.includes(targetTab)) {
        currentStateIdx = states.indexOf(targetTab);
        setActiveState(targetTab);
      }

      playUiSound('click');
    });
  });

  // Music Player in Expanded Panel
  const notchPlayBtn = document.getElementById('notch-btn-play');
  const notchPlayIcon = document.getElementById('notch-play-icon');
  const scrubberProgress = document.getElementById('notch-music-scrubber');
  let isNotchPlaying = true;
  let scrubberPercent = 44;

  if (notchPlayBtn) {
    notchPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isNotchPlaying = !isNotchPlaying;
      if (isNotchPlaying) {
        if (notchPlayIcon) notchPlayIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      } else {
        if (notchPlayIcon) notchPlayIcon.innerHTML = '<polygon points="6 4 20 12 6 20 6 4"></polygon>';
      }
      playUiSound('click');
    });
  }

  // Scrubber animation
  setInterval(() => {
    if (isNotchPlaying && scrubberProgress) {
      scrubberPercent = (scrubberPercent + 0.5) % 100;
      scrubberProgress.style.width = `${scrubberPercent}%`;
    }
  }, 1000);

  // Live timer countdown in notch mini & expanded
  let timerSeconds = 252; // 04:12
  const miniTimer = document.getElementById('notch-countdown-mini');
  const bigTimer = document.getElementById('notch-timer-big');
  const recTimer = document.getElementById('notch-rec-timer');
  let recSeconds = 99; // 01:39
  let isTimerRunning = true;

  setInterval(() => {
    // Rec timer increments
    recSeconds++;
    const rMin = Math.floor(recSeconds / 60).toString().padStart(2, '0');
    const rSec = (recSeconds % 60).toString().padStart(2, '0');
    if (recTimer) recTimer.textContent = `${rMin}:${rSec}`;

    // Pomodoro timer decrements
    if (isTimerRunning && timerSeconds > 0) {
      timerSeconds--;
      const tMin = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
      const tSec = (timerSeconds % 60).toString().padStart(2, '0');
      const formatted = `${tMin}:${tSec}`;
      if (miniTimer) miniTimer.textContent = formatted;
      if (bigTimer) bigTimer.textContent = formatted;
    }
  }, 1000);

  const btnTimerToggle = document.getElementById('btn-timer-toggle');
  if (btnTimerToggle) {
    btnTimerToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      isTimerRunning = !isTimerRunning;
      btnTimerToggle.textContent = isTimerRunning ? 'Pause' : 'Resume';
      playUiSound('click');
    });
  }

  const btnTimerReset = document.getElementById('btn-timer-reset');
  if (btnTimerReset) {
    btnTimerReset.addEventListener('click', (e) => {
      e.stopPropagation();
      timerSeconds = 252;
      if (miniTimer) miniTimer.textContent = '04:12';
      if (bigTimer) bigTimer.textContent = '04:12';
      playUiSound('pop');
    });
  }

  // Clipboard 1-Click Copy in expanded panel
  const clipItems = hardwareNotch.querySelectorAll('.notch-clip-item');
  clipItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = item.dataset.clip;
      if (textToCopy) {
        navigator.clipboard?.writeText(textToCopy).catch(() => { });
        const actionSpan = item.querySelector('.clip-action');
        if (actionSpan) {
          const prevText = actionSpan.textContent;
          actionSpan.textContent = 'Copied!';
          actionSpan.style.color = '#38bdf8';
          setTimeout(() => {
            actionSpan.textContent = prevText;
            actionSpan.style.color = '#94a3b8';
          }, 1500);
        }
        playUiSound('pop');
      }
    });
  });

  // Start the 5-state cyclical loop
  startCycle();
}

/* ==========================================================================
   2. PROCEDURAL STARFIELD GENERATION
   ========================================================================== */
function initStarfield() {
  const container = document.getElementById('starfield');
  if (!container) return;

  const starCount = 60;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    const top = Math.random() * 95;
    const left = Math.random() * 98;
    const size = (Math.random() * 2 + 1).toFixed(1);
    const delay = (Math.random() * 4).toFixed(1);
    const duration = (Math.random() * 3 + 2).toFixed(1);

    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${delay}s`;
    star.style.animationDuration = `${duration}s`;

    container.appendChild(star);
  }
}

/* ==========================================================================
   3. LIVE MACOS MENUBAR CLOCK
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-macos-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[now.getDay()];
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    clockEl.textContent = `${day} ${hours}:${minutes} ${ampm}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   4. HERO INTERACTIVE NOTCH HUD & MODES
   ========================================================================== */
let isMusicPlaying = true;

function initHeroNotch() {
  const notchBody = document.getElementById('hero-interactive-notch');
  const headerTrigger = document.getElementById('notch-header-trigger');
  const toggleBtn = document.getElementById('hero-notch-toggle-btn');
  const modePills = document.querySelectorAll('.notch-mode-pill');
  const viewModes = document.querySelectorAll('.notch-view-mode');

  // Center & Status labels in collapsed notch
  const centerTitle = document.getElementById('notch-center-title');
  const statusChip = document.getElementById('notch-status-chip');
  const statusText = document.getElementById('notch-status-text');

  const modeHeaders = {
    voicenotes: { chip: 'Recording Call', text: '🎙️ 01:34 · Zoom & Mic Transcribing' },
    clipboard: { chip: 'Clipboard', text: '📋 3 new items copied' },
    music: { chip: 'Now Playing', text: '🎵 Midnight City — M83' },
    shelf: { chip: 'Temp Shelf', text: '📦 3 items staged' },
    weather: { chip: 'Live Weather', text: '⛅ 72°F · Cupertino (Partly Cloudy)' },
    widgets: { chip: 'Desktop Widgets', text: '🪟 3 Mini HUDs Pinned' }
  };

  // Toggle Notch Expansion
  function toggleNotch() {
    notchBody.classList.toggle('expanded');
    playUiSound('expand');
  }

  if (headerTrigger) headerTrigger.addEventListener('click', toggleNotch);
  if (toggleBtn) toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNotch();
  });

  // Switch Notch View Mode
  modePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const targetMode = pill.dataset.mode;

      // Update pills
      modePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      // Update views
      viewModes.forEach((vm) => vm.classList.remove('active'));
      const activeView = document.getElementById(`notch-mode-${targetMode}`);
      if (activeView) activeView.classList.add('active');

      // Update Header Text
      if (modeHeaders[targetMode]) {
        statusText.textContent = modeHeaders[targetMode].chip;
        centerTitle.textContent = modeHeaders[targetMode].text;
      }

      // Auto expand on switch
      if (!notchBody.classList.contains('expanded')) {
        notchBody.classList.add('expanded');
      }

      playUiSound('click');
    });
  });

  // Music Play/Pause Toggle
  const musicPlayBtn = document.getElementById('music-play-btn');
  const vinylDisc = document.getElementById('vinyl-disc');
  const eqBars = document.querySelectorAll('.eq-bar');

  if (musicPlayBtn) {
    musicPlayBtn.addEventListener('click', () => {
      isMusicPlaying = !isMusicPlaying;
      if (isMusicPlaying) {
        musicPlayBtn.textContent = '⏸';
        vinylDisc.classList.add('spinning');
        eqBars.forEach((bar) => bar.style.animationPlayState = 'running');
      } else {
        musicPlayBtn.textContent = '▶';
        vinylDisc.classList.remove('spinning');
        eqBars.forEach((bar) => bar.style.animationPlayState = 'paused');
      }
      playUiSound('click');
    });
  }

  // Lyrics toggle chip
  const lyricsBtn = document.getElementById('toggle-lyrics-chip');
  const lyricsBox = document.getElementById('lyrics-preview');
  if (lyricsBtn && lyricsBox) {
    lyricsBtn.addEventListener('click', () => {
      lyricsBox.classList.toggle('hidden');
      playUiSound('click');
    });
  }

  // Shelf Add Slot
  const shelfAddBtn = document.getElementById('shelf-add-item-btn');
  const shelfDropZone = document.getElementById('shelf-drop-zone');
  if (shelfAddBtn && shelfDropZone) {
    shelfAddBtn.addEventListener('click', () => {
      const card = document.createElement('div');
      card.className = 'shelf-card';
      card.draggable = true;
      card.innerHTML = `
        <span class="shelf-file-icon">✨</span>
        <span class="shelf-file-name">Snippet_${Math.floor(Math.random() * 900) + 100}.txt</span>
        <span class="shelf-file-size">12 KB</span>
      `;
      shelfDropZone.insertBefore(card, shelfAddBtn);
      playUiSound('pop');
    });
  }
}

/* ==========================================================================
   4B. AUTHENTIC VOICE RECORD SCREEN CONTROLLER (VOICENOTES 3-COLUMN ENGINE)
   ========================================================================== */
let isRecordingActive = false;
let recordSecTimer = 0;
let recordInterval = null;
let isAudioMemoPlaying = false;

function initVoicenotesController() {
  // 1. Top Island Toolbar Mode Switching
  const tbIconBtns = document.querySelectorAll('.notch-tb-icon-btn');
  const heroModePills = document.querySelectorAll('.notch-mode-pill');
  const viewModes = document.querySelectorAll('.notch-view-mode');
  const notchBody = document.getElementById('hero-interactive-notch');

  tbIconBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (!mode) return;

      // Update toolbar active icons
      tbIconBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Sync with hero mode pills
      heroModePills.forEach((p) => {
        if (p.dataset.mode === mode) p.classList.add('active');
        else p.classList.remove('active');
      });

      // Show corresponding view
      viewModes.forEach((vm) => vm.classList.remove('active'));
      const activeView = document.getElementById(`notch-mode-${mode}`);
      if (activeView) activeView.classList.add('active');

      if (notchBody && !notchBody.classList.contains('expanded')) {
        notchBody.classList.add('expanded');
      }

      playUiSound('click');
    });
  });

  // 2. Orbital Tap to Record Dial
  const orbitBtns = document.querySelectorAll('#vn-orbit-record-btn, #vn-orbit-btn-card');
  const orbitRings = document.querySelectorAll('#vn-orbit-ring, #vn-orbit-ring-card');
  const orbitLabels = document.querySelectorAll('#vn-orbit-label, #vn-orbit-label-card');
  const countLabels = document.querySelectorAll('#vn-recordings-count-label, #vn-card-count-label');
  const itemsList = document.getElementById('vn-items-scroll-list');

  function toggleRecord() {
    isRecordingActive = !isRecordingActive;

    if (isRecordingActive) {
      recordSecTimer = 0;
      orbitRings.forEach((r) => r.classList.add('recording'));
      orbitBtns.forEach((b) => b.classList.add('recording'));
      orbitLabels.forEach((l) => l.textContent = 'Recording 00:00...');
      playUiSound('rec_start');

      recordInterval = setInterval(() => {
        recordSecTimer++;
        const m = Math.floor(recordSecTimer / 60).toString().padStart(2, '0');
        const s = (recordSecTimer % 60).toString().padStart(2, '0');
        orbitLabels.forEach((l) => l.textContent = `Recording ${m}:${s}... (Tap to stop)`);
      }, 1000);
    } else {
      clearInterval(recordInterval);
      orbitRings.forEach((r) => r.classList.remove('recording'));
      orbitBtns.forEach((b) => b.classList.remove('recording'));
      orbitLabels.forEach((l) => l.textContent = 'Tap to record');
      playUiSound('success');

      // Create new recording item
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newDur = recordSecTimer < 10 ? `0:0${recordSecTimer || 3}` : `0:${recordSecTimer}`;
      const newRecId = Date.now();
      const newTitle = `Recording · ${timeStr}`;
      const newMeta = `Today · ${Math.floor((recordSecTimer || 3) * 2.2)} words`;
      const newTranscript = "Voice note transcribed live on-device with zero cloud latency. Key action items identified and saved directly to your workspace.";

      const newRowHtml = `
        <div class="vn-item-row active" data-rec-id="${newRecId}" data-title="${newTitle}" data-date="${newMeta}" data-meta="Today · ${newDur} · ${Math.floor((recordSecTimer || 3) * 2.2)} words" data-dur="${newDur}" data-text="${newTranscript}">
          <div class="vn-item-info">
            <span class="vn-bullet-dot"></span>
            <div class="vn-item-text-wrap">
              <span class="vn-item-title">${newTitle}</span>
              <span class="vn-item-sub">${newMeta}</span>
            </div>
          </div>
          <span class="vn-item-dur">${newDur}</span>
        </div>
      `;

      // Prepend to list
      if (itemsList) {
        document.querySelectorAll('.vn-item-row').forEach((r) => r.classList.remove('active'));
        itemsList.insertAdjacentHTML('afterbegin', newRowHtml);
        const allItems = itemsList.querySelectorAll('.vn-item-row');
        countLabels.forEach((c) => c.textContent = `${allItems.length} recordings`);
        attachRowListeners();
      }

      // Update right card with new recording
      updateRightCard(newTitle, `Today · ${newDur} · ${Math.floor((recordSecTimer || 3) * 2.2)} words`, newTranscript);
    }
  }

  orbitBtns.forEach((btn) => {
    btn.addEventListener('click', toggleRecord);
  });

  // 3. Recordings List Click Handler
  const cardTitle = document.getElementById('vn-card-rec-title');
  const cardMeta = document.getElementById('vn-card-meta-label');
  const cardTranscript = document.getElementById('vn-card-transcript-text');

  function updateRightCard(title, meta, text) {
    if (cardTitle) cardTitle.textContent = title;
    if (cardMeta) cardMeta.textContent = meta;
    if (cardTranscript) cardTranscript.textContent = `"${text}"`;
  }

  function attachRowListeners() {
    const rows = document.querySelectorAll('.vn-item-row');
    rows.forEach((row) => {
      row.onclick = () => {
        rows.forEach((r) => r.classList.remove('active'));
        row.classList.add('active');

        const title = row.dataset.title || 'Recording';
        const meta = row.dataset.meta || row.dataset.date || 'Today';
        const text = row.dataset.text || 'Voice memo transcribed.';
        updateRightCard(title, meta, text);
        playUiSound('click');
      };
    });
  }

  attachRowListeners();

  // 4. Play Voice Memo Button & Waveform Animation
  const playBtns = document.querySelectorAll('#btn-play-vn-memo, #btn-card-hud-play');
  const waveBarsWrap = document.getElementById('vn-card-wave-bars');
  const playIcon = document.querySelector('.vn-play-icon');
  const pauseIcon = document.querySelector('.vn-pause-icon');

  playBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      isAudioMemoPlaying = !isAudioMemoPlaying;
      if (isAudioMemoPlaying) {
        if (waveBarsWrap) waveBarsWrap.classList.add('playing');
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
        playUiSound('pop');
      } else {
        if (waveBarsWrap) waveBarsWrap.classList.remove('playing');
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
        playUiSound('click');
      }
    });
  });

  // 5. Copy Transcript Button
  const copyBtn = document.getElementById('btn-copy-vn-transcript');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = cardTranscript ? cardTranscript.textContent.replace(/^"|"$/g, '') : '';
      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy);
      }
      playUiSound('success');
      copyBtn.style.color = '#34d399';
      setTimeout(() => {
        copyBtn.style.color = '';
      }, 1200);
    });
  }

  // 6. Trash / Delete Recording
  const trashBtn = document.getElementById('btn-trash-vn-recording');
  if (trashBtn && itemsList) {
    trashBtn.addEventListener('click', () => {
      const activeRow = itemsList.querySelector('.vn-item-row.active');
      if (activeRow) {
        activeRow.remove();
        const remaining = itemsList.querySelectorAll('.vn-item-row');
        countLabels.forEach((c) => c.textContent = `${remaining.length} recordings`);
        if (remaining.length > 0) {
          remaining[0].click();
        }
        playUiSound('click');
      }
    });
  }

  // 7. AI Quick Chips (Transcript vs Summary vs Action Items vs Ask AI)
  const aiChips = document.querySelectorAll('.vn-ai-chip');
  const aiContentMap = {
    'btn-ai-tab-trans': "You're about four. 40 seconds every morning that quietly decide your entire day. Your alarm goes off, and before you've even opened your eyes, you decide whether to conquer the day or stay in comfort. This small choice compounds over weeks into pure momentum.",
    'btn-ai-tab-summ': "💡 Key Takeaway: The morning 40-second mental threshold determines daily productivity momentum. Overcoming friction early creates positive compounding effects.",
    'btn-ai-tab-todo': "📋 Action Items:\n1. Wake up without hitting snooze\n2. Drink 500ml water immediately\n3. Review top 3 MITs (Most Important Tasks) before checking messages",
    'btn-ai-tab-ask': "✨ Voicenotes AI Recall: Alex mentioned morning routine optimization aligns with the team's deep work sprint framework."
  };

  aiChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      aiChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const text = aiContentMap[chip.id];
      if (text && cardTranscript) {
        cardTranscript.textContent = `"${text}"`;
      }
      playUiSound('click');
    });
  });
}

/* ==========================================================================
   5. LIVE SHOWCASE STAGE TAB CONTROLLER (6 TABS)
   ========================================================================== */
let currentStageIndex = 0;
const totalStageTabs = 6;

function initLiveStage() {
  const tabBtns = document.querySelectorAll('.stage-tab-btn');
  const tabContents = document.querySelectorAll('.stage-tab-content');
  const prevBtns = document.querySelectorAll('#stage-prev-btn, .stage-prev-click');
  const nextBtns = document.querySelectorAll('#stage-next-btn, .stage-next-click');

  function showTab(index) {
    currentStageIndex = (index + totalStageTabs) % totalStageTabs;

    tabBtns.forEach((btn, idx) => {
      if (idx === currentStageIndex) {
        btn.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach((content, idx) => {
      if (idx === currentStageIndex) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    playUiSound('click');
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabIdx = parseInt(btn.dataset.tab, 10);
      showTab(tabIdx);
    });
  });

  prevBtns.forEach((btn) => btn.addEventListener('click', () => showTab(currentStageIndex - 1)));
  nextBtns.forEach((btn) => btn.addEventListener('click', () => showTab(currentStageIndex + 1)));

  // Interactive Stage Voicenotes Live Speech Simulation
  const streamSimBtn = document.getElementById('demo-vn-stream-btn');
  const transcriptBox = document.getElementById('stage-vn-transcript-box');
  const speechSamples = [
    { speaker: 'Marcus (CTO)', tag: 'speaker-tag-coral', text: 'All audio stays encrypted in the secure enclave with on-device models.' },
    { speaker: 'Sarah (Design)', tag: 'speaker-tag-coral', text: 'The notch HUD expands subtly whenever someone starts speaking on Zoom.' },
    { speaker: 'You (Host)', tag: 'speaker-tag-blue', text: 'And exports directly to Apple Notes or Notion with one click.' }
  ];
  let sampleIndex = 0;

  if (streamSimBtn && transcriptBox) {
    streamSimBtn.addEventListener('click', () => {
      const sample = speechSamples[sampleIndex % speechSamples.length];
      sampleIndex++;

      const turn = document.createElement('div');
      turn.className = 'stage-vn-turn';
      turn.innerHTML = `
        <span class="${sample.tag}">${sample.speaker} · Just now</span>
        <p>${sample.text}</p>
      `;
      transcriptBox.appendChild(turn);
      transcriptBox.scrollTop = transcriptBox.scrollHeight;
      playUiSound('rec_start');
    });
  }

  // Interactive Ask AI in Stage
  const stageAskInput = document.getElementById('stage-askai-input');
  const stageAskBtn = document.getElementById('stage-askai-btn');
  const stageAskResult = document.getElementById('stage-askai-result');

  if (stageAskBtn && stageAskInput && stageAskResult) {
    function submitStageAsk() {
      const val = stageAskInput.value.trim();
      if (!val) return;

      stageAskResult.innerHTML = `
        <strong>AI Second Brain Answer:</strong> Based on the meeting audio, Elena & team confirmed zero-bot transcription, on-device processing, and direct Notion export.
      `;
      playUiSound('success');
    }

    stageAskBtn.addEventListener('click', submitStageAsk);
    stageAskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitStageAsk();
    });
  }
}

// Global Stage City Switcher
window.switchStageCity = function (cityName, temp, cond, icon, btnElement) {
  const cityBtns = document.querySelectorAll('.btn-city-pill');
  cityBtns.forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const cityEl = document.getElementById('stage-weather-city');
  const tempEl = document.getElementById('stage-weather-temp');
  const condEl = document.getElementById('stage-weather-cond');
  const iconEl = document.getElementById('stage-weather-icon');

  if (cityEl) cityEl.textContent = cityName;
  if (tempEl) tempEl.textContent = temp;
  if (condEl) condEl.textContent = cond;
  if (iconEl) iconEl.textContent = icon;

  playUiSound('pop');
};

// Global Demo Copy Function
window.copyDemoText = function (text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btnElement.textContent;
    btnElement.textContent = 'Copied! ✓';
    btnElement.style.background = '#10b981';
    playUiSound('success');
    setTimeout(() => {
      btnElement.textContent = original;
      btnElement.style.background = '';
    }, 1800);
  });
};

/* ==========================================================================
   6. ROADMAP UPVOTING SYSTEM
   ========================================================================== */
function initRoadmap() {
  const upvoteBtns = document.querySelectorAll('.btn-upvote');

  upvoteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const countEl = btn.querySelector('.upvote-count');
      let currentCount = parseInt(countEl.dataset.count, 10);

      if (btn.classList.contains('upvoted')) {
        btn.classList.remove('upvoted');
        currentCount--;
      } else {
        btn.classList.add('upvoted');
        currentCount++;
        playUiSound('pop');
      }

      countEl.dataset.count = currentCount;
      countEl.textContent = currentCount;
    });
  });
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    const pane = item.querySelector('.faq-answer-pane');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open faqs
      faqItems.forEach((other) => {
        other.classList.remove('active');
        const otherPane = other.querySelector('.faq-answer-pane');
        const otherBtn = other.querySelector('.faq-question-btn');
        if (otherPane) otherPane.style.maxHeight = '0px';
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        pane.style.maxHeight = `${pane.scrollHeight + 30}px`;
        btn.setAttribute('aria-expanded', 'true');
        playUiSound('click');
      }
    });
  });
}

/* ==========================================================================
   8. MODALS & DOWNLOAD / CHECKOUT HANDLER
   ========================================================================== */
const CHECKOUT_URL = 'https://checkout.dodopayments.com/buy/pdt_0Nox1p0HZWf072MENhhcx?quantity=1&redirect_url=https://github.com%2Fkartkik%2Frecall-macos%2Freleases%2Fdownload%2Fv1.0.3%2FRecall.dmg';

function initModals() {
  const downloadModal = document.getElementById('download-modal');
  const genericModal = document.getElementById('generic-modal');
  const lightboxModal = document.getElementById('demo-lightbox-modal');
  const openDownloadBtns = document.querySelectorAll('.open-download-modal-btn');
  const closeDownloadBtn = document.getElementById('modal-close-btn');
  const closeGenericBtn = document.getElementById('generic-modal-close');
  const closeLightboxBtn = document.getElementById('cinema-lightbox-close');

  const collabOpenBtn = document.getElementById('btn-collab-modal-open');
  const suggestOpenBtn = document.getElementById('btn-suggest-modal-open');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      playUiSound('expand');
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      playUiSound('click');
    }
  }

  openDownloadBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // If it's a direct checkout link, allow normal navigation
      if (btn.tagName === 'A' && btn.getAttribute('href') && btn.getAttribute('href') !== '#') {
        return;
      }
      e.preventDefault();
      window.location.href = CHECKOUT_URL;
    });
  });

  if (closeDownloadBtn) closeDownloadBtn.addEventListener('click', () => closeModal(downloadModal));
  if (closeGenericBtn) closeGenericBtn.addEventListener('click', () => closeModal(genericModal));
  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', () => closeModal(lightboxModal));

  [downloadModal, genericModal, lightboxModal].forEach((m) => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) closeModal(m);
      });
    }
  });

  if (collabOpenBtn) {
    collabOpenBtn.addEventListener('click', () => {
      document.getElementById('generic-modal-title').textContent = 'Apply for Creator Collab';
      document.getElementById('generic-modal-desc').textContent = 'Create a short video with Recall and get an instant lifetime license.';
      document.getElementById('form-link-label').textContent = 'TikTok, YouTube or X Channel URL';
      openModal(genericModal);
    });
  }

  if (suggestOpenBtn) {
    suggestOpenBtn.addEventListener('click', () => {
      document.getElementById('generic-modal-title').textContent = 'Suggest a Feature';
      document.getElementById('generic-modal-desc').textContent = 'What would make your Mac notch workflow even better? We read every suggestion.';
      document.getElementById('form-link-label').textContent = 'Relevant link / workflow example (Optional)';
      openModal(genericModal);
    });
  }

  // License Verification Simulator
  const verifyBtn = document.getElementById('btn-verify-license');
  const licenseInput = document.getElementById('license-key-input');
  const licenseMsg = document.getElementById('license-msg');

  if (verifyBtn && licenseInput && licenseMsg) {
    verifyBtn.addEventListener('click', () => {
      const key = licenseInput.value.trim();
      if (!key) {
        licenseMsg.textContent = 'Please enter a valid license key.';
        licenseMsg.style.color = '#ef4444';
        return;
      }
      licenseMsg.textContent = 'Verifying with Apple Notarization Server...';
      licenseMsg.style.color = '#1a7af0';

      setTimeout(() => {
        licenseMsg.textContent = '✓ Lifetime License Activated! All features unlocked.';
        licenseMsg.style.color = '#10b981';
        playUiSound('success');
      }, 1200);
    });
  }
}

// Download Simulator / Direct checkout redirect
window.startDownloadSim = function (arch) {
  window.location.href = CHECKOUT_URL;
};

window.handleGenericSubmit = function (e) {
  e.preventDefault();
  playUiSound('success');
  alert('Thank you! Your submission has been received. Our team will review it and get in touch within 24 hours.');
  const genericModal = document.getElementById('generic-modal');
  if (genericModal) {
    genericModal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

/* ==========================================================================
   9. MOBILE NOTCH MENUBAR
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const islandNav = document.getElementById('island-nav');
  const mobileLinks = document.querySelectorAll('.island-mobile-link, .island-mobile-download-btn');

  if (toggle && islandNav) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = islandNav.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      playUiSound('click');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        islandNav.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (islandNav.classList.contains('menu-open') && !islandNav.contains(e.target)) {
        islandNav.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && islandNav.classList.contains('menu-open')) {
        islandNav.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   10. DRAGGABLE FLOATING DESKTOP WIDGETS
   ========================================================================== */
function initDraggableWidgets() {
  const widgets = document.querySelectorAll('.desktop-widget');

  widgets.forEach((widget) => {
    let isDragging = false;
    let startX, startY, origLeft, origTop;

    widget.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = widget.offsetLeft;
      origTop = widget.offsetTop;
      widget.style.cursor = 'grabbing';
      widget.style.zIndex = '50';
      playUiSound('click');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      widget.style.left = `${origLeft + dx}px`;
      widget.style.top = `${origTop + dy}px`;
      widget.style.bottom = 'auto';
      widget.style.right = 'auto';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        widget.style.cursor = 'grab';
      }
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ==========================================================================
   11. AUTHENTIC MACBOOK HARDWARE NOTCH & DYNAMIC ISLAND CONTROLLER
   ========================================================================== */
function initCollapsibleIslandNav() {
  const hardwareNotch = document.getElementById('macbook-hardware-notch');
  const navChipText = document.getElementById('nav-chip-text');

  if (!hardwareNotch) return;

  function toggleNotch(e) {
    if (e && (e.target.closest('.dropdown-cta-btn') || e.target.closest('.notch-mode-item'))) {
      return; // allow links to click
    }
    hardwareNotch.classList.toggle('expanded');
    if (hardwareNotch.classList.contains('expanded')) {
      playUiSound('expand');
    } else {
      playUiSound('pop');
    }
  }

  hardwareNotch.addEventListener('click', toggleNotch);

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!hardwareNotch.contains(e.target) && hardwareNotch.classList.contains('expanded')) {
      hardwareNotch.classList.remove('expanded');
    }
  });

  // Keyboard shortcut: Press 'N' or 'n' to toggle top notch
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 'n' || e.key === 'N') {
      toggleNotch();
    }
  });

  // Live ticking status in navbar notch
  let recSec = 94; // starts at 01:34
  setInterval(() => {
    recSec++;
    const m = Math.floor(recSec / 60).toString().padStart(2, '0');
    const s = (recSec % 60).toString().padStart(2, '0');
    if (navChipText) {
      navChipText.textContent = `${m}:${s}`;
    }
  }, 1000);
}

/* ==========================================================================
   12. CINEMATIC PRODUCT VIDEO DEMO SHOWCASE CONTROLLER
   ========================================================================== */
function initVideoShowcase() {
  const mainVideo = document.getElementById('main-product-video');
  const centerPlayBtn = document.getElementById('video-center-play-btn');
  const playToggleBtn = document.getElementById('video-play-toggle-btn');
  const iconPlay = document.querySelector('.v-icon-play');
  const iconPause = document.querySelector('.v-icon-pause');
  const progressBarWrap = document.getElementById('video-progress-bar-wrap');
  const progressFill = document.getElementById('video-progress-fill');
  const timecodeEl = document.getElementById('video-timecode');
  const muteToggleBtn = document.getElementById('video-mute-toggle-btn');
  const iconUnmute = document.querySelector('.v-icon-unmute');
  const iconMute = document.querySelector('.v-icon-mute');
  const speedBtn = document.getElementById('btn-video-speed-cycle');
  const fullscreenBtn = document.getElementById('video-fullscreen-btn');
  const titleLabel = document.getElementById('video-title-label');
  const tabBtns = document.querySelectorAll('.video-tab-btn');
  const customFileInput = document.getElementById('custom-video-file-input');
  const customFileTrigger = document.getElementById('btn-custom-video-trigger');

  // Video Notch Overlay inside Cinema Screen
  const videoNotch = document.getElementById('video-notch-overlay');
  const videoNotchTrigger = document.getElementById('v-notch-trigger');
  const videoNotchStatus = document.getElementById('video-notch-status-label');
  const vChips = document.querySelectorAll('.v-chip');

  if (!mainVideo) return;

  function formatTime(sec) {
    if (isNaN(sec) || !isFinite(sec)) return '00:00';
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updatePlayState() {
    if (mainVideo.paused) {
      if (centerPlayBtn) centerPlayBtn.classList.remove('hidden');
      if (iconPlay) iconPlay.classList.remove('hidden');
      if (iconPause) iconPause.classList.add('hidden');
    } else {
      if (centerPlayBtn) centerPlayBtn.classList.add('hidden');
      if (iconPlay) iconPlay.classList.add('hidden');
      if (iconPause) iconPause.classList.remove('hidden');
    }
  }

  function togglePlay() {
    if (mainVideo.paused) {
      mainVideo.play().catch(() => { });
      playUiSound('pop');
    } else {
      mainVideo.pause();
      playUiSound('click');
    }
    updatePlayState();
  }

  if (playToggleBtn) playToggleBtn.addEventListener('click', togglePlay);
  if (centerPlayBtn) centerPlayBtn.addEventListener('click', togglePlay);
  mainVideo.addEventListener('click', togglePlay);
  mainVideo.addEventListener('play', updatePlayState);
  mainVideo.addEventListener('pause', updatePlayState);

  // Time & Progress Update
  mainVideo.addEventListener('timeupdate', () => {
    const cur = mainVideo.currentTime;
    const dur = mainVideo.duration || 1;
    const pct = (cur / dur) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (timecodeEl) timecodeEl.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
  });

  // Progress Bar Seek
  if (progressBarWrap) {
    progressBarWrap.addEventListener('click', (e) => {
      const rect = progressBarWrap.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (mainVideo.duration) {
        mainVideo.currentTime = pos * mainVideo.duration;
        playUiSound('click');
      }
    });
  }

  // Mute / Unmute Toggle
  if (muteToggleBtn) {
    muteToggleBtn.addEventListener('click', () => {
      mainVideo.muted = !mainVideo.muted;
      if (mainVideo.muted) {
        if (iconMute) iconMute.classList.remove('hidden');
        if (iconUnmute) iconUnmute.classList.add('hidden');
      } else {
        if (iconMute) iconMute.classList.add('hidden');
        if (iconUnmute) iconUnmute.classList.remove('hidden');
      }
      playUiSound('click');
    });
  }

  // Playback Speed Cycle
  const speeds = [1.0, 1.25, 1.5, 2.0, 0.75];
  let currentSpeedIdx = 0;
  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
      const spd = speeds[currentSpeedIdx];
      mainVideo.playbackRate = spd;
      speedBtn.textContent = `${spd}x`;
      playUiSound('click');
    });
  }

  // Fullscreen Toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const cinemaFrame = document.querySelector('.cinema-macbook-frame') || mainVideo;
      if (!document.fullscreenElement) {
        if (cinemaFrame.requestFullscreen) {
          cinemaFrame.requestFullscreen();
        } else if (mainVideo.requestFullscreen) {
          mainVideo.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      playUiSound('click');
    });
  }

  // Video Source Switcher Tabs
  tabBtns.forEach((btn) => {
    if (btn.id === 'btn-custom-video-trigger') return;
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const src = btn.dataset.videosrc;
      const title = btn.dataset.videotitle;
      if (src) {
        mainVideo.src = src;
        mainVideo.load();
        mainVideo.play().catch(() => { });
        if (titleLabel) titleLabel.textContent = title || 'Recall Video Showcase';
        playUiSound('expand');
      }
    });
  });

  // Custom Video File Upload
  if (customFileTrigger && customFileInput) {
    customFileTrigger.addEventListener('click', () => {
      customFileInput.click();
    });

    customFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        tabBtns.forEach((b) => b.classList.remove('active'));
        customFileTrigger.classList.add('active');
        customFileTrigger.textContent = `📁 ${file.name.substring(0, 18)}...`;

        mainVideo.src = fileUrl;
        mainVideo.load();
        mainVideo.play().catch(() => { });
        if (titleLabel) titleLabel.textContent = file.name;
        playUiSound('success');
      }
    });
  }

  // Video Notch HUD Expansion
  if (videoNotch) {
    const handleNotchToggle = (e) => {
      if (e.target.closest('.v-chip')) return;
      videoNotch.classList.toggle('expanded');
      playUiSound('expand');
    };
    if (videoNotchTrigger) {
      videoNotchTrigger.addEventListener('click', handleNotchToggle);
    } else {
      videoNotch.addEventListener('click', handleNotchToggle);
    }

    vChips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = chip.textContent.trim();
        if (videoNotchStatus) videoNotchStatus.textContent = `⚡ Active: ${text}`;
        playUiSound('pop');
      });
    });
  }
}

/* ==========================================================================
   13. VOICENOTES VIDEO PLAYER & LIVE CALL SUBTITLES CONTROLLER
   ========================================================================== */
function initVoicenotesVideoDemo() {
  const btnViewVideo = document.getElementById('btn-vn-view-video');
  const btnViewHud = document.getElementById('btn-vn-view-hud');
  const containerVideo = document.getElementById('vn-view-video-container');
  const containerHud = document.getElementById('vn-view-hud-container');
  const vnVideo = document.getElementById('vn-demo-video');
  const btnUnmute = document.getElementById('btn-vn-video-unmute');
  const subtitleSpeaker = document.querySelector('.vn-sub-speaker');
  const subtitleText = document.getElementById('vn-live-subtitle-text');

  // Tab View Switcher (Video Player vs Interactive Simulator)
  if (btnViewVideo && btnViewHud) {
    btnViewVideo.addEventListener('click', () => {
      btnViewVideo.classList.add('active');
      btnViewHud.classList.remove('active');
      if (containerVideo) containerVideo.classList.remove('hidden');
      if (containerHud) containerHud.classList.add('hidden');
      if (vnVideo && vnVideo.paused) vnVideo.play().catch(() => { });
      playUiSound('click');
    });

    btnViewHud.addEventListener('click', () => {
      btnViewHud.classList.add('active');
      btnViewVideo.classList.remove('active');
      if (containerHud) containerHud.classList.remove('hidden');
      if (containerVideo) containerVideo.classList.add('hidden');
      playUiSound('click');
    });
  }

  // Voicenotes Video Audio Unmute
  if (btnUnmute && vnVideo) {
    btnUnmute.addEventListener('click', () => {
      vnVideo.muted = !vnVideo.muted;
      btnUnmute.innerHTML = vnVideo.muted ? '<span>🔇 Muted</span>' : '<span>🔊 Audio (Live)</span>';
      playUiSound('click');
    });
  }

  // Dynamic Time-Synchronized Subtitles Sequence
  if (vnVideo && subtitleText) {
    const subtitleCues = [
      { time: 0, speaker: 'Alex (Product Lead):', text: '"Let\'s make sure the dynamic island notch transcribes our Zoom calls live without needing any meeting bots to join."' },
      { time: 4, speaker: 'Sarah (Design Lead):', text: '"The notch seamlessly expands with authentic Apple spring physics at 120 FPS as soon as CoreAudio activates."' },
      { time: 8, speaker: 'David (CoreAudio Eng):', text: '"All AI transcription models run 100% locally on Apple Silicon Neural Engine with zero cloud egress."' },
      { time: 13, speaker: 'You (Microphone):', text: '"And instant Markdown bullet points and action items sync directly into Notion and Apple Notes."' },
      { time: 17, speaker: 'Voicenotes AI:', text: '"Transcription completed. 4 action items extracted and indexed for instant conversational recall."' }
    ];

    vnVideo.addEventListener('timeupdate', () => {
      const cur = vnVideo.currentTime;
      for (let i = subtitleCues.length - 1; i >= 0; i--) {
        if (cur >= subtitleCues[i].time) {
          if (subtitleSpeaker) subtitleSpeaker.textContent = subtitleCues[i].speaker;
          if (subtitleText) subtitleText.textContent = subtitleCues[i].text;
          break;
        }
      }
    });
  }
}

/* ==========================================================================
   16. PERFORMANCE ENGINE & VIDEO INTERSECTION OBSERVER
   ========================================================================== */
function initGSAPAndLenis() {
  // Pause videos when not in viewport to save 85%+ CPU/GPU resources
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.paused) {
            video.play().catch(() => { });
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('video').forEach(video => {
      videoObserver.observe(video);
    });
  }
}

/* ==========================================================================
   17. CINEMATIC DEMO SHOWCASE (LIGHTBOX & ZOOM HANDLER)
   ========================================================================== */
function initCinematicDemoShowcase() {
  const notchVideo = document.getElementById('cinema-notch-video');
  if (notchVideo) {
    notchVideo.muted = true;
    const playVideo = () => {
      notchVideo.muted = true;
      const promise = notchVideo.play();
      if (promise !== undefined) {
        promise.catch(() => { });
      }
    };
    playVideo();
    ['click', 'touchstart', 'scroll', 'mouseenter'].forEach(evt => {
      document.addEventListener(evt, playVideo, { passive: true, once: true });
    });
  }

  const zoomBtn = document.getElementById('cinema-zoom-btn');
  const lightboxModal = document.getElementById('demo-lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-demo-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');

  // Lightbox Modal Triggers
  function openLightbox(mediaSrc, title, desc) {
    if (lightboxImg && mediaSrc) lightboxImg.src = mediaSrc;
    if (lightboxTitle && title) lightboxTitle.textContent = title;
    if (lightboxDesc && desc) lightboxDesc.textContent = desc;

    if (lightboxModal) {
      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      playUiSound('expand');
    }
  }

  if (zoomBtn) {
    zoomBtn.addEventListener('click', () => {
      openLightbox(
        './assets/notch-expanded-demo.mp4',
        '🎙️ Live Call Transcription & Voicenotes in Notch',
        'Always-on on-device live audio transcription and memory capture seamlessly living in your macOS notch.'
      );
    });
  }

  // Allow clicking on any Sapphire clean video element to zoom
  const cleanVideoElements = document.querySelectorAll('.clean-video-element');
  cleanVideoElements.forEach((el) => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', () => {
      const section = el.closest('.sapphire-feature-deepdive');
      const title = section ? section.querySelector('.deepdive-title')?.textContent : 'Recall Feature Demo';
      const desc = section ? section.querySelector('.deepdive-lead')?.textContent : '';
      openLightbox(el.src, title, desc);
    });
  });
}

/* ==========================================================================
   18. SLOT REEL DRUM ENGINE & 3-COLUMN APP ECOSYSTEM MATRIX
   ========================================================================== */
function initSlotDrumAndAppsMatrix() {
  const slotActionsList = [
    "transcribe live Zoom & Meet calls with zero bots",
    "search unlimited clipboard history & OCR live text",
    "stream synced karaoke music & video lyrics in notch",
    "stage and hold files across apps with temp shelf",
    "check real-time atmospheric weather & radar alerts",
    "pin glanceable floating desktop & notch widgets",
    "generate instant structured meeting bullet points",
    "copy formatted code snippets and hex colors instantly",
    "control Spotify, Apple Music & YouTube effortlessly",
    "run 100% locally on Apple Silicon Neural Engine."
  ];

  // 2 sets of items for seamless circular loop
  const drumSet = [...slotActionsList, ...slotActionsList];
  const listLen = slotActionsList.length;

  const slotStripEl = document.getElementById('slot-reel-strip');
  const spinBtn = document.getElementById('btn-spin-slot-action');

  if (slotStripEl) {
    slotStripEl.innerHTML = drumSet.map((action, i) => `
      <div class="slot-item ${(i % listLen) === 0 ? 'is-active' : (i % listLen) === 1 ? 'is-adjacent' : ''}" data-index="${i % listLen}" data-pos="${i}">
        <span class="slot-text">${action}</span>
      </div>
    `).join('');

    slotStripEl.addEventListener('click', (e) => {
      const item = e.target.closest('.slot-item');
      if (item) {
        const pos = parseInt(item.getAttribute('data-pos'), 10);
        if (!isNaN(pos)) {
          playUiSound('pop');
          stepSlotTo(pos);
        }
      }
    });
  }

  let currentSlotIdx = 0;
  let isHovered = false;

  // Only enable hover pause on desktop devices with true mouse pointer
  if (slotStripEl && window.matchMedia('(hover: hover)').matches) {
    const parent = slotStripEl.parentElement;
    if (parent) {
      parent.addEventListener('mouseenter', () => { isHovered = true; });
      parent.addEventListener('mouseleave', () => { isHovered = false; });
    }
  }

  function stepSlotTo(targetIdx) {
    if (!slotStripEl) return;
    const items = slotStripEl.querySelectorAll('.slot-item');
    if (!items.length) return;

    currentSlotIdx = targetIdx;
    const isMobile = window.innerWidth <= 860;
    const itemHeight = isMobile ? 84 : 80;
    const viewportHeight = isMobile ? 84 : 240;
    const targetY = (viewportHeight / 2) - (itemHeight / 2) - (currentSlotIdx * itemHeight);

    items.forEach((item, idx) => {
      item.classList.remove('is-active', 'is-adjacent');
      if (idx === currentSlotIdx) {
        item.classList.add('is-active');
      } else if (idx === currentSlotIdx - 1 || idx === currentSlotIdx + 1) {
        item.classList.add('is-adjacent');
      }
    });

    slotStripEl.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
    slotStripEl.style.transform = `translate3d(0, ${targetY}px, 0)`;

    // Seamless infinite reset: when we reach listLen (index 10), snap back to index 0
    if (currentSlotIdx >= listLen) {
      setTimeout(() => {
        currentSlotIdx = currentSlotIdx % listLen;
        slotStripEl.style.transition = 'none';
        const resetY = (viewportHeight / 2) - (itemHeight / 2) - (currentSlotIdx * itemHeight);
        slotStripEl.style.transform = `translate3d(0, ${resetY}px, 0)`;
        items.forEach((item, idx) => {
          item.classList.remove('is-active', 'is-adjacent');
          if (idx === currentSlotIdx) {
            item.classList.add('is-active');
          } else if (idx === currentSlotIdx - 1 || idx === currentSlotIdx + 1) {
            item.classList.add('is-adjacent');
          }
        });
      }, 500);
    }
  }

  // Automatic slot cycling strictly every 4 seconds (4000ms)
  let slotAutoTimer = setInterval(() => {
    if (!isHovered) {
      stepSlotTo(currentSlotIdx + 1);
    }
  }, 4000);

  // Initial alignment
  stepSlotTo(0);

  window.addEventListener('resize', () => {
    stepSlotTo(currentSlotIdx);
  }, { passive: true });

  // Manual Spin button
  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      playUiSound('pop');
      stepSlotTo(currentSlotIdx + 1);
    });
  }

  // --- Populate 3-Column App Ecosystem ---
  const appMatrixContainer = document.getElementById('feature-apps-showcase');
  if (appMatrixContainer) {
    const appIcons = [
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/safari.svg", name: "Safari" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/chrome.svg", name: "Google Chrome" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/firefox.svg", name: "Firefox" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/mail.png", name: "Apple Mail" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/calendar.png", name: "Apple Calendar" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/notes.svg", name: "Apple Notes" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/finder.png", name: "Finder" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/maps.svg", name: "Apple Maps" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/music.svg", name: "Apple Music" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/spotify.svg", name: "Spotify" },

      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/facetime.svg", name: "Zoom & Meet" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/messages.svg", name: "Microsoft Teams" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/slack.svg", name: "Slack" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/discord.svg", name: "Discord" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/notion.svg", name: "Notion" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/figma.svg", name: "Figma" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/xcode.svg", name: "VS Code / Cursor" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/shortcuts.png", name: "Terminal / iTerm" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/notes.svg", name: "Obsidian" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/netflix.svg", name: "YouTube & Video" },

      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/photoshop.svg", name: "Photoshop" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/illustrator.svg", name: "Illustrator" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/finalcut.png", name: "Final Cut Pro" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/logicpro.png", name: "Logic Pro" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/blender.svg", name: "Blender 3D" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/excel.svg", name: "Microsoft Excel" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/shortcuts.png", name: "macOS Shortcuts" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/voicememos.png", name: "Voice Memos" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/xcode.svg", name: "Xcode IDE" },
      { icon: "https://raw.githubusercontent.com/cshariq/Sapphire/main/Assets/app-icons/appstore.svg", name: "App Store" }
    ];

    const createCardHTML = (app) => `
      <div class="app-card-vertical" title="${app.name}">
        <div style="width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #f8fafc; border: 1px solid #e2e8f0; flex-shrink: 0; overflow: hidden;">
          <img src="${app.icon}" alt="${app.name}" style="width: 100%; height: 100%; object-fit: contain;" loading="lazy">
        </div>
        <span style="font-size: 0.88rem; font-weight: 600; color: #0f172a; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${app.name}</span>
      </div>
    `;

    const col1 = document.getElementById('app-col-1');
    const col2 = document.getElementById('app-col-2');
    const col3 = document.getElementById('app-col-3');

    if (col1 && col2 && col3) {
      // Duplicate for seamless infinite loop
      const group1 = appIcons.slice(0, 10);
      const group2 = appIcons.slice(10, 20);
      const group3 = appIcons.slice(20, 30);

      col1.innerHTML = [...group1, ...group1].map(createCardHTML).join('');
      col2.innerHTML = [...group2, ...group2].map(createCardHTML).join('');
      col3.innerHTML = [...group3, ...group3].map(createCardHTML).join('');

      // Add hover sound
      document.querySelectorAll('.app-card-vertical').forEach(card => {
        card.addEventListener('mouseenter', () => playUiSound('click'));
      });
    }
  }
}

/* ==========================================================================
   COMMUNITY FEEDBACK, ISSUE REPORT & FEATURE REQUESTS (GOOGLE APPS SCRIPT)
   ========================================================================== */

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzhIKOwUmrvbo3vBYfyMe0WxBREXWQvJeDKcCwVBQXFy3eP8qKSEeDEFlGtJlqH6xgW/exec'; // <-- PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE

function initFeedbackForm() {
  const form = document.getElementById('recall-feedback-form');
  if (!form) return;

  const typeButtons = document.querySelectorAll('.type-tab-btn');
  const typeInput = document.getElementById('feedback-type');
  const submitBtn = document.getElementById('btn-submit-feedback');
  const btnText = document.getElementById('feedback-btn-text');
  const spinner = document.getElementById('feedback-spinner');
  const statusBanner = document.getElementById('feedback-status-banner');

  // 1. Handle Feedback Type Tabs
  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const selectedType = btn.getAttribute('data-type') || 'Feature Request';
      if (typeInput) typeInput.value = selectedType;
    });
  });

  // 2. Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous status
    if (statusBanner) {
      statusBanner.className = 'feedback-status-banner hidden';
      statusBanner.textContent = '';
    }

    // Extract form data
    const feedbackType = (typeInput && typeInput.value) || 'Feature Request';
    const name = document.getElementById('feedback-name')?.value.trim() || 'Anonymous';
    const email = document.getElementById('feedback-email')?.value.trim() || '';
    const macArchitecture = document.getElementById('feedback-chip')?.value || '';
    const macosVersion = document.getElementById('feedback-os')?.value || '';
    const summary = document.getElementById('feedback-summary')?.value.trim() || '';
    const details = document.getElementById('feedback-details')?.value.trim() || '';

    // Basic Validation
    if (!email || !summary || !details) {
      showStatus('Please fill in all required fields (Email, Title/Summary, and Details).', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address so our team can follow up.', 'error');
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      type: feedbackType,
      name: name,
      email: email,
      macArchitecture: macArchitecture,
      macosVersion: macosVersion,
      summary: summary,
      details: details
    };

    // Show loading UI
    setLoadingState(true);

    try {
      if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL.trim() !== '') {
        // Send to actual Google Apps Script Web App
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Local simulation log until user pastes their Google Apps Script Web App URL
        console.log('[Recall Feedback Form] Payload ready to send to Google Sheets:', payload);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Success feedback
      showStatus(
        `✓ Thank you${name !== 'Anonymous' ? ', ' + name : ''}! Your ${feedbackType.toLowerCase()} has been received. Our team reviews all submissions weekly.`,
        'success'
      );
      form.reset();

      // Reset category tab to default
      if (typeButtons.length > 0) {
        typeButtons.forEach(b => b.classList.remove('active'));
        typeButtons[0].classList.add('active');
        if (typeInput) typeInput.value = 'Feature Request';
      }

    } catch (err) {
      console.error('[Recall Feedback Error]', err);
      showStatus('Failed to send submission. Please check your internet connection or email us directly at hello@recall.app', 'error');
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    if (isLoading) {
      if (spinner) spinner.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Submitting...';
    } else {
      if (spinner) spinner.classList.add('hidden');
      if (btnText) btnText.textContent = 'Submit Feedback';
    }
  }

  function showStatus(message, type) {
    if (!statusBanner) return;
    statusBanner.textContent = message;
    statusBanner.className = `feedback-status-banner ${type}`;
    statusBanner.classList.remove('hidden');
    statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}




