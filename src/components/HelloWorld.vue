<template>
  <div>
    <button @click="openModal">모달 열자</button>
    <BaseInput :type="'text'" :isBtnRequired="true" />
    <BaseButton :shape="'fill'"> 회원가입 </BaseButton>
    <br /><br />
    <BaseButton :shape="'line'"> 로그인 </BaseButton>

    <BaseModal ref="modal" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseModal from '@/components/BaseModal.vue';

export default defineComponent({
  name: 'HelloWorld',
  components: {
    BaseInput,
    BaseButton,
    BaseModal,
  },
  setup() {
    const modal = ref<InstanceType<typeof BaseModal>>();

    return {
      modal,
    };
  },
  methods: {
    openModal() {
      if (!this.modal) return;
      this.modal.open();
    },
  },
});
</script>

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
