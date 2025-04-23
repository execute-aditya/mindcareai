const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const stopButton = document.createElement('button'); // Create a stop button
const logoutButton = document.getElementById('logout'); // Correctly target the logout button in the new HTML
stopButton.innerText = 'Stop Speech';
stopButton.classList.add('btn', 'stop-btn'); // Add classes for styling
stopButton.style.marginTop = '10px'; // Add some spacing
// INSERT THE LINE HERE:
const buttonGroup = chatForm.querySelector('.button-group');
if (buttonGroup) {
    buttonGroup.appendChild(stopButton); // Append to the button group
} else {
    chatForm.parentNode.insertBefore(stopButton, chatForm.nextSibling);
}
// Append a message to the chat UI
function addMessage(role, content) {
    const messageEl = document.createElement('div');
    messageEl.className = role === 'user' ? 'user-msg' : 'bot-msg';
    messageEl.innerText = content;
    chatBox.appendChild(messageEl);
    chatBox.scrollTop = chatBox.scrollHeight;
}
// Handle form submit
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;
    addMessage('user', message);
    userInput.value = '';
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await res.json();
        if (data.reply) {
            addMessage('bot', data.reply);
            speak(data.reply); // Optional TTS
        } else {
            addMessage('bot', 'Error: No response from AI.');
        }
    } catch (err) {
        console.error('Chat error:', err);
        addMessage('bot', 'Something went wrong.');
    }
});
// Optional: Text-to-speech (TTS)
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    }
}
// Function to stop the speech
function stopSpeak() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        console.log('Speech stopped.'); // Your "it says I have stopped" equivalent
    }
}
// Event listener for the stop button
stopButton.addEventListener('click', stopSpeak);
// Event listener for the logout button
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (data.success) {
                window.location.href = '/auth.html'; // Redirect to the login page
            } else {
                alert(data.message || 'Logout failed.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('An error occurred during logout.');
        }
    });
}