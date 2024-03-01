import axios from "axios";

export async function getEmbeddings(prompt: string) {
  const data = {
    model: "nomic-embed-text",
    prompt: prompt,
  };

  const response = await axios.post(
    "http://localhost:11434/api/embeddings",
    data,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
}
