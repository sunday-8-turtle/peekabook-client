import { onMounted, onUnmounted, Ref } from 'vue';

/**
 * 특정 엘리먼트의 바깥을 클릭했을 때 발생할 이벤트를 설정한다.
 *
 * @param insideElem '안쪽(Inside)'에 해당하는 엘리먼트 (=> 클릭 방지할 구역)
 * @param callback '바깥(Outside)'를 클릭했을 때 수행할 콜백 함수
 */
export default function useOnClickOutside(
  insideElem: Ref<HTMLElement | undefined>,
  callback: () => void
): void {
  const onClick = (e: MouseEvent) => {
    const clickedElem = e.target as HTMLElement;

    // 엘리먼트 '안쪽'를 클릭하면 Return, '바깥'을 클릭하면 건네받은 콜백 함수 실행
    if (insideElem.value?.contains(clickedElem)) return;
    callback();
  };

  onMounted(() => window.addEventListener('mouseup', onClick));
  onUnmounted(() => window.removeEventListener('mouseup', onClick));
}
