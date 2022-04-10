<script lang="ts">
	import { Tile } from "../board";

    export let gamestate: GameState;
</script>

<h3>What was highlighted?</h3>
{#if !(gamestate.explainer) || !(gamestate.explainer[0])}
    <div>No keyboard highlighting has occurred yet!</div>
{:else}
    <div>In order of deduction:</div>
{#each gamestate.explainer as explanation}
    <div class="row">
        <div class="{gamestate.keyStates[explanation[0]]} letter">
            <Tile value="{explanation[0]}" />
        </div>
        <div class="reason">{explanation[1]}</div>
    </div>
{/each}
{/if}
<style lang="scss">
	.row {
        margin-bottom: 0px;
		margin: 0px 0;
        display: grid;
		grid-template-columns: 20px 2fr;
        vertical-align: top;
	}
    .letter {
        height: 20px;
        font-family: var(--tile-font);
        font-size: var(--fs-small);
        vertical-align: middle;
    }
    .reason {
        margin: 0px 5px;
        padding-top: 2px;
    }
</style>
