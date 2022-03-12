import { DirectiveBinding } from 'vue';

/**
 * 요소의 내부 텍스트 길이를 제한하는 커스텀 디렉티브입니다.
 * 최대 길이 이상일 경우 뒤에 '...' 표시가 붙습니다.
 * @param binding 추가적인 인자를 받아서 처리할 수 있습니다. - 예시) v-truncate:8
 */
const truncate = {
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    let innerText = el.innerText;
    const maxLength = binding.arg ? binding.arg : 8;

    if (innerText.length >= maxLength) {
      innerText = innerText.slice(0, 7) + '...';
    }

    el.innerText = innerText;
  },
};

export default truncate;
