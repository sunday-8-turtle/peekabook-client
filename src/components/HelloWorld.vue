<template>
  <div>
    <BaseInput :type="'text'" :isBtnRequired="true" />
    <br /><br />
    <BaseButton :shape="'fill'"> 회원가입 </BaseButton>
    <br /><br />
    <BaseButton :shape="'line'"> 로그인 </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  components: {
    BaseInput,
    BaseButton,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
