<script lang="ts">
  import kaplay from "kaplay";
  import { onMount } from "svelte";

  let kaplayContainer: HTMLCanvasElement;
  let clientCharacter: any;

  onMount(() => {
    const kaplayer = kaplay({
      canvas: kaplayContainer,
    });

    return () => {
      kaplayer.quit();
    };
  });

  //loadSprite("butterfly", "../kaplay/sprites/test-sprite-sheet.png");
  //clientCharacter = add([rect(100, 50)]);
</script>

<section id="box-player-wrap">
  <canvas id="kaplay-container" bind:this={kaplayContainer}></canvas>
</section>

<style>
  #box-player-wrap {
    width: 100%;
  }
</style>
