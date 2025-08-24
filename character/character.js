document.querySelectorAll('.avatar-option').forEach(img => {
  img.addEventListener('click', function () {
    const mainAvatar = document.getElementById('avatar');
    if (mainAvatar) {
      mainAvatar.src = this.src;
      // Сохраняем выбранный аватар в localStorage
      localStorage.setItem('avatarSrc', this.src);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('characterName');
  if (savedName) {
    const nameElement = document.getElementById('character-name');
    if (nameElement) {
      nameElement.textContent = savedName;
    }
  }

  const savedAvatar = localStorage.getItem('avatarSrc');
  if (savedAvatar) {
    const mainAvatar = document.getElementById('avatar');
    if (mainAvatar) {
      mainAvatar.src = savedAvatar;
    }
  }
});

const wins = localStorage.getItem('wins') || 0;
    const loses = localStorage.getItem('loses') || 0;

    document.getElementById('wins').textContent = wins;
    document.getElementById('loses').textContent = loses;