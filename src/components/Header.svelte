<script lang="ts">
	import { createEventDispatcher, getContext } from "svelte";
	import { scale, fade } from "svelte/transition";
	import { wordNumber } from "../stores";
	import GameIcon from "./GameIcon.svelte";
	import type { Toaster } from "./widgets";

	export let showStats: boolean;
//	export let tutorial: boolean;
	export let showRefresh: boolean;

//	export let toaster = getContext<Toaster>("toaster");

	const dispatch = createEventDispatcher();

    // This might be broken: showRefresh is always going to be false
    wordNumber.subscribe((m) => {
		if (86400000 - (new Date().valueOf() - new Date().setHours(0,0,0,0)) > 0) {
			showRefresh = false;
		}
	});
</script>

<header>
	<div class="icons">
		<GameIcon onClick={() => dispatch("tutorial")}>
			<path
				d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm1 16h-2v-2h2v2zm0-4.141V15h-2v-2a1 1 0 0 1 1-1c1.103 0 2-.897 2-2s-.897-2-2-2s-2 .897-2 2H8a4 4 0 0 1 8 0a3.991 3.991 0 0 1-3 3.859z"
			/>
		</GameIcon>
		{#if showRefresh}
			<GameIcon onClick={() => dispatch("reload")}>
				<path
					transition:fade={{ duration: 200 }}
					d="M4.609 12c0-4.082 3.309-7.391 7.391-7.391a7.39 7.39 0 0 1 6.523 3.912l-1.653 1.567H22v-5.13l-1.572 1.659C18.652 3.841 15.542 2 12 2 6.477 2 2 6.477 2 12s4.477 10 10 10c4.589 0 8.453-3.09 9.631-7.301l-2.512-.703c-.871 3.113-3.73 5.395-7.119 5.395-4.082 0-7.391-3.309-7.391-7.391z"
				/>
			</GameIcon>
		{/if}
	</div>
	<h1>
        <span class="h1-one">S</span>
        <span class="h1-two">u</span>
        <span class="h1-three">s</span>
        <span class="h1-four">i</span>
        <span class="h1-five">e</span>
    </h1>
	<div class="icons">
		{#if showStats}
			<GameIcon onClick={() => dispatch("stats")}>
				<path
					transition:fade={{ duration: 200 }}
					d="M21 21H3v-2h18v2zM8 10H4v7h4v-7zm6-7h-4v14h4V3zm6 3h-4v11h4V6z"
				/>
			</GameIcon>
		{/if}
		<GameIcon onClick={() => dispatch("settings")}>
			<path
				d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z"
			/>
		</GameIcon>
	</div>
</header>

<style lang="scss">
	header {
		position: relative;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2px solid var(--border-primary);
		width: 100%;
		height: var(--header-height);
		position: relative;
	}
	.icons {
		height: 100%;
		z-index: 1;
		display: flex;
	}
	h1 {
		position: absolute;
		width: 100%;
		font-size: var(--fs-large);
        font-family: var(--tile-font);
        font-weight: 700;
		text-align: center;
	}
    .h1-one {
        color: var(--color-one);
        padding-right: 0.4rem;
    }
    .h1-two {
        color: var(--color-two);
        padding-right: 0.4rem;
    }
    .h1-three {
        color: var(--color-three);
        padding-right: 0.4rem;
    }
    .h1-four {
        color: var(--color-four);
        padding-right: 0.4rem;
    }
    .h1-five {
        color: var(--color-five);
    }
</style>
