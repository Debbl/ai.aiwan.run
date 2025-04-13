import { motion, useAnimation } from "motion/react";
import type { Transition, Variants } from "motion/react";
import type { SVGProps } from "react";
import type { ClassName } from "~/app/type";

export { MoonIcon } from "./MoonIcon";
export { SettingsGearIcon } from "./SettingsGearIcon";
export { SunIcon } from "./SunIcon";

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 160,
  damping: 17,
  mass: 1,
};

export function CopyIcon({ className }: ClassName) {
  const controls = useAnimation();

  return (
    <svg
      className={className}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.rect
        width="14"
        height="14"
        x="8"
        y="8"
        rx="2"
        ry="2"
        variants={{
          normal: { translateY: 0, translateX: 0 },
          animate: { translateY: -3, translateX: -3 },
        }}
        animate={controls}
        transition={defaultTransition}
      />
      <motion.path
        d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
        variants={{
          normal: { x: 0, y: 0 },
          animate: { x: 3, y: 3 },
        }}
        transition={defaultTransition}
        animate={controls}
      />
    </svg>
  );
}

const pathVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    scale: [0.5, 1],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
};

export function CheckIcon({ className }: ClassName) {
  const controls = useAnimation();

  return (
    <svg
      className={className}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        variants={pathVariants}
        initial="normal"
        animate={controls}
        d="M4 12 9 17L20 6"
      />
    </svg>
  );
}

export function MaterialSymbolsMaleRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M20 5v4q0 .425-.288.713T19 10t-.712-.288T18 9V7.425l-3.975 3.95q.475.7.725 1.488T15 14.5q0 2.3-1.6 3.9T9.5 20t-3.9-1.6T4 14.5t1.6-3.9T9.5 9q.825 0 1.625.237t1.475.738L16.575 6H15q-.425 0-.712-.288T14 5t.288-.712T15 4h4q.425 0 .713.288T20 5M9.5 11q-1.45 0-2.475 1.025T6 14.5t1.025 2.475T9.5 18t2.475-1.025T13 14.5t-1.025-2.475T9.5 11"
      ></path>
    </svg>
  );
}

export function MaterialSymbolsFemale(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11 21v-2H9v-2h2v-2.1q-1.975-.35-3.238-1.888T6.5 9.45q0-2.275 1.613-3.862T12 4t3.888 1.588T17.5 9.45q0 2.025-1.263 3.563T13 14.9V17h2v2h-2v2zm1-8q1.45 0 2.475-1.025T15.5 9.5t-1.025-2.475T12 6T9.525 7.025T8.5 9.5t1.025 2.475T12 13"
      ></path>
    </svg>
  );
}

export function PajamasClear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8L4.22 5.28a.75.75 0 0 1 0-1.06"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
