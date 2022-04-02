<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { COLS } from "../../utils";

	import Tile from "./Tile.svelte";
	export let guesses: number;
	export let num: number;
	export let value = "";
	export let evaluation: WordState;
    export let width: number;
    
    let evalclasses = ["zero","one","two","three","four","five"];
    function getRowClass(ev) {
        return (ev < 0) ? "nil" : evalclasses[ev];
    }
    
	export function shake() {
		animation = "shake";
	}
	export function bounce() {
		tiles.forEach((e) => e.bounce());
	}

    const dispatch = createEventDispatcher();
	let animation = "";
	let tiles: Tile[] = [];
</script>

<div
	class="board-row"
	on:animationend={() => (animation = "")}
	data-animation={animation}
	class:complete={guesses > num}
    style="width: {width}px; height: {width/(COLS+2)}px;"
>
        <Tile value="" />
    <div class="inner-row {getRowClass(evaluation)}"
        style="width: {width*COLS/(COLS+2)}px;"
    >
	{#each Array(COLS) as _, i}
		<Tile bind:this={tiles[i]} value={value.charAt(i)} position={i+1+num} />
    {/each}
    </div>
    {#if evaluation >= 0}
    <div class="number-cell">
        <Tile value={evaluation} position={COLS+2+num} />
    </div>
    {/if}
</div>

<style lang="scss">
	.board-row {
        padding: 0px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 0px;
        font-family: var(--tile-font);
		&[data-animation="shake"] {
			animation: shake 0.6s;
		}
        transition: background-color 1s ease;
	}
    .inner-row {
        font-size: var(--fs-tile-large);
		display: grid;
        height: 100%;
		grid-template-columns: repeat(var(--cols), 1fr);
		grid-gap: 0px;
    }
    .number-cell {
        font-size: var(--fs-tile-small);
        height: 100%;    
    }
    
	@keyframes shake {
		10%,
		90% {
			transform: translateX(-1px);
		}

		20%,
		80% {
			transform: translateX(2px);
		}

		30%,
		50%,
		70% {
			transform: translateX(-4px);
		}

		40%,
		60% {
			transform: translateX(4px);
		}
	}
</style>
