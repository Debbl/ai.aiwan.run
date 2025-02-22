"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { getLocalTimeZone, now } from "@internationalized/date";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import CopyButton from "~/components/CopyButton";
import { MaterialSymbolsFemale, MaterialSymbolsMaleRounded } from "~/icons";
import { cn } from "~/lib/utils";
import type { ZonedDateTime } from "@internationalized/date";

export default function Page() {
  const [gender, setGender] = useState<0 | 1>(0);
  const [birthday, setBirthday] = useState<ZonedDateTime | null>(
    now(getLocalTimeZone()),
  );

  const [isShowThinking, setIsShowThinking] = useState(false);

  const { status, messages, setInput, handleSubmit } = useChat({
    api: "/api/ai-fortune-teller",
  });

  const message = useMemo(() => {
    const lastMessage = messages.at(-1);
    return lastMessage?.role === "assistant"
      ? lastMessage
      : {
          content:
            "> 本站不会收集您的任何数据，所有内容直接调用 DeepSeek 的 API 接口获取。",
        };
  }, [messages]);

  const reasoning = useMemo(() => {
    return "parts" in message
      ? message.parts.find((i) => i.type === "reasoning")?.reasoning
      : null;
  }, [message]);

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
      <div className="sticky top-0 z-10 flex w-full items-center justify-between border-b bg-white p-2 shadow-sm">
        <Link href="/">~</Link>
        <div className="flex items-center gap-2">
          <a
            href="https://status.deepseek.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            status
          </a>
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

      {reasoning && (
        <div className="mx-auto w-[600px] max-w-full px-3 pt-8">
          <Button
            size="sm"
            startContent={!message.content ? <Spinner size="sm" /> : null}
            onPress={() => setIsShowThinking(!isShowThinking)}
          >
            Thinking
          </Button>
          {isShowThinking && (
            <div className={cn("prose bg-gray-100 rounded-md p-2 mt-2")}>
              <Markdown>{reasoning}</Markdown>
            </div>
          )}
        </div>
      )}

      <div className="mx-auto w-[600px] max-w-full px-3 pb-24 pt-4">
        <article className="prose">
          <Markdown>{message.content}</Markdown>
        </article>
      </div>

      <div className="fixed inset-x-0 bottom-4 mx-auto flex w-fit flex-col items-center justify-center gap-2 md:bottom-8 md:flex-row">
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
          <div className="flex-1 bg-white">
            <Button
              isLoading={status === "submitted"}
              className="w-full md:w-auto"
              isDisabled={status !== "ready"}
              color="primary"
              onPress={() => handleSubmit()}
            >
              提交
            </Button>
          </div>

          <div className="bg-white">
            <CopyButton
              isDisabled={!message || status !== "ready"}
              code={message.content}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
