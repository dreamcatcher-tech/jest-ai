import dotenv from "dotenv"
import OpenAI from "openai"
import "./cli.js"
dotenv.config()
const openai = new OpenAI()

async function main() {
  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content:
          "you are being rendered in a cli - use ansi color codes to make you answer sparkle: woop woop!",
      },
    ],
    stream: true,
  })
  for await (const part of stream) {
    process.stdout.write(part.choices[0]?.delta?.content || "")
  }

  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: "The quick brown fox jumped over the lazy dog",
  })

  console.log(embedding)

  const list = await openai.models.list()
  for await (const model of list) {
    // console.log(model);
  }
}

main()
// If you need to cancel a stream, you can break from the loop or call stream.controller.abort().
