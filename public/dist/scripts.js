const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messageList = document.getElementById("message-list");
async function sendMessage() {
    // ✅ Corrected URL (removed extra colon)
    const response = await fetch("http://localhost:3000/send?message=" + messageInput.value, {
        method: "GET",
    });
    console.log(response);
}
// function appendListItem() {
//     const li = document.createElement("li")
//     li.textContent = messageInput.value
//     messageList.appendChild(li)
// }
async function displayMessages() {
    try {
        const response = await fetch("http://localhost:3000/messages");
        if (!response.ok) {
            console.error("Network response was not ok");
            return;
        }
        const messages = await response.json();
        messageList.innerHTML = "";
        messages.forEach((msg) => {
            const li = document.createElement("li");
            li.textContent = msg.content;
            messageList.appendChild(li);
        });
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        const li = document.createElement("li");
        li.textContent = "Error fetching messages";
        messageList.appendChild(li);
        return;
    }
}
sendButton.addEventListener("click", async () => {
    await sendMessage().then(() => displayMessages());
});
displayMessages();
export {};
//# sourceMappingURL=scripts.js.map