<template>
    <div class="control">
        <InputGroup :class="{ disabled }" @mouseenter="onMouseEnter">
            <InputGroupAddon v-if="label">
                <label :for="props.for" class="label">{{ label }}</label>
            </InputGroupAddon>
            <slot />
        </InputGroup>
    </div>
</template>

<script lang="ts" setup>
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import { audioApi } from "@renderer/audio/audio";

const props = defineProps<{
    label?: string;
    for?: string;
    disabled?: boolean;
}>();

function onMouseEnter() {
    audioApi.play("button-hover");
}
</script>

<style lang="scss" scoped>
.control {
    display: flex;
    align-self: stretch;
    align-items: center;
    justify-self: flex-start;
    // background-color: rgba(255, 255, 255, 0.1);
    // border: 1px solid rgba(255, 255, 255, 0.1);
    // &:hover {
    //     background-color: rgba(255, 255, 255, 0.2);
    //     border-color: rgba(255, 255, 255, 0.2);
    // }
    // .label {
    //     padding: 5px 10px;
    //     border-radius: 0px;
    //     border-right: 1px solid rgba(255, 255, 255, 0.1);
    //     align-self: stretch;
    //     align-items: center;
    //     justify-content: center;
    //     display: flex;
    //     white-space: nowrap;
    // }
    // &.disabled {
    //     opacity: 0.5;
    //     pointer-events: none;
    // }
    // &.dark {
    //     background-color: rgba(0, 0, 0, 0.1);
    //     border: 1px solid rgba(255, 255, 255, 0.1);
    //     &:hover {
    //         background-color: rgba(0, 0, 0, 0.3);
    //         border-color: rgba(255, 255, 255, 0.1);
    //     }
    // }
}
</style>
