import {Message} from "./types"

const messageInput: HTMLInputElement = document.getElementById('messageInput') as HTMLInputElement;
const sendButton: HTMLButtonElement = document.getElementById('sendButton') as HTMLButtonElement;
const messageList: HTMLUListElement = document.getElementById("message-list") as HTMLUListElement;

async function sendMessage() {
    const response = await fetch("http://localhost:3000/send?message=" + messageInput.value, {
        method: "GET",
    });
    console.log(response);
}

async function displayMessages() {
    try {
        const response = await fetch("http://localhost:3000/messages")
        if (!response.ok) {
            console.error("Network response was not ok")
            return
        }
        const messages: Message[] = await response.json()
        messageList.innerHTML = ""
        messages.forEach((msg: Message) => {
            const li = document.createElement("li")
            li.textContent = msg.content
            messageList.appendChild(li)
        })

    } catch (error) {
        console.error("Error fetching messages:", error)
        const li = document.createElement("li")
        li.textContent = "Error fetching messages"
        messageList.appendChild(li)
        return
    }
}

sendButton.addEventListener("click", async () => {
    await sendMessage().then(() => displayMessages())
})


displayMessages()
