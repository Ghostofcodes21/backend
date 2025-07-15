const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch'); // install this: npm install node-fetch

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Call Hugging Face model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: message })
      }
    );

    const data = await response.json();

    // Extract generated text
    let reply = "🤖 Sorry, no reply.";
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      reply = data[0].generated_text;
    } else if (data.generated_text) {
      reply = data.generated_text;
    }

    res.json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ reply: "⚠️ Oops! Something went wrong." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Backend running on port ${port}`));