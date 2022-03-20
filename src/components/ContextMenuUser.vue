<script lang="ts">
import { defineComponent, ref } from 'vue';
import useAuthStore from '@/store/auth.store';
import { useRouter } from 'vue-router';
import BaseContextMenu from '@/components/BaseContextMenu.vue';
import BaseContextMenuItem from '@/components/BaseContextMenuItem.vue';
import { useOnClickOutside } from '@/composables';

export default defineComponent({
  name: 'ContextMenuUser',
  components: { BaseContextMenu, BaseContextMenuItem },
  props: {},
  setup() {
    const $authStore = useAuthStore();
    const $router = useRouter();

    const baseContextMenu = ref<InstanceType<typeof BaseContextMenu>>();
    // useOnClickOutside(contextMenu.value, contextMenu.value?.close());

    const toggle = () => {
      console.log('여기왔다');
      baseContextMenu.value?.toggle();
    };
    const onLogout = () => {
      $authStore.logout();
      $router.push({ name: 'LandingPageView' });
    };
    const goToProfile = () => {
      $router.push({ name: 'ProfileView' });
    };
    return {
      toggle,
      onLogout,
      goToProfile,
    };
  },
});
</script>

<template>
  <BaseContextMenu ref="baseContextMenu">
    <BaseContextMenuItem @click="goToProfile">
      계정 정보 설정
    </BaseContextMenuItem>
    <BaseContextMenuItem @click="onLogout"> 로그아웃 </BaseContextMenuItem>
  </BaseContextMenu>
</template>

<style lang="scss" scoped></style>
