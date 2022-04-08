<script lang="ts">
	import { Tile } from "../board";

    export let gamestate: GameState;
</script>

<h3>What was highlighted?</h3>

{#each gamestate.explainer as explanation}
    <div class="row">
        <div class="{gamestate.keyStates[explanation[0]]}">
            <Tile value="{explanation[0]}" />
        </div>
        <div class="reason">{explanation[1]}</div>
    </div>
{/each}

<style lang="scss">
	.row {
        margin-bottom: 0px;
		margin: 0px 0;
        display: grid;
		grid-template-columns: 15px 2fr;
	}
    .reason {
        margin: 0px 10px;
    }
</style>
