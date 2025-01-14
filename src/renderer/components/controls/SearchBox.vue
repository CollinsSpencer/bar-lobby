<template>
    <Control class="textbox">
        <IconField>
            <InputIcon class="pi pi-search" />
            <InputText type="text" placeholder="Search" v-bind="$attrs" v-model="model" />
            <slot v-if="showClearIcon" name="clear-icon" :clear="clear">
                <InputIcon class="pi pi-times" @mousedown="clear" aria-label="Clear" />
            </slot>
        </IconField>
    </Control>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import InputText, { type InputTextProps } from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

import Control from "@renderer/components/controls/Control.vue";

interface SearchBoxProps extends /* @vue-ignore */ InputTextProps {
    clearIcon?: boolean;
}
const { clearIcon = true, disabled } = defineProps<SearchBoxProps>();
const model = defineModel<string>();

const showClearIcon = computed(() => clearIcon && model.value.length > 0);

const clear = function () {
    if (!disabled) model.value = "";
};
</script>

<style lang="scss" scoped></style>
