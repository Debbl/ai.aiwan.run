import { callChatApi, generateId } from "@ai-sdk/ui-utils";
import { useEffectEvent } from "@debbl/ahooks";
import { contract } from "@workspace/server/contract";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { getApiUrl } from "~/api";
import { getImageSize } from "../../../utils";

export function useAiGhibliGenerator() {
  const [chatId] = useState(generateId);
  const [api] = useState(getApiUrl(contract.aiGhibliGenerator));
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

    const imageSize = await getImageSize(originImage);
    const response = await fetch(originImage);
    const blob = await response.blob();
    const file = new File([blob], "originImage.png", {
      type: "image/png",
    });

    const formData = new FormData();
    formData.append("image", file);
    formData.append("ratio", `${imageSize.width}:${imageSize.height}`);

    try {
      await callChatApi({
        api,
        streamProtocol: "data",
        body: {},
        credentials: undefined,
        headers: undefined,
        abortController: undefined,
        restoreMessagesOnFailure: () => {},
        onUpdate: ({ message }) => {
          let progress = 0;

          for (const line of message.content.split("\n")) {
            if (line.startsWith(">")) {
              // >🏃‍ Progress 10....22....34....45....57....68..
              const match = line.match(/Progress.*?(\d+)(?:\.+)?$/);
              if (match) {
                progress = Number(match[1]);
              }
            }

            // "![file_0000000036f4522fb60124573acbd550](https://filesystem.site/cdn/20250405/bkfKr10hti0gOMbQY4DqG40RBoQLAD.png)"
            const match = line.match(/!\[.*?\]\((https:\/\/[^)]+)\)/);
            if (match) {
              mutateProgress(100);
              setGeneratedImage(match[1]);
              return;
            }
          }

          mutateProgress(progress);
          mutateStatus("streaming");
        },
        generateId,
        onResponse: undefined,
        onFinish: undefined,
        onToolCall: undefined,
        fetch: () => {
          return fetch(api, {
            method: "POST",
            body: formData,
          });
        },
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
