// Здоровье и параметры игроков
const players = {
  player: {
    name: '22',
    maxHealth: 150,
    health: 130,
    critChance: 0.2,
    critMultiplier: 1.5,
    attackDamage: 20,
  },
  enemies: [
    {
      name: 'Snow troll',
      maxHealth: 150,
      health: 150,
      critChance: 0.15,
      critMultiplier: 1.5,
      attackDamage: 20,
      attackZonesCount: 1,
      defenseZonesCount: 3,
      img: 'https://i.imgur.com/7hR3rlb.png',
    },
    {
      name: 'Spider',
      maxHealth: 100,
      health: 100,
      critChance: 0.25,
      critMultiplier: 1.5,
      attackDamage: 15,
      attackZonesCount: 2,
      defenseZonesCount: 1,
      img: 'https://i.imgur.com/sY1W7xB.png', // Можно заменить
    }
  ],
};

// Элементы DOM
const playerNameEl = document.getElementById('player-name');
const playerHealthBar = document.getElementById('player-health-bar');
const playerHealthText = document.getElementById('player-health-text');
const playerImg = document.getElementById('player-img');

const enemyNameEl = document.getElementById('enemy-name');
const enemyHealthBar = document.getElementById('enemy-health-bar');
const enemyHealthText = document.getElementById('enemy-health-text');
const enemyImg = document.getElementById('enemy-img');

const attackBtn = document.getElementById('attack-btn');
const battleLog = document.getElementById('battle-log');

const attackZoneRadios = document.querySelectorAll('input[name="attack-zone"]');
const defenseZoneCheckboxes = document.querySelectorAll('input[name="defense-zone"]');

const attackZones = ['Head', 'Neck', 'Body', 'Belly', 'Legs'];

let currentEnemy;

// Инициализация боя
function initBattle() {
  // Выбираем случайного врага из пула
  currentEnemy = players.enemies[Math.floor(Math.random() * players.enemies.length)];

  enemyNameEl.textContent = currentEnemy.name;
  enemyImg.src = currentEnemy.img;

  updateHealthUI();
  clearSelections();
  battleLog.innerHTML = '';
  attackBtn.disabled = true;
}

function updateHealthUI() {
  playerHealthBar.style.width = (players.player.health / players.player.maxHealth) * 100 + '%';
  playerHealthText.textContent = `${players.player.health}/${players.player.maxHealth}`;

  enemyHealthBar.style.width = (currentEnemy.health / currentEnemy.maxHealth) * 100 + '%';
  enemyHealthText.textContent = `${currentEnemy.health}/${currentEnemy.maxHealth}`;
}

function clearSelections() {
  attackZoneRadios.forEach(r => (r.checked = false));
  defenseZoneCheckboxes.forEach(c => (c.checked = false));
}

// Проверка выбора пользователя - 1 атака, 2 защиты
function checkSelections() {
  const attackSelected = [...attackZoneRadios].some(r => r.checked);
  const defenseSelectedCount = [...defenseZoneCheckboxes].filter(c => c.checked).length;

  attackBtn.disabled = !(attackSelected && defenseSelectedCount === 2);
}

// Получить выбранные зоны
function getPlayerChoices() {
  const attack = [...attackZoneRadios].find(r => r.checked)?.value;
  const defenses = [...defenseZoneCheckboxes].filter(c => c.checked).map(c => c.value);
  return { attack, defenses };
}

// Генерация уникальных случайных зон для противника
function getRandomZones(count) {
  const zones = new Set();
  while (zones.size < count) {
    const randomZone = attackZones[Math.floor(Math.random() * attackZones.length)];
    zones.add(randomZone);
  }
  return Array.from(zones);
}

