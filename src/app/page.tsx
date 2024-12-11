"use client";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useTransformers } from "use-transformers";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getImageSize } from "~/utils";
import type { FormEventHandler } from "react";

// interface Output {
//   score: number;
//   label: string;
//   box: {
//     xmin: number;
//     ymin: number;
//     xmax: number;
//     ymax: number;
//   };
// }

const randomColors = new Map<string, string>();

export default function Home() {
  const [image, setImage] = useState<{
    src: string;
    width: number;
    height: number;
  }>({
    src: "",
    width: 0,
    height: 0,
  });

  const {
    data: output,
    isLoading,
    mutate,
  } = useTransformers({
    task: "object-detection",
    model: "Xenova/detr-resnet-50",
    options: {
      dtype: "q8",
    },
  });

  const handleInputFile: FormEventHandler<HTMLInputElement> = async (e) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      const src = URL.createObjectURL(file);
      const size = await getImageSize(src);

      setImage({
        src,
        ...size,
      });
    }
  };

  const handleAnalyze = async () => {
    if (!image.src) return;

    mutate(image.src);
  };

  const renderBoxes = useMemo(() => {
    return output?.map((i: any) => {
      if (!randomColors.has(i.label)) {
        randomColors.set(
          i.label,
          `#${Math.floor(Math.random() * 16777215).toString(16)}CC`,
        );
      }

      return {
        ...i,
        color: randomColors.get(i.label),
        style: {
          top: `${(i.box.ymin / image.height) * 100}%`,
          left: `${(i.box.xmin / image.width) * 100}%`,
          width: `${((i.box.xmax - i.box.xmin) / image.width) * 100}%`,
          height: `${((i.box.ymax - i.box.ymin) / image.height) * 100}%`,
        },
      };
    });
  }, [output, image]);

  const objects = useMemo(() => {
    const map: {
      [key: string]: {
        count: number;
        color: string;
      };
    } = {};

    output?.forEach((i: any) => {
      if (map[i.label]) {
        map[i.label].count = map[i.label].count + 1;
      } else {
        map[i.label] = {
          count: 1,
          color: randomColors.get(i.label) || "",
        };
      }
    });
    return Object.entries(map).map(([label, { count, color }]) => ({
      label,
      count,
      color,
    }));
  }, [output]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="mb-2 text-center text-5xl font-bold">Object Detector</h1>
      <div className="mt-12">
        <div className="flex items-center gap-x-2">
          <Input
            id="picture"
            type="file"
            accept="image/*"
            className="items-center"
            onInput={handleInputFile}
          />

          <Button
            size="md"
            color="primary"
            disabled={isLoading || !image.src}
            onClick={handleAnalyze}
          >
            Analyze
          </Button>
        </div>

        <div className="relative mt-12 grid grid-flow-col gap-x-8">
          <div className="relative grid w-full max-w-sm justify-items-center gap-1.5">
            {image.src && (
              <div className="relative w-64">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-300/35">
                    <Spinner />
                  </div>
                )}
                <Image {...image} alt="" />
                {renderBoxes?.map((i: any, index: number) => (
                  <div
                    key={index}
                    className="absolute border"
                    style={{
                      ...i.style,
                      borderColor: i.color,
                    }}
                  >
                    <Label className="absolute" style={{ color: i.color }}>
                      {i.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
          {output?.length > 0 && (
            <div>
              {objects.map((i) => (
                <div key={i.label} className="flex items-center gap-x-2">
                  <Label style={{ color: i.color }}>{i.label}</Label>
                  <p>{i.count}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
