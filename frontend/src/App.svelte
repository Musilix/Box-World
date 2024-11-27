<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import BoxPlayer from './lib/BoxPlayer.svelte'
  import kaplay from "https://unpkg.com/kaplay@3001/dist/kaplay.mjs";
</script>

<main>
  <h1>Welcome to Box World</h1>

  <div class = 'card'>
    <BoxPlayer/>
  </div>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
