<script lang="ts">
	import type Toaster from "./Toaster.svelte";

	import { getContext } from "svelte";
    import { WhatsApp, Twitter } from "./sharebuttons";
    import { easyMode } from "../../stores";

	export let state: GameState;
	const toaster = getContext<Toaster>("toaster");
    const url ="https://susie.rbrignall.org.uk";

    $: stats = `Susie${!$easyMode ? "*" : ""}${state.showHint ? "" : "**"} ${(state.wordNumber)} in ${
		(state.gameStatus === 'WIN') ? state.guesses : "X"
	}:\n${state.evaluations.map((r) => r === 0 ? "0️⃣" : (r === 1 ? "1️⃣" : (r === 2 ? "2️⃣" : (r === 3 ? "3️⃣" : (r === 4 ? "4️⃣" : "5️⃣"))))).join("")
    }\n`;
    
</script>
<h3>share</h3>
<div class="sharecontainer">
    <Twitter class="share-button" text="{stats}" hashtags="SusieGame" {url} />
    <WhatsApp class="share-button" text="{stats} {url}" />
    <div class="copybutton"
        on:click={() => {
            navigator.clipboard.writeText(stats.concat(url));
		    toaster.pop("Copied to clipboard");    
        }}
    >
	   <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
		<path
			fill="white"
			d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
		/>
	   </svg>
       Copy
    </div>
</div>
<style>
    h3 {
		margin-bottom: 10px;
	}
    .sharecontainer {
        display: grid; 
        grid-template-columns: 37.5px 37.5px 75px;
        grid-gap: 10px;
        justify-content: center;
        width: 100%;
    }
	.copybutton {
        color: white;
		font-weight: 500;
		background: var(--color-correct);
		border-radius: 13px;
		height: 100%;
		display: flex;
        height: 40px;
		width: 75px;
        justify-content: center;
        align-items: center;
        text-align: center;
        vertical-align: middle;
		gap: 5px;
		cursor: pointer;
	}
    @media (max-width: 500px) {
        .sharecontainer {
            grid-gap: 5px;
        }
        .copybutton {
            width: 70px;
        }

    }
	div:hover {
		opacity: 0.9;
	}
</style>
