<script lang="ts">
	import { COLS } from "../../utils";
    import { easyMode } from "../../stores";
	import { Tile } from "../board";
    import WideSwitch from "../settings/WideSwitch.svelte";

	export let visible: boolean;
    export let firstvisit: boolean = true;
    
    let rowWidth = 40*(COLS+1);
</script>

<h3>how to play</h3>

<div class="para">Can you find Susie's word in 10 guesses?</div>

<div class="para">She has given hints about each letter: C stands for consonant and V stands for vowel. For example:</div>

<div class:complete={visible} class="examples" style="--tutorial-row-width: {rowWidth}px; --cols: {COLS}">

	<div class="row nil" style="height: 16px;">
		<Tile value="c" />
		<Tile value="c" />
		<Tile value="v" />
		<Tile value="c" />
		<Tile value="c" />
</div>
</div>

<div class="para">The answer will be a word like BLANK, CHURN or STUDY. (Note: 'Y' is always a regarded as a consonant in this game.)</div>

<div class="para">Each guess must be a valid five-letter word. Hit the enter button to submit.</div>

<div class="para">After each guess, the colour of the word and number after shows how many letters from your guess are in the word. For example:</div>

<div class:complete={visible} class="examples" style="--tutorial-row-width: {rowWidth}px; --cols: {COLS}">
    <div class="wrapper">
       <div class="row three">
          <Tile value="s" />
		  <Tile value="t" />
		  <Tile value="i" />
		  <Tile value="l" />
          <Tile value="l" />
	   </div>
    <div class="numwrapper">
       <Tile value="3" />
	</div>
	</div>
</div>
<div class="para">Three of the letters of STILL are somewhere in Susie's word. The other two letters are not.</div>

<div class="para"><b>Note:</b> The game does not tell you <i>which</i> letters are correct, and it does not tell you whether any letters are in the right position. You need to use your powers of logical and linguistic deduction!</div>

<div class="para">A new word from Susie will be available each day!</div>


<h3>Keyboard colours</h3>

<div class="para">To help you record your logical deductions, keys on the keyboard can be highlighted grey (not in the word) or red (in the word).</div>

{#if firstvisit}
<div class="para">Choose which mode you would like to play.</div>

    <div class="switchholder">
        <div class="switchoption right" class:selected={!$easyMode}>
            Normal
        </div>	
        <div>
            <WideSwitch bind:value={$easyMode} />
        </div>	
        <div class="switchoption left" class:selected={$easyMode}>
            Easy
        </div>
    </div>
    
<div class="para">You can change this in future from the settings menu.</div>
{/if}

<div class="para">In "Normal" mode, you must make your own logical deductions and can highlight keys for yourself [<a href="https://www.youtube.com/watch?v=_N5s4zeemUM" target="_blank">Watch a short video</a>].</div>

<div class="para">In "Easy" mode, the game makes logical deductions and highlights keys for you (press "?" to see what deductions have been made). For example: </div>

<div class:complete={visible} class="examples" style="--tutorial-row-width: {rowWidth}px; --cols: {COLS}">
	<div class="row nil" style="height: 16px;">
		<Tile value="c" />
		<Tile value="c" />
		<Tile value="v" />
		<Tile value="c" />
		<Tile value="c" />
</div>
<div class="wrapper">
	<div class="row one">
		<Tile value="s" />
		<Tile value="p" />
		<Tile value="e" />
		<Tile value="l" />
		<Tile value="l" />
	</div>
    <div class="numwrapper">
		<Tile value="1" />
	</div>
	</div>
    <div class="wrapper">
    	<div class="row two">
		<Tile value="s" />
		<Tile value="p" />
		<Tile value="i" />
		<Tile value="l" />
		<Tile value="l" />
	</div>
    <div class="numwrapper">
		<Tile value="2" />
	</div>
	</div>
</div>

<div class="para">
The game will automatically record that "E" is not in the word (grey) and "I" is in the word (red). It will then also deduce that "A", O” and "U" are not in the word (grey), as the only vowel (“I”) has been found.</div>

<!--
<h3>Example</h3>
<div class:complete={visible} class="examples" style="--tutorial-row-width: {rowWidth}px; --cols: {COLS}">

	<div class="row nil" style="height: 16px;">
		<Tile value="c" />
		<Tile value="c" />
		<Tile value="v" />
		<Tile value="c" />
		<Tile value="c" />
</div>
    <div class="wrapper">
	<div class="row one">
		<Tile value="s" />
		<Tile value="p" />
		<Tile value="e" />
		<Tile value="l" />
		<Tile value="l" />
	</div>
    <div class="numwrapper">
		<Tile value="1" />
	</div>
	</div>
    <div class="wrapper">
    	<div class="row two">
		<Tile value="s" />
		<Tile value="p" />
		<Tile value="i" />
		<Tile value="l" />
		<Tile value="l" />
	</div>
    <div class="numwrapper">
		<Tile value="2" />
	</div>
	</div>
    <div class="wrapper">
       <div class="row three">
          <Tile value="s" />
		  <Tile value="t" />
		  <Tile value="i" />
		  <Tile value="l" />
          <Tile value="l" />
	   </div>
    <div class="numwrapper">
       <Tile value="3" />
	</div>
	</div>
    <div class="wrapper">
    	<div class="row four">
		<Tile value="s" />
		<Tile value="t" />
		<Tile value="i" />
		<Tile value="c" />
		<Tile value="k" />
	   </div>
    <div class="numwrapper">
        <Tile value="4" />
	</div>
	</div>
    <div class="wrapper">
    	<div class="row five">
		<Tile value="s" />
		<Tile value="t" />
		<Tile value="i" />
		<Tile value="n" />
		<Tile value="k" />
	</div>
    <div class="numwrapper">
		<Tile value="5" />
	</div>
	</div>
</div>
-->


<style lang="scss">
	.para {
		margin: 10px 0;
	}
    .switchholder {
		display: grid;
		grid-template-columns: 2fr 48px 2fr;    
    }
    .switchoption {
        width: 100%;
	    text-transform: uppercase;
        font-weight: 700;
        font-family: var(--tile-font);
        font-size: var(--fs-regular);
    }
    .switchoption.left {
        text-align: left;
        padding-left: 10px;
    }
    .switchoption.right {
        text-align: right;
        padding-right: 10px;
    }
    .selected {
        color: var(--color-correct);
    }

	.examples {
		:global(.row > *) {
			height: 100%;
		}
        margin: 0px 40px;
	}
    .wrapper {
		display: grid;
		grid-template-columns: 5fr 1fr;
		height: 40px;
        width: var(--tutorial-row-width);    
		grid-gap: 0px;
        font-size: 1.8em;
        font-family: var(--tile-font);
        vertical-align: middle;
        text-align: center;
        align-items: center;
        vertical-align: middle;
		place-items: center;
        margin: 0px;
        padding: 0px;
    }
    .numwrapper {
        vertical-align: middle;
        height: 100%;
        font-size: var(--fs-regular);
    }
    .row {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		height: 100%;
        width: calc(var(--tutorial-row-width) * var(--cols) / (var(--cols) + 1));
	}
</style>
