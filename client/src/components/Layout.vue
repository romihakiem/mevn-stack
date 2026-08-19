<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
    authStore.logout();
    router.push("/login");
}
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <header class="border-b border-gray-200 bg-white">
            <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 text-sm font-bold text-white">M</div>
                    <span class="font-semibold text-gray-800">MEVN Skeleton</span>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-500">
                        Halo,
                        <span class="font-medium text-gray-700">{{ authStore.user?.name }}</span>
                    </span>
                    <button @click="handleLogout" class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100">Keluar</button>
                </div>
            </div>
        </header>
        <main class="mx-auto max-w-6xl px-6 py-8">
            <slot />
        </main>
    </div>
</template>
