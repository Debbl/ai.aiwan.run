"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { Select, SelectItem } from "@heroui/select";
import { getLocalTimeZone, now } from "@internationalized/date";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import CopyButton from "~/components/CopyButton";
import { MaterialSymbolsFemale, MaterialSymbolsMaleRounded } from "~/icons";
import type { ZonedDateTime } from "@internationalized/date";

export default function Page() {
  const [gender, setGender] = useState<0 | 1>(0);
  const [birthday, setBirthday] = useState<ZonedDateTime | null>(
    now(getLocalTimeZone()),
  );

  const { status, messages, setInput, handleSubmit } = useChat({
    api: "https://api.deepseek.com/v1/chat",
    headers: {
      "Authorization": `Bearer sk-2d1ddf1fb7eb45e7ba408e8eb743b184`,
      "Sec-Fetch-Mode": "cors",
    },
    experimental_prepareRequestBody: (options) => {
      return {
        ...options,
        messages: options.messages.slice(-1),
      };
    },
  });

  const message = useMemo(() => {
    const lastMessage = messages.at(-1);
    return lastMessage?.role === "assistant"
      ? lastMessage.content
      : "> 本站不会收集您的任何数据，所有内容直接调用 DeepSeek 的 API 接口。";
  }, [messages]);

  useEffect(() => {
    setInput(
      JSON.stringify({
        gender,
        birthday: `${birthday?.year}-${birthday?.month}-${birthday?.day} ${birthday?.hour}:${birthday?.minute.toString().padStart(2, "0")}`,
      }),
    );
  }, [birthday, gender, setInput]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="sticky top-0 flex w-full items-center justify-between border-b bg-white p-2 shadow-sm">
        <Link href="/">~</Link>
        <div>
          <a
            href="https://aiwan.run/"
            target="_blank"
            rel="noopener noreferrer"
          >
            me
          </a>
        </div>
      </div>

      <h1 className="mt-10 text-center text-2xl font-bold">DeepSeek AI 算命</h1>

      <article className="prose mx-auto max-w-[600px] flex-1 px-3 pb-24 pt-8">
        <Markdown>{message}</Markdown>
      </article>

      <div className="fixed inset-x-0 bottom-4 mx-4 flex flex-col items-center justify-center gap-2 md:bottom-8 md:flex-row">
        <div className="flex w-full items-center justify-center gap-x-2 md:w-auto">
          <Select
            aria-label="Select your gender"
            className="w-24"
            selectedKeys={[gender.toString()]}
            startContent={
              gender === 0 ? (
                <MaterialSymbolsFemale className="size-4 shrink-0" />
              ) : (
                <MaterialSymbolsMaleRounded className="size-4 shrink-0" />
              )
            }
            onChange={(e) => {
              setGender(e.target.value === "0" ? 0 : 1);
            }}
          >
            <SelectItem key={0}>女</SelectItem>
            <SelectItem key={1}>男</SelectItem>
          </Select>

          <DatePicker<ZonedDateTime>
            aria-label="Select your birthday"
            hideTimeZone
            showMonthAndYearPickers
            className="flex-1"
            defaultValue={birthday}
            variant="flat"
            maxValue={now(getLocalTimeZone()) as any}
            onChange={(e) => {
              setBirthday(e);
            }}
          />
        </div>

        <div className="flex w-full items-center justify-center gap-x-2 md:w-auto">
          <Button
            className="w-full md:w-auto"
            isDisabled={status === "streaming"}
            color="primary"
            onPress={() => handleSubmit()}
          >
            提交
          </Button>

          <CopyButton isDisabled={!message} code={message} />
        </div>
      </div>
    </div>
  );
}
