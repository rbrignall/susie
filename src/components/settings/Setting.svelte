<script lang="ts">
	import Switch from "./Switch.svelte";
	export let value: any;
//	export let options: (string | number)[] = [];
	export let disabled = false;

</script>

<div class="setting">
	<div>
		<div class="title"><slot name="title" /></div>
		<div class="desc"><slot name="desc" /></div>
	</div>
	<Switch bind:value {disabled} />
</div>

<style>
	.setting {
		/* border-bottom: 1px solid var(--border-primary); */
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.title {
		font-size: var(--fs-medium);
		font-weight: 500;
	}
	.desc {
		font-size: var(--fs-tiny);
		color: var(--fg-secondary);
	}
</style>