// Логика удара и защиты
function calculateDamage(attacker, defender, attackZone, defenderDefenses) {
  let isBlocked = defenderDefenses.includes(attackZone);
  let damage = 0;
  let isCrit = false;

  if (!isBlocked) {
    damage = attacker.attackDamage;
    // Критический удар
    if (Math.random() < attacker.critChance) {
      damage = Math.floor(damage * attacker.critMultiplier);
      isCrit = true;
    }
  } else {
    // Если блокирован, шанс критического пробития блока
    if (Math.random() < attacker.critChance) {
      damage = Math.floor(attacker.attackDamage * attacker.critMultiplier);
      isBlocked = false; // блок пробит
      isCrit = true;
    }
  }

  return { damage, isBlocked, isCrit };
}

// Добавить запись в лог
function addLog(text) {
  const li = document.createElement('li');
  li.innerHTML = text;
  battleLog.appendChild(li);
  battleLog.scrollTop = battleLog.scrollHeight;
}

// Обработчик атаки
function handleAttack() {
  const { attack: playerAttack, defenses: playerDefenses } = getPlayerChoices();

  // Выбираем случайные атаки и защиты противника
  const enemyAttackZones = getRandomZones(currentEnemy.attackZonesCount);
  const enemyDefenseZones = getRandomZones(currentEnemy.defenseZonesCount);

  // --- Игрок атакует врага ---
  const playerHit = calculateDamage(
    players.player,
    currentEnemy,
    playerAttack,
    enemyDefenseZones
  );
  currentEnemy.health = Math.max(0, currentEnemy.health - playerHit.damage);

  // --- Враг атакует игрока ---
  let totalEnemyDamage = 0;
  let enemyHitsLog = [];

  for (const zone of enemyAttackZones) {
    const hit = calculateDamage(
      currentEnemy,
      players.player,
      zone,
      playerDefenses
    );
    players.player.health = Math.max(0, players.player.health - hit.damage);
    totalEnemyDamage += hit.damage;

    // Добавляем в лог для каждого удара
    const hitText = `<strong>${currentEnemy.name}</strong> attacked <strong>${players.player.name}</strong> to <strong>${zone}</strong> and deal ${
      hit.damage === 0 ? 'no' : hit.damage
    } damage${hit.isCrit ? ' (critical hit!)' : ''}.`;
    enemyHitsLog.push(hitText);
  }

  // Лог игрока
  let playerLog = `<strong>${players.player.name}</strong> attacked <strong>${currentEnemy.name}</strong> to <strong>${playerAttack}</strong> but ${
    playerHit.isBlocked ? 'was blocked' : `dealt <strong>${playerHit.damage}</strong> damage`
  }${playerHit.isCrit ? ' (critical hit!)' : ''}.`;

  addLog(playerLog);

  // Логи врага
  enemyHitsLog.forEach(log => addLog(log));

  updateHealthUI();

  // Проверяем кто выиграл
  if (players.player.health <= 0 && currentEnemy.health <= 0) {
    addLog('<strong>Draw!</strong>');
    attackBtn.disabled = true;
  } else if (players.player.health <= 0) {
    addLog(`<strong>${currentEnemy.name} wins!</strong>`);
    attackBtn.disabled = true;
  } else if (currentEnemy.health <= 0) {
    addLog(`<strong>${players.player.name} wins!</strong>`);
    attackBtn.disabled = true;
  }

  // Сбрасываем выбор для следующего хода
  clearSelections();
  attackBtn.disabled = true;
}

// Слушатели выбора зон
attackZoneRadios.forEach(radio =>
  radio.addEventListener('change', checkSelections)
);
defenseZoneCheckboxes.forEach(checkbox =>
  checkbox.addEventListener('change', () => {
    const checked = [...defenseZoneCheckboxes].filter(c => c.checked);
    // Запрещаем выбирать больше 2 зон защиты
    if (checked.length > 2) {
      checkbox.checked = false;
    }
    checkSelections();
  })
);

attackBtn.addEventListener('click', handleAttack);

// Инициализация страницы
initBattle();
