<script lang="ts">
	import { createEventDispatcher, getContext } from "svelte";
	import { scale, fade } from "svelte/transition";
	import { wordNumber, practiceMode } from "../stores";
	import GameIcon from "./GameIcon.svelte";
	import type { Toaster } from "./widgets";

	export let showStats: boolean;
//	export let tutorial: boolean;
	export let showRefresh: boolean;
    export let guesses: number;
    export let gameStatus: string;

//	export let toaster = getContext<Toaster>("toaster");

	const dispatch = createEventDispatcher();

    // This might be broken: showRefresh is always going to be false
    // Also: practice mode will get confused by this
    wordNumber.subscribe((m) => {
		if (86400000 - (new Date().valueOf() - new Date().setHours(0,0,0,0)) > 0) {
			showRefresh = false;
		}
	});
</script>

<header>
	<div class="icons">
		<GameIcon onClick={() => dispatch("tutorial")} Tooltip="How to play">
			<path
				d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm1 16h-2v-2h2v2zm0-4.141V15h-2v-2a1 1 0 0 1 1-1c1.103 0 2-.897 2-2s-.897-2-2-2s-2 .897-2 2H8a4 4 0 0 1 8 0a3.991 3.991 0 0 1-3 3.859z"
			/>
		</GameIcon>
		{#if (!$practiceMode && showRefresh)}
			<GameIcon onClick={() => dispatch("reload")} Tooltip="Load new daily game">
				<path
					transition:fade={{ duration: 200 }}
				    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm4.82-4.924a7 7 0 1 0-1.852 1.266l-.975-1.755A5 5 0 1 1 17 12h-3l2.82 5.076z"
				/>
			</GameIcon>            
        {:else if (guesses > 9 && gameStatus === "IN_PROGRESS")}
        <div class="giveup" on:click={e => dispatch("giveup")}>Give up?</div>
        {:else}
			<GameIcon onClick={e => dispatch("toggleMode")} Tooltip="Toggle unlimited mode">
				<path
					transition:fade={{ duration: 200 }}
d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM17.718 13.275 17.718 13.275C18.062 12.931 18.252 12.473 18.252 11.987 18.252 11.501 18.063 11.046 17.719 10.7 17.032 10.014 15.834 10.014 15.146 10.702L13.807 11.987 15.128 13.257C15.852 13.98 17.031 13.964 17.718 13.275M8.857 13.275 10.197 11.991 8.876 10.721C8.513 10.359 8.056 10.17 7.571 10.17 7.086 10.17 6.629 10.359 6.287 10.703 5.941 11.049 5.752 11.504 5.752 11.99A1.807 1.807 0 006.285 13.275C6.973 13.963 8.17 13.963 8.857 13.275M16.433 7.67 16.433 7.67A4.296 4.296 0 0119.487 8.934C20.304 9.751 20.753 10.834 20.753 11.989 20.753 13.144 20.303 14.23 19.486 15.044 18.671 15.861 17.587 16.31 16.433 16.31 15.279 16.31 14.193 15.86 13.378 15.044L12.002 13.724 10.607 15.062A4.272 4.272 0 017.571 16.31 4.285 4.285 0 014.517 15.044C3.7 14.229 3.251 13.143 3.251 11.991A4.288 4.288 0 014.518 8.936 4.289 4.289 0 017.571 7.67 4.287 4.287 0 0110.626 8.936L12.001 10.256 13.397 8.916A4.282 4.282 0 0116.433 7.67z"/>
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
    {#if $practiceMode}
    <h2>UNLIMITED</h2>
    {/if}
	<div class="icons">
		{#if showStats && !$practiceMode}
			<GameIcon onClick={() => dispatch("stats")}>
				<path
					transition:fade={{ duration: 200 }}
					d="M21 21H3v-2h18v2zM8 10H4v7h4v-7zm6-7h-4v14h4V3zm6 3h-4v11h4V6z"
				/>
			</GameIcon>
        {:else if $practiceMode}
			<GameIcon onClick={() => dispatch("reload")} Tooltip="New random game">
                <path 
					transition:fade={{ duration: 200 }}
                    d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM8 17.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 8 17.5zm0-8a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 8 9.5zm4 4a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 12 13.5zm4 4a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 16 17.5zm0-8a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 16 9.5z"
                />
            </GameIcon>
		{/if}
		<GameIcon onClick={() => dispatch("settings")} Tooltip="Settings">
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
	h2 {
		position: absolute;
		width: 100%;
        top: 43px;
		font-size: var(--fs-small);
        font-family: var(--tile-font);
        font-weight: 700;
		text-align: center;
	}
    .giveup {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--fs-small);
        line-height: var(--fs-small);
        letter-spacing: 0px;
        vertical-align: middle;
        text-align: center;
        width: 48px;
        cursor: hand;
    }
</style>
