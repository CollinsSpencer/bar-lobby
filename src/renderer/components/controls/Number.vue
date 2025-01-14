<template>
    <Control class="number">
        <InputNumber v-bind="$attrs" v-model="model">
            <template v-for="(_, name) in $slots" v-slot:[name]="slotData"><slot :name="name" v-bind="slotData" /></template>
        </InputNumber>
    </Control>
</template>

<script lang="ts" setup>
import InputNumber, { InputNumberSlots } from "primevue/inputnumber";
import { computed } from "vue";

import Control from "@renderer/components/controls/Control.vue";

defineSlots<InputNumberSlots>();
const model = defineModel<number | null | undefined>();

const minDigits = 3;
const currentDigits = computed(() => model.value?.toString().match(/\d/g).length ?? 0);
const inputWidth = computed(() => `${Math.max(minDigits, currentDigits.value)}ch`);
</script>

<style lang="scss" scoped>
:deep(.p-inputgroup .p-inputnumber) {
    flex: 0 1 content;
}
:deep(.p-inputgroup .p-inputtext) {
    box-sizing: content-box;
    width: v-bind(inputWidth);
    text-align: center;
}
</style>
