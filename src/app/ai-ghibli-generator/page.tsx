"use client";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import { Input } from "~/components/ui/input";
import { PajamasClear } from "~/icons";
import { useAiGhibliGenerator } from "./hooks/useAiGhibliGenerator";

export default function Page() {
  const {
    status,
    originImage,
    progress,
    generatedImage,
    setOriginImage,
    handleSubmit,
  } = useAiGhibliGenerator();

  const handleClick = async () => {
    handleSubmit();
  };

  const handleDownload = async () => {
    const response = await fetch(generatedImage);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-ghibli-generator-image.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-y-6">
      <h1 className="text-3xl font-bold">AI Ghibli Generator</h1>

      <div className="flex max-w-[60%] flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <Input
            type="file"
            accept="image/*"
            className="h-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setOriginImage(URL.createObjectURL(file));
              }
            }}
          />

          <Button
            color="primary"
            size="sm"
            onPress={handleClick}
            isDisabled={status !== "ready" || !originImage}
          >
            Generate
          </Button>
          {generatedImage && status === "ready" && (
            <Button
              color="primary"
              size="sm"
              onPress={handleDownload}
              isDisabled={status !== "ready" || !originImage}
            >
              Download
            </Button>
          )}
        </div>

        <div className="flex items-center gap-x-2 empty:hidden">
          {originImage && (
            <div className="group relative flex flex-1 items-center">
              <Button
                size="sm"
                aria-label="Clear"
                isIconOnly
                variant="flat"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100"
                onPress={() => setOriginImage("")}
              >
                {<PajamasClear className="size-4" />}
              </Button>

              <Image
                src={originImage}
                alt="origin image"
                width={100}
                height={100}
                className="size-full"
              />
            </div>
          )}
          {generatedImage && (
            <div className="relative flex flex-1 items-center">
              {status === "streaming" && (
                <Spinner
                  className="absolute inset-0 bg-white/50 text-white dark:bg-black/50"
                  label={`${progress}%`}
                />
              )}

              <Image
                src={generatedImage}
                alt="generated image"
                width={100}
                height={100}
                className="size-full"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
