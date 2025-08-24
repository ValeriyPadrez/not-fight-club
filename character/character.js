
document.querySelectorAll('.avatar-option').forEach(img => {
  img.addEventListener('click', function () {
    const mainAvatar = document.getElementById('avatar');
    if (mainAvatar) {
      mainAvatar.src = this.src;
    }
  });
});


document.getElementById('upload-avatar').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('avatar').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('playerName');
  if (savedName) {
    const nameElement = document.getElementById('character-name');
    if (nameElement) {
      nameElement.textContent = savedName;
    }
  }
});
