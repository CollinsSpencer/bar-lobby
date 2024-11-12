<route lang="json5">
{ meta: { empty: true } }
</route>

<template>
    <div />
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
router.replace("/login");
</script>

<style lang="scss" scoped></style>
