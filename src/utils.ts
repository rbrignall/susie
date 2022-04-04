import seedrandom from "seedrandom";
import wordList from "./words_5";

//export const ROWS = 6;

export const COLS = 5;

export const words = {
	...wordList,
	contains: (word: string) => {
		return wordList.words.includes(word) || wordList.valid.includes(word);
	},
};


export function getState(word: string, guess: string): number {
	const charArr = word.split("");
    let numRight = 0;

	for (let i = 0; i < word.length; ++i) {
		if (charArr.includes(guess.charAt(i))) {
            ++numRight;
			charArr[charArr.indexOf(guess.charAt(i))] = "$";
		}
	}
    
	return numRight; //result.map((e, i) => charArr.includes(guess[i]) && e !== "correct" ? "present" : e);
}

export function contractNum(n: number) {
	switch (n % 10) {
		case 1: return `${n}st`;
		case 2: return `${n}nd`;
		case 3: return `${n}rd`;
		default: return `${n}th`;
	}
}

export const keys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];


export function newSeed() {
	const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate()).valueOf();
}

export function getWordNumber() {
    const numbleOneDate = new Date(2022,0,12,0,0,0,0).setHours(0,0,0,0)
    const now = new Date().setHours(0,0,0,0)
    const msInDay = 86400000
    return Math.floor((now - numbleOneDate) / msInDay) //% WORDS.length
}



export const DELAY_INCREMENT = 150;

export const PRAISE = [
        "Wow! First guess!",
        "Amazing!",
        "Brilliant!",
        "Excellent!",
        "Very good!",
        "Great!",
        "Good work",
        "Nice job",
        "Found it!",
        "Phew!"
];

export function createNewGame(): GameState {
	return {
        gameStatus: "IN_PROGRESS",
		guesses: 0,
		wordNumber: getWordNumber(),
		validNormal: true,
        boardState: [""],//Array(ROWS).fill(""),
        evaluations: [-1],//Array.from({ length: ROWS }, () => (-1)),
        keyStates: createKeyStates(),
	};
}


export function createDefaultStats(): Stats {

    const urlStats = new URLSearchParams(window.location.search);
	const stats = {
		gamesPlayed: 0,
		lastGame: 0,
		guesses: [0],
		currentStreak: 0,
		maxStreak: 0,
	};
	return stats;
};

export function createKeyStates(): { [key: string]: KeyState; } {
	return {
		a: "nil",
		b: "nil",
		c: "nil",
		d: "nil",
		e: "nil",
		f: "nil",
		g: "nil",
		h: "nil",
		i: "nil",
		j: "nil",
		k: "nil",
		l: "nil",
		m: "nil",
		n: "nil",
		o: "nil",
		p: "nil",
		q: "nil",
		r: "nil",
		s: "nil",
		t: "nil",
		u: "nil",
		v: "nil",
		w: "nil",
		x: "nil",
		y: "nil",
		z: "nil",
	};
}
