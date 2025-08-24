const playerNameSpan = document.getElementById('playerName');
const characterNameInput = document.getElementById('characterName');
const saveBtn = document.getElementById('saveBtn');
const msg = document.getElementById('msg');

// При загрузке страницы — показать имя из localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('characterName') || 'Unknown';
  playerNameSpan.textContent = savedName;
});

saveBtn.addEventListener('click', () => {
  if (saveBtn.textContent === 'Edit') {
    // Переключаемся в режим редактирования
    characterNameInput.style.display = 'inline-block';
    characterNameInput.value = playerNameSpan.textContent;
    playerNameSpan.style.display = 'none';
    saveBtn.textContent = 'Save';
    msg.textContent = '';
  } else {
    // Сохраняем новое имя
    const input = characterNameInput.value.trim();
    if (!input) {
      msg.textContent = 'Name cannot be empty';
      msg.style.color = 'red';
      return;
    }

    localStorage.setItem('characterName', input);
    playerNameSpan.textContent = input;

    characterNameInput.style.display = 'none';
    playerNameSpan.style.display = 'inline';
    saveBtn.textContent = 'Edit';

    msg.textContent = 'Name saved!';
    msg.style.color = 'green';
  }
});
