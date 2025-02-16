"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useMemo, useState } from "react";
import type { Info } from "../type";

export default function Page() {
  const [info, setInfo] = useState<Info>({
    gender: 0,
    birthday: "2000-07-26 09:00",
  });

  const { messages, setInput, handleSubmit } = useChat({
    api: "/api/ai-fortune-teller",
    experimental_prepareRequestBody: (options) => {
      return {
        ...options,
        messages: options.messages.slice(-1),
      };
    },
  });

  const message = useMemo(() => {
    const lastMessage = messages.at(-1);
    return lastMessage?.role === "assistant" ? lastMessage.content : "";
  }, [messages]);

  useEffect(() => {
    setInput(JSON.stringify(info));
  }, [info, setInput]);

  return (
    <>
      {message}
      <button
        type="button"
        onClick={() => {
          setInfo((pre) => ({
            ...pre,
            gender: 1,
          }));
        }}
      >
        change gender
      </button>
      <button
        type="button"
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit
      </button>
    </>
  );
}
