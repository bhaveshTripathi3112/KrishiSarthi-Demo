import express from "express"
import dotenv from "dotenv"
import cookieParser  from "cookie-parser"
import  {connectDb}  from "./config/connectDB.js"
import authRouter from "./routes/auth.routes.js"
import locationRouter from "./routes/location.routes.js"
import cors from "cors"
import bodyParser from "body-parser"
import { GoogleGenAI } from "@google/genai"
dotenv.config()

const port = process.env.PORT || 5000
const app = express()

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(bodyParser.json());


app.use("/api",authRouter)
app.use("/api/locations", locationRouter);
app.get("/",(req,res) =>{
    res.send("Server is running")
})

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let History = [];

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    History.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        systemInstruction: `You are "Krishi Sahayak" – a friendly chatbot for an agriculture website.

        - Reply in the same language as the farmer’s question (English, Hindi, or Hinglish).
        - Provide simple farming guidance, website help, and crop tips.
        - Keep answers short and easy to understand.
        - Be polite, supportive, and farmer-friendly.
        `,
      }
    });

    const botReply = response.text;

    History.push({
      role: "model",
      parts: [{ text: botReply }]
    });

    res.json({ reply: botReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "⚠️ Sorry, I couldn’t process your request right now." });
  }
});


app.listen(port , () =>{
    connectDb()
    console.log(`server is running on port ${port}`)
})