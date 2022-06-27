import { writable } from "svelte/store";
import { createKeyStates, getWordNumber } from "./utils";

export const keyStates = writable(createKeyStates());

export const darkTheme = writable(false);
export const noHintMode = writable(false);
export const easyMode = writable(true);
export const practiceMode = writable(false);

export const wordNumber = writable(getWordNumber(false));
export const keyBoardToggle = writable(0);