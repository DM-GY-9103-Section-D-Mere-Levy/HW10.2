const video = document.getElementById('webcam');
const canvas = document.getElementById('snapshot');
const ctx = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');

// Start webcam stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Error accessing webcam:", err);
  });

// Hugging Face API details
const MODEL_URL = "https://api-inference.huggingface.co/models/merelevy/diy-recommendation2";
const HF_TOKEN = "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";

async function sendToModel(imageBlob) {
  const response = await fetch(MODEL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "image/png"
    },
    body: imageBlob
  });

  const result = await response.json();
  console.log("Model output:", result);

  const outputDiv = document.getElementById("prediction-output");
  if (result && result.length > 0) {
    const label = result[0].label;
    const score = (result[0].score * 100).toFixed(2);
    outputDiv.innerText = `Prediction: ${label} (${score}%)`;
  } else {
    outputDiv.innerText = "No prediction returned.";
  }
}


// Capture image on button click
captureBtn.addEventListener('click', () => {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  console.log("📸 Image captured!");

  // Convert canvas to Blob and send to model
  canvas.toBlob(blob => {
    if (blob) {
      sendToModel(blob);  // Send the image to the model
    } else {
      console.error("Failed to create image blob");
    }
  }, "image/png");
});

