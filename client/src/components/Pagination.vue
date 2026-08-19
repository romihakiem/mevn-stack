<script setup>
defineProps({
    page: { type: Number, default: 1 },
    totalPages: { type: Number, default: 1 },
    hasPrevPage: { type: Boolean, default: false },
    hasNextPage: { type: Boolean, default: false },
});

const emit = defineEmits(["page-change"]);
</script>

<template>
    <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 px-4 py-3">
        <button @click="emit('page-change', page - 1)" :disabled="!hasPrevPage"
            class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
            Sebelumnya
        </button>

        <span class="text-sm text-gray-500">
            Halaman <span class="font-medium text-gray-700">{{ page }}</span> dari
            <span class="font-medium text-gray-700">{{ totalPages }}</span>
        </span>

        <button @click="emit('page-change', page + 1)" :disabled="!hasNextPage"
            class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
            Berikutnya
        </button>
    </div>
</template>
