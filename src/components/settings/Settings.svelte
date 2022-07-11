<script lang="ts">
	import { getContext, onMount } from "svelte";

	import { darkTheme, easyMode, noHintMode, practiceMode, numberGuesses } from "../../stores";
	import { Toaster } from "../widgets";
	import Setting from "./Setting.svelte";

	export let validNormal: boolean;
	export let visible: boolean;
	export let wordNumber: number;
	let tip = 0;

	$: if (visible) tip = Math.floor(10 * Math.random());

	const toaster = getContext<Toaster>("toaster");

	let root: HTMLElement;
	onMount(() => {
		root = document.body;//documentElement;
	});
	$: {
		if (root) {
			$darkTheme ? root.classList.remove("light") : root.classList.add("light");
            localStorage.setItem("darkTheme",$darkTheme)
		}
	}
</script>

<!-- not currently supported, see https://github.com/sveltejs/svelte/issues/3105 -->
<!-- <svelte:body class:light={!$darkTheme} /> -->
<div class="outer">
	<div class="settings-top">
		<h3>settings</h3>
		<div
			on:click={() => {
				if (!validNormal) {
					toaster.pop("Game has already used auto-highlighting");
				}
			}}
		>
			<Setting bind:value={$easyMode} disabled={!validNormal}>
				<span slot="title">Easy Mode</span>
				<span slot="desc">Enables automatic keyboard highlighting.</span>
			</Setting>
		</div>
        <div 
			on:click={() => {
				if ($noHintMode) {
					toaster.pop("Hint will be hidden in the next game.");
				}
			}}
		>
		    <Setting bind:value={$noHintMode}>
                <span slot="title">No Hint Mode</span>
                <span slot="desc">Hides consonant/vowel hints.</span>
		    </Setting>
		</div>
		<Setting bind:value={$practiceMode}>
			<span slot="title">Unlimited Mode</span>
            <span slot="desc">Play random games for fun</span>
		</Setting>
		<Setting bind:value={$darkTheme}>
			<span slot="title">Dark Theme</span>
		</Setting>
		<Setting bind:value={$numberGuesses}>
			<span slot="title">Number guesses</span>
            <span slot="desc">Display how many guesses you've had</span>
		</Setting>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
			<div style="font-size: var(--fs-medium); font-weight: 500;">
                Clear all game data
            </div>
			<div style="font-size: var(--fs-tiny); color: var(--fg-secondary);">Resets all data, including game statistics</div>   
            </div>
        <div class="warningbutton"><span 
            on:click={() => {
                if (confirm("This will delete everything and cannot be undone. Are you sure?")) {
                    localStorage.clear();
                    toaster.pop("Data deleted! Reloading...");
                    setTimeout(() => (location.reload()), 3000);
                }
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
            </svg>
            Delete
        </span></div>
    </div>
	</div>
    <div class="footer">
        <div>Concept by <a href="http://benponniah.com/" target="_blank">Ben Ponniah</a>. Developed by <a href="https://github.com/rbrignall" target="_blank">rbrignall</a></div>
        <div class="word">
            Game #{wordNumber} v2.0.1
        </div>
    </div>
</div>

<style>
	.outer {
/*		height: 100%;
		display: flex;
		flex-direction: column;
        justify-content: space-between;*/
        position: relative;
    }
	.footer {
		color: var(--fg-secondary);
		font-size: var(--fs-tiny);
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		text-align: end;
        width: 100%;
        padding: 0px 0px;
	}
    .settings-top {
        padding: 0px 0px 30px 0px;
    }
	:global(.settings-top > div) {
		padding: 16px 0;
		border-bottom: 1px solid var(--border-primary);
	}
    .warningbutton {
        color: var(--fg-primary);
        cursor: pointer; 
        border: 1px solid var(--fg-primary); 
        border-radius: 3px; 
        padding: 3px; 
        font-size: var(--fs-medium);
        font-weight: 400;
    }
    .warningbutton:hover {
        color: var(--bg-primary);
        background-color: var(--fg-primary);
    }
</style>
