"use client";
import { useChat } from "@ai-sdk/react";
import { useEffectEvent, useHydrated } from "@debbl/ahooks";
import {
  Button,
  DatePicker,
  Select,
  SelectItem,
  Skeleton,
  Spinner,
} from "@heroui/react";
import { fromDate, getLocalTimeZone, today } from "@internationalized/date";
import { format } from "date-fns";
import { useAtom } from "jotai/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import CopyButton from "../../components/CopyButton";
import { MaterialSymbolsFemale, MaterialSymbolsMaleRounded } from "../../icons";
import { infoAtom } from "./atoms/info";
import type { ZonedDateTime } from "@internationalized/date";

export default function Page() {
  const [info, setInfo] = useAtom(infoAtom);
  const { gender, birthday } = useMemo(
    () => ({
      gender: info.gender,
      birthday: info.birthday,
    }),
    [info],
  );
  const setGender = useEffectEvent((gender: 0 | 1) => {
    setInfo({ ...info, gender });
  });

  const setBirthday = useEffectEvent((birthday: ZonedDateTime) => {
    setInfo({ ...info, birthday: birthday.toDate().toISOString() });
  });

  const [isShowThinking, setIsShowThinking] = useState(false);

  const { status, messages, setInput, handleSubmit } = useChat({
    api: "/api/ai-fortune-teller",
  });

  const { isHydrated } = useHydrated();

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
        birthday: format(birthday, "yyyy-MM-dd HH:mm"),
      }),
    );
  }, [birthday, gender, setInput]);

  return (
    <div className="relative flex min-h-screen flex-col items-center">
      <div className="bg-background sticky top-0 z-10 flex w-full items-center justify-between border-b p-2 shadow-xs">
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
            <div
              className={cn(
                "prose dark:prose-invert bg-background mt-2 rounded-md p-2",
              )}
            >
              <Markdown>{reasoning}</Markdown>
            </div>
          )}
        </div>
      )}

      <div className="mx-auto w-[600px] max-w-full px-3 pt-4 pb-24">
        <article className="prose dark:prose-invert">
          <Markdown>{message.content}</Markdown>
        </article>
      </div>

      <div className="fixed inset-x-0 bottom-4">
        <Skeleton
          isLoaded={isHydrated}
          classNames={{
            base: "w-fit mx-auto rounded-md",
            content:
              "flex mx-auto flex-col items-center justify-center gap-2 rounded-md md:bottom-8 md:flex-row",
          }}
        >
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

            <DatePicker
              aria-label="Select your birthday"
              hideTimeZone
              showMonthAndYearPickers
              className="flex-1"
              value={fromDate(new Date(birthday), getLocalTimeZone())}
              variant="flat"
              maxValue={today(getLocalTimeZone())}
              onChange={(e) => {
                if (e) setBirthday(e);
              }}
            />
          </div>

          <div className="flex w-full items-center justify-center gap-x-2 md:w-auto">
            <div className="bg-background flex-1">
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

            <div className="bg-background">
              <CopyButton
                isDisabled={!message || status !== "ready"}
                code={message.content}
              />
            </div>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}
