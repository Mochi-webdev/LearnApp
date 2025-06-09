console.log("quests.js geladen!");

const quests = [
  {
    id: 1,
    title: "Mache eine Lektion",
    description: "Schließe eine beliebige Lektion ab.",
    completed: false,
    canComplete: false,
    reward: 10 // <-- Coins als Reward
  },
  {
    id: 2,
    title: "Beantworte 5 Fragen richtig",
    description: "Beantworte insgesamt 5 Fragen korrekt.",
    completed: false,
    canComplete: false,
    reward: 20
  }
];

function getQuestKey() {
  return "questProgress_" + (window.currentUser || "default");
}

// Speichert den Quest-Status im localStorage pro User
function saveQuestProgress() {
  localStorage.setItem(getQuestKey(), JSON.stringify(quests));
}

// Lädt den Quest-Status aus dem localStorage pro User
function loadQuestProgress() {
  const saved = localStorage.getItem(getQuestKey());
  if (saved) {
    const arr = JSON.parse(saved);
    arr.forEach(savedQuest => {
      const quest = quests.find(q => q.id === savedQuest.id);
      if (quest) {
        quest.completed = savedQuest.completed;
        quest.canComplete = savedQuest.canComplete;
      }
    });
  } else {
    // Wenn kein Fortschritt: Quests zurücksetzen
    quests.forEach(q => {
      q.completed = false;
      q.canComplete = false;
    });
  }
}

function renderQuests() {
  const questList = document.getElementById("questList");
  if (!questList) return;
  questList.innerHTML = "";
  quests.forEach(q => {
    const div = document.createElement("div");
    div.className = "quest-card";
    div.style = `
      background: #f8f8ff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      margin-bottom: 18px;
      padding: 18px 16px;
      border-left: 6px solid ${q.completed ? "#4caf50" : "#2196f3"};
      opacity: ${q.completed ? 0.6 : 1};
      position: relative;
    `;
    div.innerHTML = `
      <h3 style="margin:0 0 8px 0; color:${q.completed ? "#4caf50" : "#222"}">${q.title}</h3>
      <p style="margin:0 0 14px 0; color:#555;">${q.description}</p>
      <button 
        ${q.completed ? "disabled" : ""}
        ${!q.canComplete && !q.completed ? "disabled" : ""}
        data-id="${q.id}"
        style="
          padding: 8px 18px;
          border-radius: 8px;
          border: none;
          background: ${q.completed ? "#bdbdbd" : q.canComplete ? "#4caf50" : "#bbb"};
          color: white;
          font-weight: 600;
          cursor: ${q.canComplete && !q.completed ? "pointer" : "not-allowed"};
          transition: background 0.2s;
        ">
        ${q.completed ? "Abgeschlossen" : q.canComplete ? "Abschließen" : "Nicht verfügbar"}
      </button>
      ${q.completed ? '<span style="position:absolute;top:18px;right:18px;font-size:22px;color:#4caf50;">✔️</span>' : ""}
    `;
    questList.appendChild(div);
  });

  // Button-Events
  questList.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = function() {
      const id = parseInt(btn.dataset.id);
      completeQuest(id);
    };
  });

  saveQuestProgress(); // <-- Fortschritt speichern!
}

function showQuestOverlay(title, text) {
  const overlay = document.getElementById("questOverlay");
  document.getElementById("questOverlayTitle").textContent = title;
  document.getElementById("questOverlayText").textContent = text;
  overlay.style.display = "flex";
}

function completeQuest(id) {
  const quest = quests.find(q => q.id === id);
  if (quest && !quest.completed && quest.canComplete) {
    quest.completed = true;
    // Coins gutschreiben
    if (window.currentUser && window.userDB) {
      window.userDB[window.currentUser].coins = (window.userDB[window.currentUser].coins || 0) + (quest.reward || 0);
      localStorage.setItem("userDB", JSON.stringify(window.userDB));
      if (window.updateCoinDisplay) window.updateCoinDisplay();
    }
    renderQuests();
    showQuestOverlay(
      `Quest "${quest.title}" abgeschlossen!`,
      `Du erhältst <b>${quest.reward || 0} Coins</b>.`
    );
  }
}

document.addEventListener("DOMContentLoaded", renderQuests);

// Diese Funktion aus dem Hauptcode aufrufen, wenn eine Lektion abgeschlossen wurde:
window.questLektionGemacht = function() {
  const quest = quests.find(q => q.title === "Mache eine Lektion");
  if (quest && !quest.completed) {
    quest.canComplete = true;
    renderQuests();
  }
};

// Beispiel für die zweite Quest (z.B. im Hauptcode nach jeder richtigen Antwort aufrufen):
window.questFrageRichtig = window.questFrageRichtig || function() {
  window.questFrageRichtig.count = (window.questFrageRichtig.count || 0) + 1;
  const quest = quests.find(q => q.title === "Beantworte 5 Fragen richtig");
  if (quest && !quest.completed && window.questFrageRichtig.count >= 5) {
    quest.canComplete = true;
    renderQuests();
  }
};

// Beim Laden der Seite Quest-Status laden:
loadQuestProgress();

window.quests = quests;

window.onUserChange = function() {
  // Zähler für richtige Antworten zurücksetzen!
  window.questFrageRichtig.count = 0;
  loadQuestProgress();
  renderQuests();
};
