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

<div>Can you find Susie's word in 10 guesses?</div>

<div>She has given hints about each letter: C stands for consonant and V stands for vowel.</div>

<div>Each guess must be a valid five-letter word. Hit the enter button to submit.</div>

<div>After each guess, the number after the word shows how many correct letters are in the word. The colour of the tiles also changes depending on how close your guess was.</div>

<h3>Keyboard colours</h3>

<div>To help you close in on the word, keys on the keyboard can be highlighted grey (not in the word) or red (in the word).</div>

<div>In "Normal" mode, you make your own logical deductions and can highlight keys for yourself [<a href="https://www.youtube.com/watch?v=_N5s4zeemUM" target="_blank">Watch a short video</a>]. In "Easy" mode, the programme will make deductions and highlight keys for you.</div>

{#if firstvisit}
<div>Choose which mode you would like to play.</div>

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
    
<div>You can change this in future from the settings menu.</div>
{/if}

<h3>Example</h3>
<div class:complete={visible} class="examples" style="--tutorial-row-width: {rowWidth}px; --cols: {COLS}">

	<div class="row nil" style="height: 1em;">
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

<div>A new word from Susie will be available each day!</div>


<style lang="scss">
	div {
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
		&:not(.complete) :global(.row .back) {
			transition-delay: 0.3s;
		}
	}
    .wrapper {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		height: 50px;
        width: calc(var(--tutorial-row-width) * (var(--cols) + 1) / var(--cols));    
		grid-gap: 0px;
        font-size: 1.8em;
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
    }
    .row {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		height: 100%;
        width: var(--tutorial-row-width);
	}
</style>
