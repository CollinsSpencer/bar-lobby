<template>
    <Control class="number">
        <InputNumber v-bind="$attrs" v-model="model" />
    </Control>
</template>

<script lang="ts" setup>
import InputNumber, { InputNumberProps } from "primevue/inputnumber";
import { computed, ref } from "vue";

import Control from "@renderer/components/controls/Control.vue";

defineProps<InputNumberProps>();
const model = defineModel<number>();

const minDigits = 3;
const currentDigits = computed(() => model.value?.toString().match(/\d/g).length ?? 0);
const inputWidth = computed(() => `${Math.max(minDigits, currentDigits.value)}ch`);
</script>

<style lang="scss" scoped>
:deep(.p-inputtext) {
    box-sizing: content-box;
    width: v-bind(inputWidth);
}
</style>
