import axios from "axios";

export async function calling(
  path: string,
  method: "GET" | "POST" = "GET",
  data?: any
) {
  try {
    const response = await axios({
      method,
      url: `http://localhost:3009/${path}`,
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    // Handle errors appropriately, e.g., return an error response
    throw error; // Or return a custom error object
  }
}

export const llmList = [
  {
    label: "Gemma:2B",
    value: "gemma:2b",
  },
  {
    label: "Llama2",
    value: "llama2",
  },
];
