<template>
    <Control class="range">
        <InputNumber
            v-if="range"
            v-bind="$attrs"
            :modelValue="low"
            @update:modelValue="(input: number) => onInput([input, high])"
            class="min"
        />
        <Slider v-bind="$props" :modelValue="modelValue" @update:modelValue="onSlide" />
        <InputNumber
            v-bind="$attrs"
            :modelValue="typeof modelValue === 'number' ? modelValue : high"
            @update:modelValue="typeof modelValue === 'number' ? onInput : (input: number) => onInput([low, input])"
            class="max"
        />
    </Control>
</template>

<script lang="ts" setup>
import { computed } from "vue";
// https://v3.primevue.org/slider/
import InputNumber from "primevue/inputnumber";
import Slider, { type SliderProps } from "primevue/slider";

import Control from "@renderer/components/controls/Control.vue";

export type Props = SliderProps;

const props = defineProps<Props>();
const emits = defineEmits<{
    (event: "update:modelValue", value: number | number[]): void;
}>();

const low = computed(() => (props.modelValue instanceof Array ? props.modelValue[0] : null));
const high = computed(() => (props.modelValue instanceof Array ? props.modelValue[1] : null));

const minDigits = 3;
const minCurrentDigits = computed(() => props?.min?.toString().match(/\d/g).length ?? 0);
const minInputWidth = computed(() => `${Math.max(minDigits, minCurrentDigits.value) + 2}ch`);
const maxCurrentDigits = computed(() => props?.max?.toString().match(/\d/g).length ?? 0);
const maxInputWidth = computed(() => `${Math.max(minDigits, maxCurrentDigits.value) + 2}ch`);

// const min = computed<number>(() => props?.min ?? 0);
// const minInputWidth = computed(() => `${min.value.toString().length + 1}ch`);
// const max = computed<number>(() => props?.max ?? 100);
// const maxInputWidth = computed(() => `${max.value.toString().length + 1}ch`);

function onSlide(input: number | number[]) {
    emits("update:modelValue", input);
}

function onInput(input: number | number[]) {
    emits("update:modelValue", input);
}
</script>

<style lang="scss" scoped>
.range {
    width: 100%;
    align-self: center;
}
:deep(.p-slider) {
    width: 100%;
    margin: 0 15px;
}
.min :deep(.p-inputtext) {
    width: v-bind(minInputWidth);
    text-align: center;
}
.max :deep(.p-inputtext) {
    width: v-bind(maxInputWidth);
    text-align: center;
}
</style>
