<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from "svelte/internal";
	import { keyStates, wordNumber, keyBoardToggle } from "../../stores";
	import { COLS, keys } from "../../utils";
	import Key from "./Key.svelte";

	export let value = "";
	export let disabled = false;
	let preventChange = true;

	const dispatch = createEventDispatcher();
    const toggleState = ["nil","absent","present"]

	function appendValue(char: string) {
		if (!disabled) {
            if($keyBoardToggle > 0) {
                $keyStates[char] = ($keyStates[char] === toggleState[$keyBoardToggle]) ? 'nil' : toggleState[$keyBoardToggle];
                $keyBoardToggle = 0;
            } else if (value.length < COLS) {
                dispatch("keystroke", char);
                value += char;
            }        
		}
	}
	function backspaceValue() {
		if (!disabled && $keyBoardToggle === 0) {
			value = value.slice(0, value.length - 1);
		}
	}
	function handleKeystroke(e: KeyboardEvent) {
		if (!disabled && !e.ctrlKey && !e.altKey && !e.metaKey) {
			if (e.key && /^[a-z]$/.test(e.key.toLowerCase())) {
				return appendValue(e.key.toLowerCase());
			}
			if (e.key === "Backspace") return backspaceValue();

			if (e.key === "Enter") return dispatch("submitWord");

            if (e.key === "Shift") return toggleKeyboard();
		}
		if (e.key === "Escape") dispatch("esc");
	}
    function toggleKeyboard() {
        if (!disabled)
            $keyBoardToggle = ($keyBoardToggle + 1) % 3;
    }

	// Ensure keys change on load instead of loading their state color & change the color of all the keys to neutral, then to their correct color on mode change
	const unsub = wordNumber.subscribe(() => {
		preventChange = true;
		setTimeout(() => (preventChange = false), 200);
	});
	onDestroy(unsub);
</script>

<svelte:body on:keydown={handleKeystroke} />

<div class:preventChange class="keyboard">
	<div class="row">
		{#each keys[0] as letter}
			<Key
				{letter}
				on:keystroke={(e) => appendValue(e.detail)}
				state={$keyStates[letter]}
			/>
		{/each}
	</div>
	<div class="row">
    	<Key letter="*" 
            on:keystroke={toggleKeyboard}
            state={toggleState[$keyBoardToggle]}
            >
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M19.745 5a2.25 2.25 0 0 1 2.25 2.25v9.505a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 16.755V7.25A2.25 2.25 0 0 1 4.25 5h15.495Zm0 1.5H4.25a.75.75 0 0 0-.75.75v9.505c0 .414.336.75.75.75h15.495a.75.75 0 0 0 .75-.75V7.25a.75.75 0 0 0-.75-.75Zm-12.995 8h10.5a.75.75 0 0 1 .102 1.493L17.25 16H6.75a.75.75 0 0 1-.102-1.493l.102-.007h10.5h-10.5ZM16.5 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm-5.995 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm-3 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm6 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2ZM6 8a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm2.995 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm3 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm3 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm3 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2Z"/>
			</svg>
        </Key>

    
		{#each keys[1] as letter}
			<Key
				{letter}
				on:keystroke={(e) => appendValue(e.detail)}
				state={$keyStates[letter]}
			/>
		{/each}
	</div>
	<div class="row">
		<Key letter="" on:keystroke={() => !disabled && dispatch("submitWord")}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path 
                    d="M21 2a3 3 0 0 1 3 3v7.6a3 3 0 0 1-3 3H3.413l4.695 4.692a1 1 0 0 1-1.416 1.416l-6.4-6.4a1 1 0 0 1 0-1.416l6.4-6.4a1 1 0 1 1 1.416 1.416L3.413 13.6H21.5a1 1 0 0 0 .5-.5V4.6a.5.5 0 0 0-.5-.5h-4a1 1 0 0 1 0-2z"
                />
			</svg>
        </Key>
		{#each keys[2] as letter}
			<Key
				{letter}
				on:keystroke={(e) => appendValue(e.detail)}
				state={$keyStates[letter]}
			/>
		{/each}
		<Key letter="" on:keystroke={backspaceValue}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path
					d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
				/>
			</svg>
		</Key>
	</div>
</div>

<style>
	.keyboard {
		width: 100%;
        height: var(--keyboard-height);
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 0px;
        padding-top: 2px;
	}
	.row {
		width: 100%;
		display: flex;
        flex-grow: 1;
		margin: 0 auto 4px;
		padding: 0 4px;
        touch-action: manipulation;
	}
    /*
	.row:nth-of-type(2) {
		padding: 0 30px;
	}
    */
	svg {
		fill: var(--fg-primary);
		width: 24px;
	}
</style>
