import { createOpenAI } from "@ai-sdk/openai";
import { TU_ZI_API_KEY, TU_ZI_BASE_URL } from "@workspace/env";
import { streamText } from "ai";

const openai = createOpenAI({
  apiKey: TU_ZI_API_KEY,
  baseURL: TU_ZI_BASE_URL,
});

export async function POST(req: Request) {
  const body = (await req.json()) as {
    image: string;
    ratio: string;
  };

  const image = body.image;
  const ratio = body.ratio;
  if (!image || !ratio)
    return new Response("No image or ratio provided", { status: 400 });

  const result = streamText({
    model: openai("gpt-4o-image-vip"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image,
          },
          {
            type: "text",
            text: `convert this photo to studio ghibli style anime, ratio is ${ratio}`,
          },
        ],
      },
    ],
  });

  return result.toDataStreamResponse();
}
