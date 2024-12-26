<template>
    <Control class="select">
        <Select class="w-full" :autoFilterFocus="true" :autoOptionFocus="true" :resetFilterOnHide="true" v-bind="$attrs" />
    </Control>
</template>

<script lang="ts" setup>
import Select from "primevue/select";
import Control from "@renderer/components/controls/Control.vue";
</script>

<style lang="scss"></style>
