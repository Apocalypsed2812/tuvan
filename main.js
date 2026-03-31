const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatContent = document.getElementById("chat-content");

// Mở / đóng chat
chatToggle.onclick = () => {
    chatBox.classList.toggle("hidden");
};

closeChat.onclick = () => {
    chatBox.classList.add("hidden");
};

// Gửi bằng nút
sendBtn.onclick = sendMessage;

// Gửi bằng Enter
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// Hàm gửi tin nhắn
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    userInput.value = "";

    // loading
    const loadingDiv = appendMessage("ai", "Đang trả lời...");

    const reply = await callGroqAPI(message);

    // xoá loading
    loadingDiv.remove();

    appendMessage("ai", reply);
}

// Hiển thị tin nhắn
function appendMessage(type, text) {
    const div = document.createElement("div");

    div.classList.add("message");
    div.classList.add(type); 

    div.textContent = text;

    chatContent.appendChild(div);
    chatContent.scrollTop = chatContent.scrollHeight;

    return div; // để xoá loading
}

// Gọi Groq API
async function callGroqAPI(prompt) {
    const API_KEY = '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'; 
    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await res.json();
        console.log("API:", data);

        if (!res.ok) {
            return data.error?.message || "API lỗi";
        }

        return data.choices?.[0]?.message?.content || "Không có phản hồi";
    } catch (error) {
        console.error(error);
        return "Lỗi khi gọi API";
    }
}
let slides = document.querySelectorAll(".slide");
let index = 0;

setInterval(() => {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 3000); // đổi ảnh mỗi 3 giây