import { atomWithStorage } from "jotai/utils";

export interface Info {
  gender: 0 | 1;
  birthday: string;
}

export const infoAtom = atomWithStorage<Info>("info", {
  gender: 0,
  birthday: new Date().toISOString(),
});
