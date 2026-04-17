// ---------- GAME STATE ----------

let gameState = {
  health: 5,
  food: 30,
  ammo: 10,
  wagonParts: 1,
  day: 1
};

// ---------- SCENES DATA ----------

const scenes = {
  start: {
  text: "The year is 1848. Your wagon is packed and ready in Independence, Missouri. The trail west is over 2000 miles and very dangerous.",
  options: [
    {
      text: "Spend extra time gathering supplies",
      nextScene: "chooseRoute",
      effects: { food: +10, day: +1 }
    },
    {
      text: "Leave immediately to save time",
      nextScene: "chooseRoute",
      effects: { health: -1, day: +1 }
    }
  ]
},

  chooseRoute: {
    text: "You reach a fork in the trail.",
    options: [
      {
        text: "Take river route",
        nextScene: "riverCrossing",
        effects: { day: +2, food: -5 }
      },
      {
        text: "Take hill route",
        nextScene: "hillTrail",
        effects: { day: +2, health: -1 }
      }
    ]
  },

  riverCrossing: {
    text: "A fast-moving river blocks your path.",
    options: [
      {
        text: "Ford the river",
        nextScene: "plains",
        effects: { health: -2, food: -5 }
      },
      {
        text: "Build a raft",
        nextScene: "plains",
        effects: { wagonParts: -1, day: +2 }
      }
    ]
  },

  hillTrail: {
    text: "The hills are steep and rough.",
    options: [
      {
        text: "Fix the wagon",
        nextScene: "plains",
        effects: { wagonParts: -1 }
      },
      {
        text: "Push forward",
        nextScene: "plains",
        effects: { health: -1 }
      }
    ]
  },

  plains: {
    text: "You travel across open plains. You see buffalo nearby.",
    options: [
      {
        text: "Hunt for food",
        nextScene: "storm",
        effects: { food: +15, ammo: -3, day: +1 }
      },
      {
        text: "Save ammo and keep moving",
        nextScene: "storm",
        effects: { food: -5, day: +1 }
      }
    ]
  },

  storm: {
    text: "A storm hits your wagon.",
    options: [
      {
        text: "Push through the storm",
        nextScene: "finalCheck",
        effects: { health: -1, day: +1 }
      },
      {
        text: "Wait it out",
        nextScene: "finalCheck",
        effects: { food: -5, day: +2 }
      }
    ]
  },

  finalCheck: {
    text: "You near Oregon. Your condition will determine your fate.",
    options: [
      {
        text: "Finish journey",
        nextScene: "endingEvaluate",
        effects: {}
      }
    ]
  },

  endingSuccess: {
    text: "You made it to Oregon safely!",
    isEnding: true,
    options: []
  },

  endingBarely: {
    text: "You barely survived the journey.",
    isEnding: true,
    options: []
  },

  endingFailure: {
    text: "You did not survive the journey.",
    isEnding: true,
    options: []
  }
};

// ---------- DOM ELEMENTS ----------

const storyEl = document.getElementById("story");
const optionsEl = document.getElementById("options");
const statusEl = document.getElementById("status");

// ---------- RENDERING ----------

function renderStatus() {
  statusEl.innerHTML = `
    Health: ${gameState.health} | 
    Food: ${gameState.food} | 
    Ammo: ${gameState.ammo} | 
    Wagon Parts: ${gameState.wagonParts} | 
    Day: ${gameState.day}
  `;
}

function renderScene(sceneId) {
  if (sceneId === "endingEvaluate") {
    renderScene(pickEnding());
    return;
  }

  const scene = scenes[sceneId];

  storyEl.textContent = scene.text;
  optionsEl.innerHTML = "";

  if (scene.isEnding) {
    renderStatus();

    const restartBtn = document.createElement("button");
    restartBtn.className = "restart"; 
    restartBtn.textContent = "Restart Game";
    restartBtn.onclick = restartGame;

    optionsEl.appendChild(restartBtn);
    return;
  }

  scene.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "choice"; 
    button.textContent = option.text;

    button.onclick = () => {
      applyEffects(option.effects);
      renderScene(option.nextScene);
    };

    optionsEl.appendChild(button);
  });

  renderStatus();
}

// ---------- GAME LOGIC ----------

function applyEffects(effects = {}) {
  for (let key in effects) {
    gameState[key] += effects[key];
  }

  // Prevent negative values
  gameState.health = Math.max(0, gameState.health);
  gameState.food = Math.max(0, gameState.food);
  gameState.ammo = Math.max(0, gameState.ammo);
  gameState.wagonParts = Math.max(0, gameState.wagonParts);
}

function pickEnding() {
  if (gameState.health <= 0 || gameState.food <= 0) {
    return "endingFailure";
  }

  if (gameState.health >= 4 && gameState.food >= 15) {
    return "endingSuccess";
  }

  return "endingBarely";
}

function restartGame() {
  gameState = {
    health: 5,
    food: 30,
    ammo: 10,
    wagonParts: 1,
    day: 1
  };

  renderScene("start");
}

// ---------- START GAME ----------

document.addEventListener("DOMContentLoaded", () => {
  renderScene("start");
});