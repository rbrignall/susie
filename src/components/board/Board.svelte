<script lang="ts">
	import { words, COLS } from "../../utils";
    
	import CVCRow from "./CVCRow.svelte";
	import Row from "./Row.svelte";

	export let value: string[];
    export let evaluations: WordState[];
    export let showhint: boolean;
	export let guesses: number;
    export let CVCpattern: string[];
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
    {#if (showhint)}
    <CVCRow
            width={getRowDim(innerWidth,innerHeight) + 40} bind:CVCpattern
    />
    {/if}
    <div class="board" 
        id="boardid" 
        style="width: {getRowDim(innerWidth,innerHeight)+40}px; max-height: calc({innerHeight}px - 2.2em - var(--header-height) - var(--keyboard-height) - var(--ad-height)); height: {(guesses+1)*getBoxDim(innerWidth,innerHeight)}px; --repeat: {guesses+1}"
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
        overflow-y: auto;
        overflow-x: hidden;
		display: grid;
		grid-template-rows: repeat(var(--repeat), 1fr);
		grid-gap: 0px;
		padding: 0px 20px;
		position: relative;
	}
</style>
