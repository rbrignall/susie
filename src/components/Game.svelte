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
	import { keyStates, wordNumber, easyMode } from "../stores";

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
    
    const vowels = "aeiou";
    const consonants = "bcdfghjklmnpqrstvwxyz";
    let numVowels=word.split("").filter(e => vowels.includes(e)).length; 

    function getUniqueLetters(str) {
        return String.prototype.concat(...new Set(str))
    }
    
    function stringPairs (w1: string, w2: string) {
        let w2arr = w2.split("");
        let intersection = "";
        let w1only = "";
        for (let i = 0; i < w1.length; i++) {
            let w2idx = w2arr.indexOf(w1[i]);
            if (w2idx === -1) // not in w2
                w1only += w1[i];
            else {
                intersection += w1[i];
                w2arr[w2idx] = "";
            }                
        }
        return [intersection, w1only, w2arr.join("")];
    }
    
    function countLetters(w: string, state: KeyState) {
        return w.split("").filter(e => $keyStates[e] === state).length;
    }
    
    function writeKeystate(w: string, checkState: KeyState, setState: KeyState) {
        game.validNormal = false;
        return w.split("").forEach(e => (($keyStates[e] !== checkState) && ($keyStates[e] = setState)));
    }
    
    function updateKeyboard() {
        let curWord = game.boardState[game.guesses];
        let curLetters = getUniqueLetters(curWord);
        let curEval = game.evaluations[game.guesses];

        // First, some basic one-time checks to the current guess
        if(curEval === 0)
            writeKeystate(curWord,"ALL","absent");
        else if(curEval === COLS) {
            writeKeystate(curWord,"ALL","present");
            writeKeystate(Object.keys($keyStates).join(""),"present","absent"); // All letters found
        }

        // Next, compare most recent guess to previous guesses
        for (var i = 0; i < game.guesses; i++) {
            let oldWord = game.boardState[i];
            let oldLetters = getUniqueLetters(oldWord);
            let oldEval = game.evaluations[i];
            
            let [comChars, uniqueToCur, uniqueToOld] = stringPairs(curWord,oldWord);
            //console.log(curWord,oldWord,comChars,uniqueToCur,uniqueToOld)

            if (uniqueToCur.length === curEval - oldEval) {
                writeKeystate(uniqueToCur,"ALL","present");
                writeKeystate(uniqueToOld.split("").filter(e => !comChars.includes(e)).join(""),"ALL","absent");
            } else if (uniqueToCur.length === oldEval - curEval) {
                writeKeystate(uniqueToOld,"ALL","present");
                writeKeystate(uniqueToCur.split("").filter(e => !comChars.includes(e)).join(""),"ALL","absent");            
            }
        }
        
        let numRedStart;
        let numGreyStart;
        
        // The next code compares to current keyboard state
        // so we iterate around and around until no changes occur        
        do {
            // Remember current keyboard state
            numRedStart = countLetters(Object.keys($keyStates).join(""),"present");
            numGreyStart = countLetters(Object.keys($keyStates).join(""),"absent");

            // Go back through all guesses.
            for (i = 0; i <= game.guesses; i++) {
        
                let guessWord = game.boardState[i];
                let guessEval = game.evaluations[i];
                let guessLetters = getUniqueLetters(guessWord);

                // See if current keyboard gives any more information
                if(countLetters(guessWord, "absent") === COLS - guessEval)
                    writeKeystate(guessLetters,"absent","present");
                if(countLetters(guessLetters, "present") === guessEval)
                    writeKeystate(guessLetters,"present","absent");
            }
        
            // Next, check vowels and consonants
            if (countLetters(vowels,"present") === numVowels)
                writeKeystate(vowels,"present","absent");
            if (countLetters(vowels,"absent") === vowels.length - 1 && numVowels > 0) 
                writeKeystate(vowels,"absent","present");
        
            if (countLetters(consonants,"present") === COLS - numVowels)
                writeKeystate(consonants,"present","absent");
            if (countLetters(consonants,"absent") === consonants.length - 1 && numVowels < COLS)
                writeKeystate(vowels,"absent","present");
                
        } while (countLetters(Object.keys($keyStates).join(""),"present") > numRedStart || countLetters(Object.keys($keyStates).join(""),"absent") > numGreyStart);

    }
    
    
	function submitWord() {
		if (game.boardState[game.guesses].length !== COLS) {
			toaster.pop("Not enough letters");
			board.shake(game.guesses);
		} else if (words.contains(game.boardState[game.guesses])) {
			const state = getState(word, game.boardState[game.guesses]);
			game.evaluations[game.guesses] = state;
            if($easyMode) updateKeyboard();

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
        if (stats.gamesPlayed === 0) {
            setTimeout(() => (showTutorial = true), delay);
        }
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
	<Tutorial visible={showTutorial} firstvisit={((stats.gamesPlayed === 0) && game.validNormal)} />
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
    <h3>Support us</h3>
    <div style="display: flex; justify-content: center; align-items: center;">
        <a href="https://www.buymeacoffee.com/benponniahc" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" class="coffee" ></a>
    </div>
</Modal>

<Modal bind:visible={showSettings}>
	<Settings visible={showSettings} wordNumber={game.wordNumber} validNormal={game.validNormal} />
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
    .coffee {
        height: 40px !important;
        width: 144px !important; 
        margin: 5px;
    }

</style>
