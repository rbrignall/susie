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
	class="board-row {getRowClass(evaluation)}"
	on:animationend={() => (animation = "")}
	data-animation={animation}
	class:complete={guesses > num}
    style="width: {width}px; height: {width/(COLS+1)}px;"
>
	{#each Array(COLS) as _, i}
		<Tile bind:this={tiles[i]} value={value.charAt(i)} position={i+num} />
    {/each}
    {#if evaluation >= 0}
        <Tile value={evaluation} position={COLS+1+num} />
    {/if}
</div>

<style lang="scss">
	.board-row {
		display: grid;
		grid-template-columns: repeat(calc(var(--cols) + 1), 1fr);
		grid-gap: 0px;
		font-size: 2.4rem;
        line-height: 2.4rem;
		&[data-animation="shake"] {
			animation: shake 0.6s;
		}
        transition: background-color 1s ease;
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

   	.zero {
		background: var(--color-zero);
	}
	.one {
		background: var(--color-one);
	}
	.two {
		background: var(--color-two);
	}
	.three {
		background: var(--color-three);
	}
	.four {
		background: var(--color-four);
	}
	.five {
		background: var(--color-five);
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
