<template>
    <Control class="textbox" :for="$props.id">
        <InputText type="text" v-bind="$attrs" />
    </Control>
</template>

<script lang="ts" setup>
import InputText, { type InputTextProps } from "primevue/inputtext";
import Control from "@renderer/components/controls/Control.vue";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Props extends /* @vue-ignore */ InputTextProps {}
defineProps<Props>();
</script>

<style lang="scss" scoped>
// .textbox {
//     align-items: unset;
// }
// .p-inputtext {
//     width: 100%;
// }
</style>
