import { callChatApi, generateId } from "@ai-sdk/ui-utils";
import { useEffectEvent } from "@debbl/ahooks";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { getImageSize } from "../../../utils";
import { objectURLToBase64 } from "../utils";

export function useAiGhibliGenerator() {
  const [chatId] = useState(generateId);
  const [api] = useState("/api/ai-ghibli-generator");
  const chatKey = useMemo(() => [api, chatId], [api, chatId]);

  const [originImage, setOriginImage] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");

  const { data: status = "ready", mutate: mutateStatus } = useSWR<
    "submitted" | "streaming" | "ready" | "error"
  >([chatKey, "status"], null);

  const { data: progress = 0, mutate: mutateProgress } = useSWR<number>(
    [chatKey, "progress"],
    null,
  );

  const handleSubmit = useEffectEvent(async () => {
    if (!originImage) return;

    mutateStatus("submitted");
    setGeneratedImage(originImage);

    const image = await objectURLToBase64(originImage);
    const imageSize = await getImageSize(originImage);

    try {
      await callChatApi({
        api,
        streamProtocol: "data",
        body: {
          image,
          ratio: `${imageSize.width}:${imageSize.height}`,
        },
        credentials: undefined,
        headers: undefined,
        abortController: undefined,
        restoreMessagesOnFailure: () => {},
        onUpdate: ({ message }) => {
          let progress = 0;

          for (const line of message.content.split("\n")) {
            if (line.startsWith(">")) {
              // > 进度 **67%**
              const match = line.match(/\*\*(\d+)%\*\*/);
              if (match) {
                progress = Number(match[1]);
              }
            }
            // "![file_0000000036f4522fb60124573acbd550](https://filesystem.site/cdn/20250405/bkfKr10hti0gOMbQY4DqG40RBoQLAD.png)"
            if (line.startsWith("![")) {
              const match = line.match(/!\[.*?\]\((https:\/\/[^)]+)\)/);
              if (match) {
                mutateProgress(100);
                setGeneratedImage(match[1]);
                return;
              }
            }
          }

          mutateProgress(progress);
          mutateStatus("streaming");
        },
        generateId,
        onResponse: undefined,
        onFinish: undefined,
        onToolCall: undefined,
        fetch: undefined,
        lastMessage: undefined,
      });

      mutateStatus("ready");
    } catch {
      setGeneratedImage("");
      mutateStatus("error");
    }
  });

  return {
    progress,

    originImage,
    setOriginImage,
    generatedImage,
    setGeneratedImage,

    status,
    handleSubmit,
  };
}
