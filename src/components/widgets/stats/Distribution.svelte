<script lang="ts">
	export let guesses = 0;
	export let distribution: number[];
	export let active: boolean;

	$: max = Math.max(...Object.values(distribution));
</script>

<h3>guess distribution</h3>
<div class="container">
	{#each Object.entries(distribution) as guess, i (guess[0])}
		{#if !isNaN(parseInt(guess[0])) && (guess[1] > 0)}
			<div class="graph">
				<span class="guess">{guess[0]}</span>
				<div
					class="bar"
					class:this={parseInt(guess[0]) === guesses && !active}
					style="width: {(guess[1] / max) * 100}%;"
				>
					{(guess[1] === null ? 0 : guess[1])}
				</div>
			</div>
		{/if}
	{/each}
</div>

<style>
	.guess {
		display: grid;
		place-items: center;
        min-width: 8%;
	}
	.container {
		width: 80%;
		margin-left: auto;
		margin-right: auto;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.graph {
		height: 20px;
		display: flex;
		gap: 4px;
	}
	.bar {
		min-width: 7%;
		transition: width 0.3s ease-out;
		background: var(--color-absent);
		color: white;
		font-weight: bold;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 8px;
	}
	.bar.this {
		background: var(--color-five);
	}
</style>
