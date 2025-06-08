const quests = [
  { id: 1, title: "Erste Schritte", description: "Beende deine erste Lektion.", completed: false },
  { id: 2, title: "Aufsteigend", description: "Beende 3 Lektionen.", completed: false },
  { id: 3, title: "Meister", description: "Beende alle Lektionen.", completed: false }
];

const questList = document.getElementById("questList");
const questDetails = document.getElementById("questDetails");
const questTitle = document.getElementById("questTitle");
const questDescription = document.getElementById("questDescription");
const completeQuestBtn = document.getElementById("completeQuestBtn");
const backToQuestListBtn = document.getElementById("backToQuestListBtn");
const questMessage = document.getElementById("questMessage");

let selectedQuest = null;

function renderQuestList() {
  questList.innerHTML = "";
  quests.forEach(q => {
    const div = document.createElement("div");
    div.className = "lesson-card";
    div.style.cursor = "pointer";
    div.textContent = (q.completed ? "✔️ " : "") + q.title;
    div.onclick = () => showQuestDetails(q);
    questList.appendChild(div);
  });
  questDetails.style.display = "none";
  questList.style.display = "block";
  questMessage.textContent = "";
}

function showQuestDetails(quest) {
  selectedQuest = quest;
  questTitle.textContent = quest.title;
  questDescription.textContent = quest.description;

  if (quest.completed) {
    completeQuestBtn.style.display = "none";
    questMessage.style.color = "#2a8";
    questMessage.textContent = "Diese Quest wurde bereits abgeschlossen.";
  } else {
    completeQuestBtn.style.display = "block";
    questMessage.textContent = "";
  }

  questList.style.display = "none";
  questDetails.style.display = "block";
}

completeQuestBtn.addEventListener("click", () => {
  if (!selectedQuest) return;
  selectedQuest.completed = true;
  questMessage.style.color = "#2a8"; // grün
  questMessage.textContent = "Quest erfolgreich abgeschlossen!";
  completeQuestBtn.style.display = "none";

  // Optional: kurz warten und dann zurück zur Questliste
  setTimeout(() => {
    renderQuestList();
  }, 1500);
});

backToQuestListBtn.addEventListener("click", () => {
  renderQuestList();
});

// Beispiel-Definition bottomNavBar und currentUser (Anpassen an dein Projekt!)
const bottomNavBar = document.getElementById("bottomNavBar");
const currentUser = true; // Beispiel: immer angemeldet

if (bottomNavBar) {
  bottomNavBar.querySelector('[data-section="quest"]').addEventListener("click", () => {
    if (currentUser) renderQuestList();
  });
}
