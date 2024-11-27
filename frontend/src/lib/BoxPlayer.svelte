<script>
  let loaded = $state(false);

  setTimeout(() => (loaded = true), 1000);
</script>

<section id="box-player-wrap">
  <p>Player loaded: {loaded}</p>
</section>
