<script lang="ts">
	import { COLS, ROWS } from "../../utils";

	import { Tile } from "../board";
	export let visible: boolean;
    
    let rowWidth = 44*COLS-4;
</script>

<h3>how to play</h3>

<div>Guess the <strong>n-erdle</strong> in {ROWS} tries.</div>
<div>Each guess must be a valid {COLS}-letter word. Press enter to submit a guess. The colour of the tiles will then change as follows.
</div>
<div class:complete={visible} class="examples" style="--tutorial-row-width: {rowWidth}px; --cols: {COLS}">
	<div><strong>Examples</strong></div>
	<div class="row">
		<Tile value="w" state="correct" />
		<Tile value="e" state="nil" />
		<Tile value="a" state="nil" />
		<Tile value="r" state="nil" />
		<Tile value="y" state="nil" />
	</div>
	<div>The letter <strong>W</strong> is in the word and in the correct spot.</div>
	<div class="row">
		<Tile value="p" state="nil" />
		<Tile value="i" state="present" />
		<Tile value="l" state="nil" />
		<Tile value="l" state="nil" />
		<Tile value="s" state="nil" />
	</div>
	<div>The letter <strong>I</strong> is in the word but in the wrong spot.</div>
	<div class="row">
		<Tile value="v" state="nil" />
		<Tile value="a" state="nil" />
		<Tile value="g" state="nil" />
		<Tile value="u" state="absent" />
		<Tile value="e" state="nil" />
	</div>
	<div>The letter <strong>U</strong> is not in the word in any spot.</div>
</div>
<div>A new n-erdle will be available at midnight each day!</div>


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
	.row {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		height: 40px;
        width: var(--tutorial-row-width);
		grid-gap: 5px;
        font-size: 1.8em;
        line-height: 1.4em;
        vertical-align: middle;
	}
</style>
