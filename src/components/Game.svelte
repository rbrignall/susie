<script lang="ts">
	import Header from "./Header.svelte";
	import { Board } from "./board";
	import Keyboard from "./keyboard";
	import Modal from "./Modal.svelte";
	import { onMount, setContext } from "svelte";
	import Settings from "./settings";
	import {
		Share,
		Separator,
//		Definition,
		Tutorial,
		Statistics,
		Distribution,
		Timer,
		Toaster,
	} from "./widgets";
	import {
		contractNum,
		DELAY_INCREMENT,
		PRAISE,
		getState,
		COLS,
		newSeed,
		createNewGame,
        getWordNumber,
		createKeyStates,
		words,
	} from "../utils";
	import { keyStates, wordNumber, hardMode } from "../stores";

	export let word: string;
	export let stats: Stats;
	export let game: GameState;
	export let toaster: Toaster;

	setContext("toaster", toaster);

	// implement transition delay on keys
	const delay = DELAY_INCREMENT * game.guesses + 800;

	let showTutorial = false; 
	let showSettings = false;
	let showStats = false;
	let showRefresh = false;

	let board: Board;
	let timer: Timer;
    
    
    function countLetters(w: string, state: KeyState) {
        let i = 0;
        w.split("").forEach((e,j) => (($keyStates[e] === state) && i++));
        return i;
    }
    
    
    function updateKeyboard() {
        // Split and sort the letters alphabetically:
        let allGuessedWords = game.boardState.map((w) => w.split("").sort().join(""));
        let guessWord = allGuessedWords[game.guesses]; //game.boardState[game.guesses].split("").sort();
        let guessEval = game.evaluations[game.guesses];
        switch(guessEval) {
            case 0:
                // Grey out all 5 letters
                guessWord.split("").forEach((e, i) => ($keyStates[e] = "absent"));
                game.validHard = false;
                break;
            case 5:
                // Make all 5 letters red, and grey out all others
                guessWord.split("").forEach((e, i) => ($keyStates[e] = "present"));
                Object.entries($keyStates).forEach(entry => (!(entry[1] === "present") && ($keyStates[entry[0]] = "absent")));
                game.validHard = false;
                break;
            case 1:
            case 2:
            case 3:
            case 4:
                // Mark all remaining letters red when the right number are grey
                if(countLetters(guessWord, "absent") === COLS - guessEval) 
                    guessWord.split("").forEach((e, i) => (($keyStates[e] !== "absent") && ($keyStates[e] = "present")));
                // Mark all remaining letters grey if red letters already known
                if(countLetters(guessWord, "present") === guessEval)
                    guessWord.split("").forEach((e, i) => (($keyStates[e] !== "present") && ($keyStates[e] = "absent")));
                game.validHard = false;
                break;
                // TODO!
        }
    }
    
    
	function submitWord() {
		if (game.boardState[game.guesses].length !== COLS) {
			toaster.pop("Not enough letters");
			board.shake(game.guesses);
		} else if (words.contains(game.boardState[game.guesses])) {
			const state = getState(word, game.boardState[game.guesses]);
			game.evaluations[game.guesses] = state;
            // TODO: Code this:
            if(!$hardMode) updateKeyboard();

            ++game.guesses;
			if (game.boardState[game.guesses - 1] === word) win();
            else {
                if (state === 5) setTimeout(() => toaster.pop("Nearly there: try an anagram!"), DELAY_INCREMENT);
                // Add new row
                game.evaluations.push(-1);
                game.boardState.push("");
                //document.getElementById("boardid").scrollIntoView(false);
            }
        } else {
			toaster.pop("Not in word list");
			board.shake(game.guesses);
		}
	}

	function win() {
		board.bounce(game.guesses - 1);
        game.gameStatus = "WIN";
		setTimeout(() => toaster.pop(PRAISE[Math.min(game.guesses, PRAISE.length) - 1]), DELAY_INCREMENT * game.guesses);
		setTimeout(() => (showStats = true), delay * 1.4);
        if (stats.guesses[game.guesses])
            ++stats.guesses[game.guesses];
        else
            stats.guesses[game.guesses] = 1;
        ++stats.gamesPlayed;
        if ("currentStreak" in stats) {
            stats.currentStreak =
				    game.wordNumber - stats.lastGame > 1
				        ? 1
				        : stats.currentStreak + 1;
				if (stats.currentStreak > stats.maxStreak) stats.maxStreak = stats.currentStreak;
        }
        stats.lastGame = game.wordNumber;
        localStorage.setItem(`statistics`, JSON.stringify(stats));
	}


	function reload() {
        $wordNumber = getWordNumber() % words.words.length
		game = createNewGame();
        word = words.words[$wordNumber]
        $keyStates = createKeyStates();
		showStats = false;
		showRefresh = false;
		//timer.reset($mode);
	}

	onMount(() => {
		if (!(game.gameStatus === "IN_PROGRESS")) setTimeout(() => (showStats = true), delay);
        //if (stats.gamesPlayed === 0) {
        //    setTimeout(() => (showTutorial = true), delay);
        //}
	});
	// $: toaster.pop(word);
</script>

<svelte:body on:click={board.hideCtx} on:contextmenu={board.hideCtx} />

<main class:guesses={game.guesses !== 0} style="--rows: {game.guesses}; --cols: {COLS}">
	<Header
		bind:showRefresh
		showStats={stats.gamesPlayed > 0}
		on:stats={() => (showStats = true)}
		on:tutorial={() => (showTutorial = true)}
		on:settings={() => (showSettings = true)}
		on:reload={reload}
	/>
	<Board
		bind:this={board}
		bind:value={game.boardState}
		evaluations={game.evaluations}
		guesses={game.guesses}
	/>
	<Keyboard
		on:keystroke={() => {
			board.hideCtx();
		}}
		bind:value={game.boardState[game.guesses]}
		on:submitWord={submitWord}
		on:esc={() => {
			showTutorial = false;
			showStats = false;
			showSettings = false;
		}}
		disabled={!(game.gameStatus === "IN_PROGRESS")}
	/>
</main>

<Modal
	bind:visible={showTutorial}
>
	<Tutorial visible={showTutorial} />
</Modal>



<Modal bind:visible={showStats}>
		<Statistics data={stats} />
		<Distribution distribution={stats.guesses} guesses={game.guesses} active={game.gameStatus==="IN_PROGRESS"} />
	<Separator visible={!(game.gameStatus === "IN_PROGRESS")}>
		<Timer
			slot="1"
			bind:this={timer}
			on:timeup={() => (showRefresh = true)}
			on:reload={reload}
		/>
		<Share slot="2" state={game} />
	</Separator>
</Modal>

<Modal bind:visible={showSettings}>
	<Settings visible={showSettings} wordNumber={game.wordNumber} validHard={game.validHard} />
</Modal>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		max-width: var(--game-width);
		margin: 0px auto;
		position: relative;
	}
</style>
