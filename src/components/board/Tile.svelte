<script lang="ts">
	import { onDestroy } from "svelte";

	import { wordNumber } from "../../stores";

	import { DELAY_INCREMENT } from "../../utils";

	export let value = "";
	export let position = 0;
	export function bounce() {
		setTimeout(() => (animation = "bounce"), (6 + position) * DELAY_INCREMENT);
		//WAS: setTimeout(() => (animation = "bounce"), (ROWS + position) * DELAY_INCREMENT);
	}
	let s: string;
	let pop = false;
	let animation = "";

	// ensure all animations play
	const unsub = wordNumber.subscribe(() => {
		animation = "";
		s = "nil";
		setTimeout(() => (s = ""), 10);
	});
	// prevent pop animation from playing at the beginning
	setTimeout(() => (pop = true), 200);

	onDestroy(unsub);
</script>

<div
	data-animation={animation}
	class:value
	class:pop
	class="tile {s}"
	style="transition-delay: {position * DELAY_INCREMENT}ms;"
>
	{value}
</div>

<style lang="scss">
	:not(.pop),
	:global(.complete) .value {
		scale: 1 !important;
		opacity: 1 !important;
	}
	.value {
		animation: pop 0.1s;
	}
	.tile {
        width: 100%;
        height: 100%;
        font-size: 100%;
		font-weight: bold;
		text-transform: uppercase;
		position: relative;
		transform-style: preserve-3d;
		&[data-animation="bounce"] {
			animation: bounce 1s;
		}
        display: inline-flex;
        justify-content: center;
        text-align: center;
        align-items: center;
        vertical-align: middle;
		place-items: center;
    }


	@keyframes pop {
		from {
			scale: 0.8;
			opacity: 0;
		}

		40% {
			scale: 1.1;
			opacity: 1;
		}
	}
	@keyframes bounce {
		0%,
		20% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-30px);
		}
		50% {
			transform: translateY(5px);
		}
		60% {
			transform: translateY(-15px);
		}
		80% {
			transform: translateY(2px);
		}
		100% {
			transform: translateY(0);
		}
	}
</style>
