<script lang="ts">
	import { words, COLS } from "../../utils";
    import { wordNumber } from "../../stores"
    
	import CVCRow from "./CVCRow.svelte";
	import Row from "./Row.svelte";
//	import ContextMenu from "../widgets/ContextMenu.svelte";

	export let value: string[];
//	export let board: GameBoard;
//  export let boardState: string[];
    export let evaluations: WordState[];
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
//calc({innerHeight}px - var(--header-height) - var(--keyboard-height) - {Math.min(0.8 * innerWidth,480)/(COLS+1)}); 
</script>
<svelte:window bind:innerHeight={innerHeight} bind:innerWidth={innerWidth}/>

<div style="height: calc({innerHeight}px - var(--header-height) - var(--keyboard-height));">
    <CVCRow
            word={words.words[$wordNumber]} width={Math.min(0.8 * innerWidth,480)}
    />
    <div class="board" 
        id="boardid" 
        style="width: {Math.min(0.8 * innerWidth,480)}px; height: {(guesses+1)*Math.min(0.8 * innerWidth,480)/(COLS+1)}px; --repeat: {guesses+1}"
    >
    {#each value as _, i}
		<Row
			num={i}
			{guesses}
			bind:this={rows[i]}
			bind:value={value[i]}
			evaluation={evaluations[i]}
            width={Math.min(0.8 * innerWidth,480)}
		/>
	{/each}
    </div>
</div>

<style>
	.board {
        max-width: 480px;
        max-height: 420px;
        overflow-y: auto;
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
