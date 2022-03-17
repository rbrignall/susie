import { writable } from "svelte/store";
import type { GameMode } from "./enums";
import { createKeyStates, getWordNumber } from "./utils";

export const mode = writable<GameMode>();

export const keyStates = writable(createKeyStates());

export const darkTheme = writable(false);
export const colorBlindTheme = writable(false);
export const hardMode = writable(false);

export const wordNumber = writable(getWordNumber());