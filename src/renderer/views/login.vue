<route lang="json5">
{ meta: { empty: true, blurBg: true, transition: { name: "login" } } }
</route>

<template>
    <div class="container">
        <img ref="logo" class="logo" src="/src/renderer/assets/images/BARLogoFull.png" />

        <div v-if="state === 'waiting_for_user'" class="flex-col flex-center-items">
            <Button @click="connect" v-tooltip="'Login on the BAR website'" class="blue login">Login</Button>
            <div class="play-offline" @click="playOffline">Play Offline</div>
        </div>

        <div v-else-if="state === 'waiting_for_auth'" class="flex-col flex-center-items gap-md">
            <Loader :absolutePosition="false"></Loader>
            <p>Please authenticate via your web browser.</p>
            <Button class="retry gap-sm" @click="onRetry">
                <Icon :icon="replayIcon" />
                Retry
            </Button>
        </div>

        <div v-else-if="state === 'connecting'" class="relative">
            <Loader></Loader>
        </div>

        <div v-else-if="state === 'connected'" class="flex-col flex-center-items gap-md">
            <p>Connected!</p>
            <Button @click="playOnline" class="gap-sm"><Icon :icon="playIcon" /> Play</Button>
        </div>

        <div v-else-if="state === 'error'" class="flex-col flex-center-items gap-md">
            <p class="txt-error">
                {{ error }}
            </p>
            <Button class="retry gap-sm" @click="onRetry">
                <Icon :icon="replayIcon" />
                Retry
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import replayIcon from "@iconify-icons/mdi/replay";
import playIcon from "@iconify-icons/mdi/play";
import { Icon } from "@iconify/vue";

import Loader from "@renderer/components/common/Loader.vue";
import Button from "@renderer/components/controls/Button.vue";

const router = useRouter();
const state: Ref<"waiting_for_user" | "waiting_for_auth" | "connecting" | "connected" | "error"> = ref("waiting_for_user");
const error = ref("");

async function connect() {
    try {
        state.value = "connecting";
        state.value = "waiting_for_auth";
        const oauthToken = await window.server.auth();
        console.log(oauthToken);
        // TODO: store token
        await window.server.connect(oauthToken.accessToken);
        console.log("connected to websocket");

        await window.settings.updateSettings({ offline: false });
        state.value = "connected";
        await router.push("/home");
    } catch (err) {
        state.value = "error";
        if (err instanceof Error) {
            if (
                err.message.includes("ECONNREFUSED") ||
                err.message.includes("fetch failed") ||
                err.message.includes("ERR_CONNECTION_REFUSED") ||
                err.message.includes("Failed to fetch")
            ) {
                error.value = `Could not connect to server at ${await window.server.getServerBaseUrl()}`;
            } else {
                error.value = err.message;
                console.error(err);
            }
        } else {
            error.value = "An unknown error occurred when trying to connect to the server.";
            console.error(err);
        }
    }
}

async function onRetry() {
    state.value = "waiting_for_user";
    await connect();
}

async function playOnline() {
    await window.settings.updateSettings({ offline: false });
    await router.push("/home/overview");
}

async function playOffline() {
    await window.server.disconnect();
    await window.settings.updateSettings({ offline: true });
    await router.push("/home/overview");
}

onMounted(async () => {
    const settings = await window.settings.getSettings();
    if ((await window.server.isConnected()) && settings?.loginAutomatically) {
        await playOnline();
    }

    if (settings?.loginAutomatically) {
        await connect();
    }
});
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: calc((100vh - 900px) / 2);
    width: 500px;
    margin-left: auto;
    margin-right: auto;
}

.logo {
    filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.8));
    margin-bottom: 80px;
}

.button {
    align-self: center;

    :deep(.p-button).login {
        font-size: 32px;
        padding: 8px 16px;
    }
}

.play-offline {
    display: flex;
    margin-top: 20px;
    font-size: 32px;
    opacity: 0.3;
    &:hover {
        opacity: 1;
    }
}
</style>
