<script lang="ts">
    import { onMount } from "svelte";
    import game from "./Game";
    import P5 from "p5";

    onMount(() => { new P5(game); });
</script>

<main>
    <h1>App.svelte</h1>
    <p>Drag your mouse to spawn blocks</p>
</main>

<style>
</style>
