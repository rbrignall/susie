<script lang="ts">
	import Header from "./Header.svelte";
	import { Board } from "./board";
	import Keyboard from "./keyboard";
	import Modal from "./Modal.svelte";
	import { onMount, setContext } from "svelte";
	import Settings from "./settings";
	import {
        Explainer,
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
        setCVC,
		words,
        vowels,
        consonants
	} from "../utils";
	import { keyStates, wordNumber, easyMode, noHintMode, practiceMode } from "../stores";

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
    let showExplainer = false;

	let board: Board;
	let timer: Timer;
    let CVCpattern: string[];
    
    function numVowels() {
        return word.split("").filter(e => vowels.includes(e)).length; 
    }


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
        let changed = "";
        w.split("").forEach(e => {
            if(!([checkState,setState].includes($keyStates[e]))) {
                $keyStates[e] = setState;
                changed += e;
            }
        })

        return changed;
    }
    
    function logExplainer(changes: string, reason: string) {
        changes.split('').forEach(e => (game.explainer.push([e, reason])));
    }
    
    function updateKeyboard() {
        let curWord = game.boardState[game.guesses];
        let curLetters = getUniqueLetters(curWord);
        let curEval = game.evaluations[game.guesses];
        let changed = [];

        // First, some basic one-time checks to the current guess
        if(curEval === 0) {
            changed = writeKeystate(curWord,"ALL","absent");
            logExplainer(changed, curWord.toUpperCase() + " scored 0.");
        }
        else if(curEval === COLS) {
            changed = writeKeystate(curWord,"ALL","present");
            logExplainer(changed, curWord.toUpperCase() + " scored " + COLS + ".");            
            changed = writeKeystate(Object.keys($keyStates).join(""),"present","absent");
            logExplainer(changed, "All " + COLS + " letters found.");
        }

        // Next, compare most recent guess to previous guesses
        for (var i = 0; i < game.guesses; i++) {
            let oldWord = game.boardState[i];
            let oldLetters = getUniqueLetters(oldWord);
            let oldEval = game.evaluations[i];
            
            let [comChars, uniqueToCur, uniqueToOld] = stringPairs(curWord,oldWord);

            if (uniqueToCur.length === curEval - oldEval) {
                changed = writeKeystate(uniqueToCur,"ALL","present");
                changed += writeKeystate(uniqueToOld.split("").filter(e => !comChars.includes(e)).join(""),"ALL","absent");
                logExplainer(changed, "Compared " + curWord.toUpperCase() + " (" + curEval + ") with " + oldWord.toUpperCase() + " (" + oldEval + ").");            
            } else if (uniqueToCur.length === oldEval - curEval) {
                changed = writeKeystate(uniqueToOld,"ALL","present");
                changed += writeKeystate(uniqueToCur.split("").filter(e => !comChars.includes(e)).join(""),"ALL","absent");            
                logExplainer(changed, "Compared " + curWord.toUpperCase() + " (" + curEval + ") with " + oldWord.toUpperCase() + " (" + oldEval + ").");            
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
                if(countLetters(guessWord, "absent") === COLS - guessEval) {
                    changed = writeKeystate(guessLetters,"absent","present");
                    logExplainer(changed, guessWord.toUpperCase() + " (" + guessEval + "): Know which " + (COLS - guessEval === 1 ? "1 letter is" : (COLS - guessEval) + " letters are") + " not in the word.");     
                }
                if(countLetters(guessLetters, "present") === guessEval) {
                    changed = writeKeystate(guessLetters,"present","absent");
                    logExplainer(changed, guessWord.toUpperCase() + " (" + guessEval + "): Know which " + (guessEval === 1 ? "1 letter is" : guessEval + " letters are") + " in the word.");
                }
                
                // Compare with earlier guesses
                for (let j = 0; j < i; j++) {
                    let oldWord = game.boardState[j];
                    let oldLetters = getUniqueLetters(oldWord);
                    let oldEval = game.evaluations[j]; 
                    
                    //e.g. ANGER, ANGLE. (Diff L/R). If score(ANGER) >= score(ANGLE): L IN the word => R is IN. R not in => L not in.
                    //e.g. FROCK, KNOCK (Diff FR/KN). If score(FROCK) >= score(KNOCK): FR not in =/=> KN not in.
                    // (N is not in, but K might be in once (but not twice))
                    // e.g. ROPER, LOPER (Diff R/L). If Score(LOPER) >= score(ROPER): R IN the word =/=> L is in.
                    // Also: MATEY, MERRY (Diff AT/RR). If score(MATEY) >= score(MERRY): R In the word =/=> AT in (R should only count for one)
                    // ROVER, LOPER: Score(LOPER) >= score(ROVER): 
                    let [comChars, uniqueToGuess, uniqueToOld] = stringPairs(guessWord,oldWord);
                    
                    if (oldEval >= guessEval){ 
                        if(uniqueToGuess.length === getUniqueLetters(uniqueToGuess).split("").filter(e => !comChars.includes(e)).length && uniqueToGuess.split('').every((e) => ($keyStates[e] === "present"))) {
                            changed = writeKeystate(uniqueToOld,"absent","present");
                            logExplainer(changed, "Compared " + oldWord.toUpperCase() + " (" + oldEval + ") with " + guessWord.toUpperCase() + " (" + guessEval + ") given " + uniqueToGuess.toUpperCase().split('').join(', ') + " " + (uniqueToGuess.length > 1 ? "are" : "is") + " in the word.");
                        }
                        if(uniqueToOld.split('').every((e) => ($keyStates[e] === "absent"))) {
                            changed = writeKeystate(uniqueToGuess.split("").filter(e => !comChars.includes(e)).join(""),"present","absent");
                            logExplainer(changed, "Compared " + oldWord.toUpperCase() + " (" + oldEval + ") with " + guessWord.toUpperCase() + " (" + guessEval + ") given " + uniqueToOld.toUpperCase().split('').join(', ') + " " + (uniqueToOld.length > 1 ? "are" : "is") + " not in the word.");                        
                        }
                    }
                    if (guessEval >= oldEval){ 
                        if(uniqueToOld.length === getUniqueLetters(uniqueToOld).split("").filter(e => !comChars.includes(e)).length && uniqueToOld.split('').every((e) => ($keyStates[e] === "present"))) {
                            changed = writeKeystate(uniqueToGuess,"absent","present");
                            logExplainer(changed, "Compared " + oldWord.toUpperCase() + " (" + oldEval + ") with " + guessWord.toUpperCase() + " (" + guessEval + ") given " + uniqueToOld.toUpperCase().split('').join(', ') + " " + (uniqueToOld.length > 1 ? "are" : "is") + " in the word.");
                        }
                        if(uniqueToGuess.split('').every((e) => ($keyStates[e] === "absent"))) {
                            changed = writeKeystate(uniqueToOld.split("").filter(e => !comChars.includes(e)).join(""),"present","absent");
                            logExplainer(changed, "Compared " + oldWord.toUpperCase() + " (" + oldEval + ") with " + guessWord.toUpperCase() + " (" + guessEval + ") given " + uniqueToGuess.toUpperCase().split('').join(', ') + " " + (uniqueToGuess.length > 1 ? "are" : "is") + " not in the word.");                        
                        }
                    }
                }
            }
        
            // Next, check vowels and consonants
            if (countLetters(vowels,"present") === numVowels()) {
                changed = writeKeystate(vowels,"present","absent");
                logExplainer(changed, "Found " + numVowels() + " vowels in word: all others absent.");            
            }
            if (countLetters(vowels,"absent") === vowels.length - 1 && numVowels() > 0) {
                changed = writeKeystate(vowels,"absent","present");
                logExplainer(changed, "Found " + (vowels.length - 1) + " vowels not in word, so " + changed.toUpperCase() + " is present.");
            }
        
            if (countLetters(consonants,"present") === COLS - numVowels()) {
                changed = writeKeystate(consonants,"present","absent");
                logExplainer(changed, "Found " + (COLS - numVowels()) + " consonants in word: all others absent.");            
            }
            if (countLetters(consonants,"absent") === consonants.length - 1 && numVowels() < COLS) {
                changed = writeKeystate(vowels,"absent","present");
                logExplainer(changed, "Found " + (consonants.length - 1) + " consonants not in word, so " + changed.toUpperCase() + " is present.");
            }
                
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
            else if ((state === 5) && (setCVC(game.boardState[game.guesses - 1]).join("") === setCVC(word).join("")))
                win(0);
            else {
                if (state === 5) {
                    setTimeout(() => toaster.pop("Nearly there: try an anagram!"), DELAY_INCREMENT);
                }
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

	function win(precise = 1) {
		board.bounce(game.guesses - 1);
        game.gameStatus = "WIN";
        if(precise)
            setTimeout(() => toaster.pop(PRAISE[Math.min(game.guesses, PRAISE.length) - 1]), DELAY_INCREMENT);
        else
            setTimeout(() => toaster.pop("Susie's word was " + word.toUpperCase() + ", but it fits the pattern, so you win!"), DELAY_INCREMENT);

        if ($practiceMode) {
            // Do something
        } else {
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
	}

	function lose() {
        game.gameStatus = "FAIL";
        setTimeout(() => toaster.pop(word.toUpperCase()), DELAY_INCREMENT);
        if ($practiceMode) {
            // Do something
        } else {
            setTimeout(() => (showStats = true), delay);
            ++stats.gamesPlayed;
            if ("currentStreak" in stats) stats.currentStreak = 0;
            stats.lastGameNumber = game.wordNumber;
            localStorage.setItem(`statistics`, JSON.stringify(stats));
        }
	}

	function reload() {
        $wordNumber = getWordNumber($practiceMode) % words.words.length
		game = createNewGame($practiceMode);
        if($noHintMode) state.showHint = false;
        word = words.words[$wordNumber]
        $keyStates = createKeyStates();
		showStats = false;
		showRefresh = false;
        CVCpattern = setCVC(word);
		//timer.reset($mode);
	}


	onMount(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({}); // Google ads
        (window.adsbygoogle = window.adsbygoogle || []).push({}); // Google ads
        (window.adsbygoogle = window.adsbygoogle || []).push({}); // Google ads
		if (!(game.gameStatus === "IN_PROGRESS") && !$practiceMode) setTimeout(() => (showStats = true), delay);
        if (stats.gamesPlayed === 0) {
            setTimeout(() => (showTutorial = true), delay);
        }
	});
	// $: toaster.pop(word);
    
    //CVCpattern = setCVC(word);
    wordNumber.subscribe(() => { 
        CVCpattern = setCVC(words.words[$wordNumber])
    })

</script>

<svelte:body on:click={board.hideCtx} on:contextmenu={board.hideCtx} />

    <div class="leftadwrapper">
        <ins class="adsbygoogle sidead"
            style="display:block"
            data-ad-client="ca-pub-3184778483057051"
            data-ad-slot="4305667393"></ins>
    </div>
    <div class="rightadwrapper">
        <ins class="adsbygoogle sidead"
            style="display:block"
            data-ad-client="ca-pub-3184778483057051"
            data-ad-slot="5629491382"></ins>
    </div>

<main class:guesses={game.guesses !== 0} style="--rows: {game.guesses}; --cols: {COLS}">
    <!-- Susie header -->
    <div class="headeradwrapper">
        <ins class="adsbygoogle headerad"
            style="display:block"
            data-ad-client="ca-pub-3184778483057051"
            data-ad-slot="6412955981"></ins>
    </div>
	<Header
		bind:showRefresh
		showStats={stats.gamesPlayed > 0}
        guesses={game.guesses}
        gameStatus={game.gameStatus}
        on:stats={() => (showStats = true)}
		on:tutorial={() => (showTutorial = true)}
		on:settings={() => (showSettings = true)}
		on:reload={reload}
        on:giveup={lose}
        on:toggleMode={practiceMode.set(!$practiceMode)}
	/>
	<Board
		bind:this={board}
		bind:value={game.boardState}
        bind:CVCpattern
		evaluations={game.evaluations}
		guesses={game.guesses}
        showhint={game.showHint}
	/>
	<Keyboard
		on:keystroke={() => {
			board.hideCtx();
		}}
		bind:value={game.boardState[game.guesses]}
		on:submitWord={submitWord}
        on:showExplainer={() => (showExplainer = true)}
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

<Modal
	bind:visible={showExplainer}
>
	<Explainer gamestate={game} />
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
