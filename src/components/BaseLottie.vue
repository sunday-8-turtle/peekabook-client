<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';
import lottie from 'lottie-web';
import lottiJson from '../assets/lotties/loading-btn.json?raw';

type LottieName = 'loading-btn';

export default defineComponent({
  name: 'BaseLottie',
  props: {
    name: {
      type: String as PropType<LottieName>,
      required: true,
    },
    height: {
      type: String,
      default: '100%',
    },
    width: {
      type: String,
      default: '100%',
    },
  },
  setup(props) {
    const lottieContainer = ref<InstanceType<typeof HTMLDivElement>>();
    const customSize = {
      width: props.width,
      height: props.height,
    };

    const lottieAssets: { [lottie in LottieName]: string } = {
      'loading-btn': JSON.parse(lottiJson),
    };

    onMounted(() => {
      if (!lottieContainer.value) return;
      lottie.loadAnimation({
        container: lottieContainer.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: lottieAssets[props.name],
      });
    });

    return { lottieContainer, customSize };
  },
});
</script>

<template>
  <div ref="lottieContainer" :style="[customSize]"></div>
</template>

<style lang="scss" scoped></style>
