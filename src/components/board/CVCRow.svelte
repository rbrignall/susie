<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { COLS, getWordNumber } from "../../utils";

	import Tile from "./Tile.svelte";
    export let word: string;
    
	const dispatch = createEventDispatcher();
	let animation = "";
	let tiles: Tile[] = [];
    let cvcpattern = [];
    let isVowel={a:1,e:1,i:1,o:1,u:1}
    word.split('').forEach((letter,i)=>{
        if(isVowel[letter]){cvcpattern.push('V')} else {cvcpattern.push('C')}
    })
</script>

<div
	class="board-row complete"
	on:animationend={() => (animation = "")}
	data-animation={animation}
>
	{#each Array(COLS) as _, i}
    		<Tile value={cvcpattern[i]} state="absent" />
	{/each}
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
        &:not(.complete) :global(.board-row .back) {
			transition-delay: 0.3s;
		}
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
