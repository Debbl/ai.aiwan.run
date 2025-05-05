import { deepseek } from "@ai-sdk/deepseek";
import { createOpenAI } from "@ai-sdk/openai";
import { tsr } from "@ts-rest/serverless/next";
import { TU_ZI_API_KEY, TU_ZI_BASE_URL } from "@workspace/env";
import { streamText } from "ai";
import { contract } from "~/contract";
import { insertImageGeneration } from "~/db";

const openai = createOpenAI({
  apiKey: TU_ZI_API_KEY,
  baseURL: TU_ZI_BASE_URL,
});

export const router = tsr.router(contract, {
  aiFortuneTeller: async ({ body }, { responseHeaders }) => {
    const { messages } = body;

    const message = messages.at(-1);

    const { gender, birthday } = JSON.parse(message.content);

    const genderText = gender === 0 ? "女性" : "男性";

    const content = `我是${genderText}，我的公历出生日期是${birthday}。请用盲派技巧逐步分析八字，请分析我的一生运势，以及体貌特征，时间节点，事件，涵盖各方面，尽可能详细具体。着重分析大运能赚多少钱，包括学业和婚姻，判断出准确的关系模型后输出最终结果，诚实一点评价，用语不用太温和。`;
    const result = streamText({
      model: deepseek("deepseek-reasoner"),
      messages: [
        {
          role: "user",
          content,
          parts: [
            {
              type: "text",
              text: content,
            },
          ],
        },
      ],
    });

    const response = result.toDataStreamResponse({
      sendReasoning: true,
    });

    for (const [key, value] of response.headers) {
      responseHeaders.set(key, value);
    }

    return response as any;
  },
  aiGhibliGenerator: async ({ body }, { responseHeaders }) => {
    const { image, ratio } = body;

    const prompt = `convert this photo to studio ghibli style anime, ratio is ${ratio}`;
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
              text: prompt,
            },
          ],
        },
      ],
    });

    await insertImageGeneration(prompt, image, "", "pending");

    const response = result.toDataStreamResponse();

    for (const [key, value] of response.headers) {
      responseHeaders.set(key, value);
    }
    return response as any;
  },
});
