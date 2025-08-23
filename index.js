document.getElementById('createBtn').addEventListener('click', function (e) {
  const nameInput = document.getElementById('characterName').value.trim();
  const errorMsg = document.getElementById('errorMsg');

  if (!nameInput) {
    e.preventDefault(); 
    errorMsg.textContent = 'Please enter a character name.';
    errorMsg.style.color = 'red';
    return;
  }

  errorMsg.textContent = '';
  localStorage.setItem('characterName', nameInput);
});
