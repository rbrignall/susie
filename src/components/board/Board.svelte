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
        if (scrollBoxObj) 
            scrollBoxObj.scrollTop = scrollBoxObj.scrollHeight;
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
    
    let scrollBoxObj;
    function getRowDim(w,h) {
        return Math.min(0.9 * w,h,400);
    }
    function getBoxDim(w,h) {
        return getRowDim(w,h) / (COLS+2);
    }

</script>
<svelte:window bind:innerHeight={innerHeight} bind:innerWidth={innerWidth}/>

<div style="height: calc({innerHeight}px - var(--header-height) - var(--keyboard-height));">
    <CVCRow
            word={words.words[$wordNumber]} width={getRowDim(innerWidth,innerHeight)}
    />
    <div class="board" 
        id="boardid" 
        style="width: {getRowDim(innerWidth,innerHeight)}px; max-height: calc({innerHeight}px - 2.2em - var(--header-height) - var(--keyboard-height)); height: {(guesses+1)*getBoxDim(innerWidth,innerHeight)}px; --repeat: {guesses+1}"
        bind:this={scrollBoxObj}
    >
    {#each value as _, i}
		<Row
			num={i}
			{guesses}
			bind:this={rows[i]}
			bind:value={value[i]}
			evaluation={evaluations[i]}
            width={getRowDim(innerWidth,innerHeight)}
		/>
	{/each}
    </div>
</div>

<style>
	.board {
        overflow-y: scroll;
		display: grid;
		grid-template-rows: repeat(var(--repeat), 1fr);
		grid-gap: 0px;
		padding: 0px;
		position: relative;
	}
</style>
