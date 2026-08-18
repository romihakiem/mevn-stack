<script setup>
import { reactive, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({ email: "", password: "" });
const error = ref("");
const loading = ref(false);

async function handleSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await authStore.login(form.email, form.password);
    router.push("/");
  } catch (err) {
    error.value = err.response?.data?.message || "Gagal login";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-brand-500 font-bold text-white">
          M
        </div>
        <h1 class="text-lg font-semibold text-gray-800">
          Masuk ke akun Anda
        </h1>
      </div>

      <div v-if="error" class="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-600">Email</label>
          <input v-model="form.email" type="email" required class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-600">Password</label>
          <input v-model="form.password" type="password" required class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400" />
        </div>
        <button type="submit" :disabled="loading" class="w-full rounded-md bg-brand-500 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60">
          {{ loading ? "Memproses..." : "Masuk" }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-500">
        Belum punya akun?
        <RouterLink to="/register" class="font-medium text-brand-500 hover:underline">
          Daftar
        </RouterLink>
      </p>
    </div>
  </div>
</template>
