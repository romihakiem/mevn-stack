<script setup>
import { reactive, watch, ref } from "vue";

const props = defineProps({
  item: { type: Object, default: null },
  isNew: { type: Boolean, default: false },
});

const emit = defineEmits(["save", "delete", "cancel"]);

const emptyForm = () => ({
  name: "",
  description: "",
  category: "",
  price: 0,
  stock: 0,
  status: "active",
});

const form = reactive(emptyForm());
const saving = ref(false);

watch(
  () => props.item,
  (item) => {
    if (item) {
      Object.assign(form, {
        name: item.name || "",
        description: item.description || "",
        category: item.category || "",
        price: item.price || 0,
        stock: item.stock || 0,
        status: item.status || "active",
      });
    } else {
      Object.assign(form, emptyForm());
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  saving.value = true;
  try {
    await emit("save", { ...form }, props.item?._id);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div v-if="!item && !isNew" class="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-400">
    Pilih item di sebelah kiri, atau klik "+ Tambah" untuk membuat item baru
  </div>

  <div v-else class="h-full rounded-lg border border-gray-200 bg-white">
    <div class="flex items-center justify-between border-b border-gray-200 p-4">
      <h2 class="font-semibold text-gray-800">
        {{ isNew ? "Item Baru" : "Detail Item" }}
      </h2>
      <button v-if="!isNew" @click="emit('delete', item._id)" class="text-sm font-medium text-red-500 transition hover:text-red-600">
        Hapus
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-600">Nama</label>
        <input v-model="form.name" required class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400" />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-600">Deskripsi</label>
        <textarea v-model="form.description" rows="3" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-600">Kategori</label>
          <input v-model="form.category" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-600">Status</label>
          <select v-model="form.status" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400">
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-600">Harga</label>
          <input v-model.number="form.price" type="number" min="0" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-600">Stok</label>
          <input v-model.number="form.stock" type="number" min="0" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400" />
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" @click="emit('cancel')" class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100">
          Batal
        </button>
        <button type="submit" :disabled="saving" class="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60">
          {{ saving ? "Menyimpan..." : "Simpan" }}
        </button>
      </div>
    </form>
  </div>
</template>
