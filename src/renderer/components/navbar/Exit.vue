<template>
    <Modal ref="modal" title="Exit">
        <div class="flex-row gap-md">
            <Button @click="login" v-if="offline && !onLoginPage"> Login </Button>
            <Button @click="logout" v-if="!offline && !onLoginPage"> Logout </Button>
            <Button @click="quitToDesktop"> Quit to Desktop </Button>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";

import Modal from "@renderer/components/common/Modal.vue";
import Button from "@renderer/components/controls/Button.vue";

const router = useRouter();
const currentRoute = router.currentRoute;
const onLoginPage = computed(() => currentRoute.value.path === "/login");
const modal: Ref<InstanceType<typeof Modal> | null> = ref(null);
const offline = ref(true);

onMounted(async () => {
    try {
        const settings = await window.settings.getSettings();
        offline.value = settings.offline;
    } catch (err) {
        console.error(err);
    }
    window.settings.onSettingsUpdate((settings) => {
        offline.value = settings.offline;
    });
});

async function login() {
    try {
        await window.settings.updateSettings({ offline: true });
    } catch (err) {
        console.error(err);
    }
    await router.push("/login");
    modal.value?.close();
}

async function logout() {
    try {
        if (!offline.value) {
            await window.server.disconnect();
        }
    } catch (err) {
        console.error(err);
    }
    await router.push("/login");
    modal.value?.close();
}

async function quitToDesktop() {
    window.close();
}
</script>

<style lang="scss" scoped></style>
