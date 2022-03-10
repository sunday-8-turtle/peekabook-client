import { computed, onMounted, onUnmounted, ref } from 'vue';

export default function useOnScroll() {
  const scrollY = ref(0);
  const isTopOfPage = computed(() => {
    return scrollY.value === 0;
  });

  const onScroll = () => {
    scrollY.value = window.scrollY;
  };
  onMounted(() => window.addEventListener('scroll', onScroll));
  onUnmounted(() => window.removeEventListener('scroll', onScroll));

  return {
    isTopOfPage,
  };
}
