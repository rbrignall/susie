<script lang="ts">
	import { COLS } from "../../utils";

	import { Tile } from "../board";
	export let visible: boolean;
    
    let rowWidth = 50*(COLS+1);
</script>

<h3>how to play</h3>

<div>Can you find Susie's word in 10 guesses?</div>

<div>She has given hints about each letter: C stands for consonant and V stands for vowel.</div>

<div>Each guess must be a valid five-letter word. Hit the enter button to submit.</div>

<div>After each guess, the colour of the tiles will change to show you how close your guess was to the word.</div>

<div>The number after the word shows how many correct letters are in the word.</div>

<div>As you get closer (warmer), the colours change from blue (cold) to red (hot).</div>


<div class:complete={visible} class="examples" style="--tutorial-row-width: {rowWidth}px; --cols: {COLS}">
	<div><strong>Example</strong></div>
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
	.examples {
		border-top: 1px solid var(--border-primary);
		border-bottom: 1px solid var(--border-primary);
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
