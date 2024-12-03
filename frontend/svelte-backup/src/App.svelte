<script lang="ts">
  import BoxPlayer from "./lib/BoxPlayer.svelte";
  import TestSocket from "./lib/TestSocket.svelte";
</script>

<main id="content-grid">
  <!-- <BoxPlayer /> -->

  <TestSocket />
</main>

<style>
  #content-grid {
    display: grid;

    width: 100%;
    height: 100%;
  }

  .card {
    margin: 0;
    padding: 0;
  }
</style>
