<script lang="ts">
  let { body } = $props();
</script>

<div class="chat-message">
  <h4>Anon</h4>
  <p>{body}</p>
</div>

<style>
  .chat-message {
    border-radius: 5px;

    background-color: white;
    text-align: left;
    padding: 1px 2.5px 2.5px 2.5px;
    margin: 2.5px;
  }
</style>
