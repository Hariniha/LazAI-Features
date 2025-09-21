import { Agent } from "alith";
import 'dotenv/config';
import readline from "readline";

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY in environment");
}

const agent = new Agent({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
  baseUrl: "https://api.groq.com/openai/v1",
});



let chatHistory = [];

async function askLazAI(prompt) {
  try {
    const response = await agent.prompt(prompt);
    return response;
  } catch (err) {
    return ` Error: ${err.message || err}`;
  }
}

async function runCLI() {
  console.log("🤖 LazAI Agent ready! (type 'exit' to quit)");
  console.log("Commands:");
  console.log("  chat <msg>        → Chat with LazAI");
  console.log("  summarize <text>  → Summarize text");
  console.log("  classify <text>   → Classify sentiment\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.setPrompt("You: ");
  rl.prompt();

  rl.on("line", async (line) => {
     if (line.toLowerCase() === "exit") {
    console.log("LazAI: 👋 Byee, see you later!");
    rl.close();
    return;
  }


    let output = "";

    if (line.startsWith("chat ")) {
      const msg = line.replace("chat ", "").trim();
      chatHistory.push({ role: "user", content: msg });
      const context = chatHistory.map(m => `${m.role}: ${m.content}`).join("\n");
      output = await askLazAI(`You are a helpful assistant. Continue this conversation:\n${context}`);
      chatHistory.push({ role: "assistant", content: output });
    } 
    else if (line.startsWith("summarize ")) {
      const text = line.replace("summarize ", "").trim();
      output = await askLazAI(`Summarize this in 2 sentences:\n${text}`);
    } 
    else if (line.startsWith("classify ")) {
      const text = line.replace("classify ", "").trim();
      output = await askLazAI(`Classify this text as Positive, Negative, or Neutral:\n${text}`);
    } 
    else {
      output = "Unknown command. Use: chat <msg>, summarize <text>, classify <text>";
    }

    console.log(`LazAI: ${output}\n`);
    rl.prompt();
  });
}

runCLI();
