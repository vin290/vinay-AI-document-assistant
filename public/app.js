async function uploadFile() {

const fileInput = document.getElementById("fileInput");
const status = document.getElementById("uploadStatus");

const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("/api/doc/upload", {
method: "POST",
body: formData
});

const data = await response.json();

status.innerText = data.message;
}

async function askQuestion() {

const question = document.getElementById("questionInput").value;

const response = await fetch("/api/ai/ask", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ question })
});

const data = await response.json();

document.getElementById("answerBox").innerText = data.answer;
}