<template>
  <div class="home">
    <HelloWorld />
    <BaseInput />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import BaseInput from '@/components/BaseInput.vue';

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
    BaseInput,
  },
  setup() {
    console.log('testing');
  },
});
</script>
