import { deepseek } from "@ai-sdk/deepseek";
import { streamText } from "ai";
import type { Info } from "../../../type";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const message = messages.at(-1);

  const { gender, birthday } = JSON.parse(message.content) as Info;

  const genderText = gender === 0 ? "女性" : "男性";

  const content = `我是${genderText}，我的公历出生日期是${birthday}。请用盲派技巧逐步分析八字，请分析我的一生运势，以及体貌特征，时间节点，事件，涵盖各方面，尽可能详细具体。着重分析大运能赚多少钱，包括学业和婚姻，判断出准确的关系模型后输出最终结果，诚实一点评价，用语不用太温和。`;
  const result = streamText({
    model: deepseek("deepseek-reasoner"),
    messages: [
      {
        ...message,
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

  return result.toDataStreamResponse({
    sendReasoning: true,
  });
}
