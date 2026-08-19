<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Layout from "../components/Layout.vue";
import ItemList from "../components/ItemList.vue";
import ItemDetail from "../components/ItemDetail.vue";
import api from "../api/axios";

const ITEMS_PER_PAGE = 10;

const items = ref([]);
const selected = ref(null);
const isNew = ref(false);
const search = ref("");
const loading = ref(true);
const error = ref("");

const page = ref(1);
const totalPages = ref(1);
const hasPrevPage = ref(false);
const hasNextPage = ref(false);

let debounceTimer = null;

async function fetchItems(q = search.value, p = page.value) {
    loading.value = true;
    try {
        const res = await api.get("/items", {
            params: { ...(q ? { search: q } : {}), page: p, limit: ITEMS_PER_PAGE },
        });
        items.value = res.data.items;
        page.value = res.data.page;
        totalPages.value = res.data.totalPages;
        hasPrevPage.value = res.data.hasPrevPage;
        hasNextPage.value = res.data.hasNextPage;
    } catch (err) {
        error.value = err.response?.data?.message || "Gagal memuat data";
    } finally {
        loading.value = false;
    }
}

onMounted(() => fetchItems());

watch(search, (value) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        page.value = 1;
        fetchItems(value, 1);
    }, 300);
});

function handlePageChange(nextPage) {
    if (nextPage < 1 || nextPage > totalPages.value) return;
    fetchItems(search.value, nextPage);
}

function handleSelect(item) {
    selected.value = item;
    isNew.value = false;
}

function handleNew() {
    selected.value = null;
    isNew.value = true;
}

function handleCancel() {
    selected.value = null;
    isNew.value = false;
}

async function handleSave(form, id) {
    if (id) {
        const res = await api.put(`/items/${id}`, form);
        items.value = items.value.map((it) => (it._id === id ? res.data.item : it));
        selected.value = res.data.item;
    } else {
        const res = await api.post("/items", form);
        selected.value = res.data.item;
        isNew.value = false;
        // Item baru muncul paling atas (sort createdAt desc), jadi kembali ke halaman 1
        await fetchItems(search.value, 1);
    }
}

async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    await api.delete(`/items/${id}`);
    selected.value = null;
    // Jika item terakhir di halaman ini dihapus, mundur satu halaman
    const isLastItemOnPage = items.value.length === 1 && page.value > 1;
    const targetPage = isLastItemOnPage ? page.value - 1 : page.value;
    await fetchItems(search.value, targetPage);
}

const selectedId = computed(() => selected.value?._id ?? null);
</script>

<template>
    <Layout>
        <div class="mb-6">
            <h1 class="text-xl font-semibold text-gray-800">Dashboard Item</h1>
            <p class="text-sm text-gray-500">Kelola data item Anda — pilih dari daftar untuk melihat detail.</p>
        </div>

        <div v-if="error" class="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {{ error }}
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-[360px_1fr]" style="min-height: 60vh">
            <ItemList :items="items" :selected-id="selectedId" :search="search" :page="page" :total-pages="totalPages" :has-prev-page="hasPrevPage" :has-next-page="hasNextPage" @select="handleSelect" @new="handleNew"
                @update:search="search = $event" @page-change="handlePageChange" />
            <ItemDetail :item="selected" :is-new="isNew" @save="handleSave" @delete="handleDelete" @cancel="handleCancel" />
        </div>

        <p v-if="loading" class="mt-4 text-center text-sm text-gray-400">Memuat data...</p>
    </Layout>
</template>
