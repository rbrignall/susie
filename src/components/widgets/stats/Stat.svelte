<script lang="ts">
	export let stat: number | string;
	export let name: string;
</script>

<section>
	<div class="stat">{stat}</div>
	<div class="name">{name}</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 60px;
	}
	.stat {
		font-size: var(--fs-large);
        font-family: var(--tile-font);
	}
    @media (max-width: 500px) {
        .stat {
            font-size: var(--fs-medium);
        }
    }
	.name {
		text-align: center;
	}
</style>
