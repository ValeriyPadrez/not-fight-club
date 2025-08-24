document.getElementById('createBtn').addEventListener('click', function (e) {
  const nameInput = document.getElementById('characterName').value.trim();
  const errorMsg = document.getElementById('errorMsg');

  if (!nameInput) {
    e.preventDefault();  // Отменит переход, но для ссылки лучше сделать return false
    errorMsg.textContent = 'Please enter a character name.';
    errorMsg.style.color = 'red';
    e.preventDefault();  // отменяем переход
    return;
  }

  errorMsg.textContent = '';
  localStorage.setItem('characterName', nameInput);
});
