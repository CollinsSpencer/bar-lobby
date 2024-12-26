<template>
    <Control class="textbox">
        <IconField>
            <InputIcon class="pi pi-search" />
            <InputText type="text" placeholder="Search" v-bind="$attrs" v-model="model" />
            <slot v-if="showClearIcon" name="clear-icon" :clear="clear">
                <InputIcon class="pi pi-spin pi-times" @mousedown="clear" />
                <!-- <button class="search-icon clear" aria-label="Clear" @mousedown="clear" @keydown.space.enter="clear"></button> -->
            </slot>
        </IconField>
    </Control>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";

import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

import Control from "@renderer/components/controls/Control.vue";

const { clearIcon = true } = defineProps<{ clearIcon?: boolean }>();
const model = defineModel<string>();

const showClearIcon = computed(() => clearIcon && model.value.length > 0);

const clear = function () {
    model.value = "";
};
</script>

<style lang="scss" scoped>
.textbox {
    align-items: unset;
}
.p-inputtext {
    width: 100%;
}
</style>
