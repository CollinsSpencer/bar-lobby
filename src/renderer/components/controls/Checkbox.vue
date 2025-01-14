<template>
    <Control class="checkbox">
        <ToggleButton v-bind="$attrs" v-model="checked">
            <span class="icon pi pi-check" v-if="checked" />
            <span class="icon" v-else></span>
        </ToggleButton>
    </Control>
</template>

<script lang="ts" setup>
import Control from "@renderer/components/controls/Control.vue";
import ToggleButton from "primevue/togglebutton";

const checked = defineModel<boolean>();
</script>

<style lang="scss" scoped>
:deep(.p-togglebutton) {
    padding: 0.75rem;
}
.icon {
    width: var(--p-icon-size);
    height: var(--p-icon-size);
}
</style>
