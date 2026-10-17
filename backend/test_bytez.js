const Bytez = require("bytez.js").default || require("bytez.js");

const key = process.env.BYTEZ_API_KEY || "";
const sdk = new Bytez(key)

const model = sdk.model("openai/gpt-4.1")

async function test() {
  const { error, output } = await model.run([
    {
      "role": "system",
      "content": "You are a precise NER system. Return only valid JSON."
    },
    {
      "role": "user",
      "content": "Extract skills from this: I know React, Node.js and SQL."
    }
  ])

  console.log("Error:", error);
  console.log("Output Type:", typeof output);
  console.log("Output Value:", JSON.stringify(output, null, 2));
}

test();
