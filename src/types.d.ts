/** A list of words of the same length */
type Words = WordData & {
	contains: (word: string) => boolean;
};

type WordData = {
	/** A list of possible words to guess */
	words: string[];
	/** A list of words that are valid when input by the user but will never get chosen as the word to guess */
    valid: string [];
};

type RowData = {
	length: number;
	guess: number;
};

type WordState = -1 | 0 | 1 | 2 | 3 | 4 | 5;

type KeyState = "nil" | "absent" | "present";

type GameState = {
    gameStatus: "IN_PROGRESS" | "WIN" | "FAIL",
	guesses: number,
	wordNumber: number,
	validHard: boolean,
    boardState: string[],
    evaluations: WordState[],
    keyStates: { [key: string]: KeyState },
};




type SettingType = "switch";


type Stats = {
	gamesPlayed: number;
	currentStreak?: number;
	maxStreak?: number;
	lastGame: number;
	guesses: number[];
};


type HardModeData = {
	pos: number,
	char: string,
	type: "correct" | "present" | "absent",
};