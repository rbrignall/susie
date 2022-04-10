<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { COLS } from "../../utils";
	import Tile from "./Tile.svelte";
    
    export let width: number;
    export let CVCpattern: string[];
    
	const dispatch = createEventDispatcher();
	let animation = "";
	let tiles: Tile[] = [];
    

</script>

<div
	class="board-row complete"
	on:animationend={() => (animation = "")}
	data-animation={animation}
    style="width: {width}px;"
>
        <Tile value="" />
	{#each Array(COLS) as _, i}
    		<Tile value={CVCpattern[i]} />
	{/each}
</div>

<style lang="scss">
	.board-row {
		display: grid;
		grid-template-columns: repeat(calc(var(--cols) + 2), 1fr);
		grid-gap: 0px;
		font-size: var(--fs-tile-small);
		&[data-animation="shake"] {
			animation: shake 0.6s;
		}
        &:not(.complete) :global(.board-row .back) {
			transition-delay: 0.3s;
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
