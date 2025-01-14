<template>
    <Control class="range">
        <InputNumber
            v-if="range"
            v-bind="$attrs"
            :disabled="$props.disabled"
            :modelValue="low"
            @update:modelValue="(input: number) => onInput([input, high])"
            class="min"
        />
        <InputGroupAddon class="slider-wrapper">
            <Slider v-bind="$props" :modelValue="modelValue" @update:modelValue="onSlide" />
        </InputGroupAddon>
        <InputNumber
            v-bind="$attrs"
            :disabled="$props.disabled"
            :modelValue="typeof modelValue === 'number' ? modelValue : high"
            @update:modelValue="typeof modelValue === 'number' ? onInput : (input: number) => onInput([low, input])"
            class="max"
        />
    </Control>
</template>

<script lang="ts" setup>
// https://primevue.org/slider/

import { computed } from "vue";
import InputNumber from "primevue/inputnumber";
import Slider, { type SliderProps } from "primevue/slider";
import InputGroupAddon from "primevue/inputgroupaddon";

import Control from "@renderer/components/controls/Control.vue";

export type Props = SliderProps;

const props = defineProps<Props>();
const emits = defineEmits<{
    (event: "update:modelValue", value: number | number[]): void;
}>();

const low = computed(() => (props.modelValue instanceof Array ? props.modelValue[0] : null));
const high = computed(() => (props.modelValue instanceof Array ? props.modelValue[1] : null));

const minDigits = 2;
const minCurrentDigits = computed(() => props?.min?.toString().match(/\d/g).length ?? 0);
const minInputWidth = computed(() => `${Math.max(minDigits, minCurrentDigits.value)}ch`);
const maxCurrentDigits = computed(() => props?.max?.toString().match(/\d/g).length ?? 0);
const maxInputWidth = computed(() => `${Math.max(minDigits, maxCurrentDigits.value)}ch`);

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
.slider-wrapper {
    flex: 1;
}
:deep(.p-slider) {
    width: 100%;
    margin: 0 15px;
}
:deep(.p-inputgroup .p-inputnumber) {
    flex: 0 1 content;
}
:deep(.min.p-inputnumber .p-inputtext) {
    box-sizing: content-box;
    width: v-bind(minInputWidth);
    text-align: center;
    flex: 0;
}
:deep(.max.p-inputnumber .p-inputtext) {
    box-sizing: content-box;
    width: v-bind(maxInputWidth);
    text-align: center;
    flex: 0;
}
</style>
