<script lang="ts">
	import { words, COLS } from "../../utils";
    import { wordNumber } from "../../stores"
    
	import CVCRow from "./CVCRow.svelte";
	import Row from "./Row.svelte";
//	import ContextMenu from "../widgets/ContextMenu.svelte";

	export let value: string[];
//	export let board: GameBoard;
//  export let boardState: string[];
    export let evaluations: LetterState[];
	export let guesses: number;
	export function shake(row: number) {
		rows[row].shake();
	}
	export function bounce(row: number) {
		rows[row].bounce();
	}
	export function hideCtx(e?: MouseEvent) {
		if (!e || !e.defaultPrevented) showCtx = false;
	}
	let rows: Row[] = [];
	let showCtx = false;
	let pAns = 0;
	let pSols = 0;
	let x = 0;
	let y = 0;
	let word = "";
    let innerHeight;
    let innerWidth;

</script>
<svelte:window bind:innerHeight={innerHeight} bind:innerWidth={innerWidth}/>

<div class="board" id="boardid" style="width: {innerWidth}px; height: calc({innerHeight}px - var(--header-height) - var(--keyboard-height)); --repeat: {guesses+2}">
    <CVCRow
            word={words.words[$wordNumber]}
    />
	{#each value as _, i}
		<Row
			num={i}
			{guesses}
			bind:this={rows[i]}
			bind:value={value[i]}
			evaluation={evaluations[i]}
		/>
	{/each}
</div>

<style>
	.board {
        max-width: 480px;
        max-height: 420px;
		display: grid;
        /*grid-template-rows: 80px;*/
        /*justify-items: start;*/
		grid-template-rows: repeat(var(--repeat), 1fr);
		grid-gap: 0px;
		/*flex-grow: 1;*/
		padding: 0px;
		position: relative;
	}
</style>
