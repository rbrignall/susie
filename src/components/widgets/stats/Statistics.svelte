<script lang="ts">

	import Stat from "./Stat.svelte";
	export let data: Stats;

	let stats: [string, string | number][];
	$: {
		stats = [
			["Played", data.gamesPlayed],
			[
				"Average Guesses",
				(
					Object.entries(data.guesses).reduce((a, b) => {
						if (!isNaN(parseInt(b[0]))) {
							return a + parseInt(b[0]) * b[1];
						}
						return a;
					}, 0) / data.guesses.reduce((a,b) => a+b,0) || 0
				).toFixed(1),
			],
		];
		if ("currentStreak" in data) {
			stats.push(["Current Streak", data.currentStreak]);
			stats.push(["Max Streak", data.maxStreak]);
		}
	}
</script>

<h3>Statistics</h3>
<div>
	{#each stats as stat}
		<Stat name={stat[0]} stat={stat[1]} />
	{/each}
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		gap: 8px;
	}
</style>
