const player = {
  name: "22",
  avatar: "https://i.imgur.com/cvltWJM.png",
  maxHP: 150,
  currentHP: 150,
  damage: 15,
  critChance: 0.15,
  critMultiplier: 1.5,
};

const enemies = [
  {
    name: "Snow troll",
    avatar: "/mnt/data/476457306-b5ef4a0b-db51-4382-98e9-3939c7351ac0.png",
    maxHP: 150,
    currentHP: 150,
    damage: 12,
    critChance: 0.1,
    critMultiplier: 1.5,
    attackZonesCount: 1,
    defenseZonesCount: 3,
    zones: ["head", "neck", "body", "belly", "legs"],
  },
  {
    name: "Spider",
    avatar: "https://i.imgur.com/FQ3bOzz.png",
    maxHP: 120,
    currentHP: 120,
    damage: 10,
    critChance: 0.2,
    critMultiplier: 1.7,
    attackZonesCount: 2,
    defenseZonesCount: 1,
    zones: ["head", "neck", "body", "belly", "legs"],
  },
];

let enemy = enemies[0];

const playerNameEl = document.getElementById("playerName");
const playerAvatarEl = document.getElementById("playerAvatar");
const playerHPBarEl = document.getElementById("playerHPBar");
const playerHPTextEl = document.getElementById("playerHPText");

const enemyNameEl = document.getElementById("enemyName");
const enemyAvatarEl = document.getElementById("enemyAvatar");
const enemyHPBarEl = document.getElementById("enemyHPBar");
const enemyHPTextEl = document.getElementById("enemyHPText");

const attackForm = document.getElementById("attackForm");
const attackBtn = document.getElementById("attackBtn");
const battleLog = document.getElementById("battleLog");

const validZones = ["head", "neck", "body", "belly", "legs"];

function init() {
  playerNameEl.textContent = player.name;
  playerAvatarEl.src = player.avatar;
  enemyNameEl.textContent = enemy.name;
  enemyAvatarEl.src = enemy.avatar;

  updateHealthBars();

  attackForm.addEventListener("change", checkFormValidity);
  attackForm.addEventListener("submit", onAttack);

  attackBtn.disabled = true;
}

function updateHealthBars() {
  const playerHPPercent = Math.max(0, (player.currentHP / player.maxHP) * 100);
  const enemyHPPercent = Math.max(0, (enemy.currentHP / enemy.maxHP) * 100);

  playerHPBarEl.style.width = playerHPPercent + "%";
  playerHPTextEl.textContent = `${player.currentHP}/${player.maxHP}`;

  enemyHPBarEl.style.width = enemyHPPercent + "%";
  enemyHPTextEl.textContent = `${enemy.currentHP}/${enemy.maxHP}`;
}

function checkFormValidity() {
  const attack = attackForm.attack.value;
  const defenses = Array.from(attackForm.defense)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  if (attack && defenses.length === 2) {
    attackBtn.disabled = false;
    attackBtn.classList.add("enabled");
  } else {
    attackBtn.disabled = true;
    attackBtn.classList.remove("enabled");
  }
}

function getRandomZones(availableZones, count) {
  const result = [];
  while (result.length < count) {
    const zone = availableZones[Math.floor(Math.random() * availableZones.length)];
    if (!result.includes(zone)) {
      result.push(zone);
    }
  }
  return result;
}

function addLog(attacker, target, zone, damage, blocked, crit) {
  const p = document.createElement("p");

  const attackerSpan = `<strong class="attacker">${attacker}</strong>`;
  const targetSpan = `<strong class="target">${target}</strong>`;
  const zoneSpan = `<strong class="zone">${zone}</strong>`;
  const damageSpan = `<strong class="damage">${damage}</strong>`;
  const blockedSpan = `<span class="blocked">blocked</span>`;
  const critSpan = `<span class="crit"> critical hit</span>`;

  if (damage === 0) {
    p.innerHTML = `${attackerSpan} attacked ${targetSpan} on the ${zoneSpan}, but ${targetSpan} ${blockedSpan}.`;
  } else {
    p.innerHTML = `${attackerSpan} attacked ${targetSpan} on the ${zoneSpan} and dealt${crit ? " a" : " "} ${critSpan} ${damageSpan} damage.`;
  }
  battleLog.appendChild(p);
  battleLog.scrollTop = battleLog.scrollHeight;
}

