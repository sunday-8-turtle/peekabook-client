import { computed, onMounted, onUnmounted, ref } from 'vue';

export default function useOnScroll() {
  const scrollY = ref(0);
  const isTopOfPage = computed(() => {
    return scrollY.value === 0;
  });

  /**
   * 특정 엘리먼트로 스크롤을 이동한다.
   *
   * @param id 이동할 엘리먼트의 ID Selector
   */
  const scrollIntoView = (id: string): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const onScroll = () => {
    scrollY.value = window.scrollY;
  };
  onMounted(() => window.addEventListener('scroll', onScroll));
  onUnmounted(() => window.removeEventListener('scroll', onScroll));

  return {
    isTopOfPage,
    scrollIntoView,
  };
}
