<script lang="ts">
	import {
		createDefaultStats,
		createNewGame,
		createKeyStates,
		getWordNumber,
		words,
	} from "./utils";
	import Game from "./components/Game.svelte";
	import { keyStates, easyMode, noHintMode,
            darkTheme, wordNumber
    } from "./stores";
	import { Toaster } from "./components/widgets";
	import { onMount, setContext } from "svelte";


	let stats: Stats;
	let word: string;
	let state: GameState;


    // Settings separated out:
    darkTheme.set(JSON.parse(localStorage.getItem("darkTheme")) as boolean || false);    
    easyMode.set(JSON.parse(localStorage.getItem("easyMode") ?? true) as boolean);
    noHintMode.set(JSON.parse(localStorage.getItem("noHintMode")) as boolean || false);    
    // N.B. wordNumber stores the index of the word!
    wordNumber.set(getWordNumber() % words.words.length);
    
    darkTheme.subscribe(s => localStorage.setItem("darkTheme",s));
    easyMode.subscribe(s => localStorage.setItem("easyMode",s));
    noHintMode.subscribe(s => localStorage.setItem("noHintMode",s));

	wordNumber.subscribe(() => {        
        // Grab statistics. CreateDefaultStats looks for URL data
		stats = (JSON.parse(localStorage.getItem("statistics")) as Stats) || createDefaultStats();

        word = words.words[$wordNumber];
		let temp: GameState;
        temp = JSON.parse(localStorage.getItem("gameState"));
        if (!temp || temp.wordNumber < getWordNumber()) {
            state = createNewGame();
            if($noHintMode) state.showHint = false;
        } else {
            // TODO: Add checks for missing items in temp (e.g. evaluation being null)
            if(!(temp.explainer))
                temp.explainer = [];
            state = temp;
		}
		// Set the letter states when data for a new game mode is loaded so the keyboard is correct
//		const letters = state.keyStates;
//		for (let row = 0; row < state.guesses; ++row) {
//			for (let col = 0; col < state.boardState[row].length; ++col) {
//				letters[state.boardState[row][col]] = state.evaluations[row];
//			}
//		}
		keyStates.set(state.keyStates);
        keyStates.subscribe(s => state.keyStates = s);
        noHintMode.subscribe(s => {if(!s) state.showHint = true});
	});

	$: saveState(state);
	function saveState(state: GameState) {
        localStorage.setItem("gameState", JSON.stringify(state));
	}
	let toaster: Toaster;
</script>

<Toaster bind:this={toaster} />
{#if toaster}
	<Game {stats} {word} {toaster} bind:game={state} />
{/if}