function onAttack(event) {
  event.preventDefault();

  const playerAttack = attackForm.attack.value;
  const playerDefenses = Array.from(attackForm.defense)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  const enemyAttack = getRandomZones(enemy.zones, enemy.attackZonesCount);
  const enemyDefenses = getRandomZones(enemy.zones, enemy.defenseZonesCount);

  let playerHitBlocked = false;
  let playerDamageDealt = 0;
  let playerCritHit = false;

  const playerCritRoll = Math.random() < player.critChance;

  if (enemyDefenses.includes(playerAttack)) {
    if (playerCritRoll) {
      playerCritHit = true;
      playerDamageDealt = Math.floor(player.damage * player.critMultiplier);
    } else {
      playerDamageDealt = 0;
      playerHitBlocked = true;
    }
  } else {
    playerDamageDealt = playerCritRoll
      ? Math.floor(player.damage * player.critMultiplier)
      : player.damage;
    playerCritHit = playerCritRoll;
  }

  enemy.currentHP -= playerDamageDealt;
  if (enemy.currentHP < 0) enemy.currentHP = 0;

  addLog(player.name, enemy.name, playerAttack, playerDamageDealt, playerHitBlocked, playerCritHit);

  enemyAttack.forEach((zone) => {
    const enemyCritRoll = Math.random() < enemy.critChance;
    let enemyHitBlocked = false;
    let enemyDamageDealt = 0;
    let enemyCritHit = false;

    if (playerDefenses.includes(zone)) {
      if (enemyCritRoll) {
        enemyCritHit = true;
        enemyDamageDealt = Math.floor(enemy.damage * enemy.critMultiplier);
      } else {
        enemyDamageDealt = 0;
        enemyHitBlocked = true;
      }
    } else {
      enemyDamageDealt = enemyCritRoll
        ? Math.floor(enemy.damage * enemy.critMultiplier)
        : enemy.damage;
      enemyCritHit = enemyCritRoll;
    }

    player.currentHP -= enemyDamageDealt;
    if (player.currentHP < 0) player.currentHP = 0;

    addLog(enemy.name, player.name, zone, enemyDamageDealt, enemyHitBlocked, enemyCritHit);
  });

  updateHealthBars();

  if (player.currentHP === 0 || enemy.currentHP === 0) {
    attackBtn.disabled = true;
    attackBtn.classList.remove("enabled");
    attackBtn.textContent = "Battle over";

    let winner = player.currentHP === 0 ? enemy.name : player.name;
    addLog("System", "", "", 0, false, false);
    const endMsg = document.createElement("p");
    endMsg.style.fontWeight = "bold";
    endMsg.style.color = "#a22";
    endMsg.textContent = `Winner: ${winner}`;
    battleLog.appendChild(endMsg);
  } else {
    attackForm.reset();
    attackBtn.disabled = true;
    attackBtn.classList.remove("enabled");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const playerName = localStorage.getItem('characterName') || 'Unknown';
  document.getElementById('playerName').textContent = playerName;
});

document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('characterName');
  const savedAvatar = localStorage.getItem('avatarSrc');

  if (savedName) {
    // Отобразить имя, если нужно
    const nameElement = document.getElementById('fightPlayerName');
    if (nameElement) {
      nameElement.textContent = savedName;
    }
  }

  if (savedAvatar) {
    const avatarElement = document.getElementById('fightAvatar');
    if (avatarElement) {
      avatarElement.src = savedAvatar;
    }
  }
});

function updateStats(result) {
  // result = 'win' или 'lose'
  let wins = +localStorage.getItem('wins') || 0;
  let loses = +localStorage.getItem('loses') || 0;

  if (result === 'win') wins++;
  if (result === 'lose') loses++;

  localStorage.setItem('wins', wins);
  localStorage.setItem('loses', loses);
}

// В момент, когда заканчивается бой, например:
function finishBattle(playerWon) {
  if (playerWon) {
    updateStats('win');
  } else {
    updateStats('lose');
  }
  // Другой код: вывод результата, обновление UI и т.п.
}

init();


