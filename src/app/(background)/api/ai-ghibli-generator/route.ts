import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { TU_ZI_API_KEY, TU_ZI_BASE_URL } from "~/constants";
import { imageBase64 } from "./constants";

const openai = createOpenAI({
  apiKey: TU_ZI_API_KEY,
  baseURL: TU_ZI_BASE_URL,
});

export async function POST() {
  const result = streamText({
    model: openai("gpt-4o-all"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: imageBase64,
          },
          {
            type: "text",
            text: "convert this photo to studio ghibli style anime",
          },
        ],
      },
    ],
  });

  return result.toDataStreamResponse();
}
