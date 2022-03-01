import { Ref } from 'vue';

/**
 *
 * @param insideElem '안쪽(Inside)'에 해당하는 엘리먼트 (=> 클릭 방지할 구역)
 * @param callback '바깥(Outside)'를 클릭했을 때 수행할 콜백 함수
 */
export default function useOnClickOutside(
  insideElem: Ref<HTMLElement | undefined>,
  callback: () => void
): void {
  window.addEventListener('mouseup', (e: Event) => {
    const clickedElem = e.target as HTMLElement;

    // '안쪽 엘리먼트'를 클릭하면 Return, 바깥을 클릭하면 콜백 함수 실행
    if (insideElem.value?.contains(clickedElem)) return;
    callback();
  });
}
