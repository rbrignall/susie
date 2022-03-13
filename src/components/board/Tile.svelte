<script lang="ts">
	import { onDestroy } from "svelte";

	import { mode } from "../../stores";

	import { DELAY_INCREMENT } from "../../utils";

	export let value = "";
	export let state: string;
	export let position = 0;
	export function bounce() {
		setTimeout(() => (animation = "bounce"), (5 + position) * DELAY_INCREMENT);
		//WAS: setTimeout(() => (animation = "bounce"), (ROWS + position) * DELAY_INCREMENT);
	}
	let s: string;
	let pop = false;
	let animation = "";

	// ensure all animations play
	const unsub = mode.subscribe(() => {
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
	class="tile {state} {s}"
	style="transition-delay: {position * DELAY_INCREMENT}ms"
>
	<div class="front">{value}</div>
	<div class="back">{value}</div>
</div>

<style lang="scss">
	:not(.pop),
	:global(.complete) .value {
		scale: 1 !important;
		opacity: 1 !important;
	}
	.value {
		animation: pop 0.1s;
		.front {
			border-color: var(--border-primary);
		}
	}
	.tile {
        width: 100%;
        max-height: 80px;
        font-size: 100%;
        font-family: var(--tile-font);
		font-weight: bold;
		text-transform: uppercase;
		position: relative;
		transform-style: preserve-3d;
		&[data-animation="bounce"] {
			animation: bounce 1s;
		}
	}
	.back,
	.front {
        width: 100%;
        height: 100%;
		display: inline-flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        vertical-align: middle;
		place-items: center;
		position: absolute;
		inset: 0;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		transition: transform 0s ease-in-out;
	}
	.front {
		border: 2px solid var(--border-primary);
/*		transform: rotateY(0deg);*/
        transform: rotate3d(-1, 1, 0, 0deg);
    }
	.back {
		background: var(--color-absent);
/*		transform: rotateY(180deg);*/
        transform: rotate3d(-1, 1, 0, 180deg);
	}
	.zero .back {
		background: var(--color-zero);
	}
	.one .back {
		background: var(--color-one);
	}
	.two .back {
		background: var(--color-two);
	}
	.three .back {
		background: var(--color-three);
	}
	.four .back {
		background: var(--color-four);
	}
	.five .back {
		background: var(--color-five);
	}
	.correct .back {
		background: var(--color-correct);
	}
	.present .back {
		background: var(--color-present);
	}
	:global(.complete) .tile:not(.nil) .front {
		transition-delay: inherit !important;
		transition-duration: 0.8s;
/*		transform: rotateY(180deg);*/
        transform: rotate3d(-1, 1, 0, 180deg);
	}
	:global(.complete) .tile:not(.nil) .back {
		transition-delay: inherit !important;
		transition-duration: 0.8s;
/*		transform: rotateY(0deg);*/
        transform: rotate3d(-1, 1, 0, 0deg);
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
