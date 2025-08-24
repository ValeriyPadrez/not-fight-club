const playerNameSpan = document.getElementById('playerName');
const playerNameInput = document.getElementById('playerNameInput');
const editBtn = document.getElementById('editBtn');

editBtn.addEventListener('click', () => {
  if (editBtn.textContent === 'Edit') {
    playerNameInput.value = playerNameSpan.textContent;
    playerNameSpan.style.display = 'none';
    playerNameInput.style.display = 'inline';
    editBtn.textContent = 'Save';
  } else {
    playerNameSpan.textContent = playerNameInput.value.trim() || 'Unnamed';
    playerNameSpan.style.display = 'inline';
    playerNameInput.style.display = 'none';
    editBtn.textContent = 'Edit';

    localStorage.setItem('playerName', playerNameSpan.textContent);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('playerName');
  if (savedName) {
    playerNameSpan.textContent = savedName;
  }
});
