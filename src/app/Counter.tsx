"use client";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <Button type="button" variant="outline" onClick={() => setCount(count + 1)}>
      Hi {count}
    </Button>
  );
}
