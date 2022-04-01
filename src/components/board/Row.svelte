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
        style="width: {width*COLS/(COLS+2)}px; height: {width/(COLS+2)}px;"
    >
	{#each Array(COLS) as _, i}
		<Tile bind:this={tiles[i]} value={value.charAt(i)} position={i+1+num} />
    {/each}
    </div>
    {#if evaluation >= 0}
        <Tile value={evaluation} position={COLS+2+num} />
    {/if}
</div>

<style lang="scss">
	.board-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 0px;
		font-size: 2.4rem;
        line-height: 2.4rem;
		&[data-animation="shake"] {
			animation: shake 0.6s;
		}
        transition: background-color 1s ease;
	}
    .inner-row {
		display: grid;
		grid-template-columns: repeat(calc(var(--cols)), 1fr);
		grid-gap: 0px;
    }
    @media (max-height: 600px) {
        .board-row {
            font-size: 2em;
            line-height: 2em;
        }
    }
    @media (max-height: 450px) {
        .board-row {
            font-size: 1.5em;
            line-height: 1.5em;
        }
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
