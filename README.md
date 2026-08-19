# MEVN Skeleton — Auth JWT + Master-Detail CRUD (Vue 3)

Skeleton aplikasi MEVN stack (MongoDB, Express, Vue, Node.js) dengan:

- Autentikasi JWT (register, login, `me`, route guard)
- CRUD penuh untuk resource `Item`
- Layout master-detail di frontend (daftar item di kiri, form detail di kanan)
- Styling Tailwind CSS

## Struktur folder

```
mevn-skeleton/
├── server/          # Express + MongoDB (Mongoose) + JWT
│   └── src/
│       ├── config/db.js
│       ├── models/User.js
│       ├── models/Item.js
│       ├── middleware/auth.js
│       ├── controllers/authController.js
│       ├── controllers/itemController.js
│       ├── routes/authRoutes.js
│       ├── routes/itemRoutes.js
│       └── index.js
└── client/           # Vue 3 + Vite + Pinia + Tailwind CSS
    └── src/
        ├── api/axios.js           # instance axios + interceptor JWT
        ├── stores/auth.js         # Pinia store: login, register, logout, me
        ├── router/index.js        # Vue Router + navigation guard
        ├── components/ (Layout, ItemList, ItemDetail)
        ├── views/ (Login, Register, Dashboard)
        ├── App.vue
        └── main.js
```

## Menjalankan backend

```bash
cd server
cp .env.example .env   # sesuaikan MONGO_URI dan JWT_SECRET
npm install
npm run dev            # butuh nodemon, atau pakai: npm start
```

Backend berjalan di `http://localhost:5000`, pastikan MongoDB (lokal atau Atlas) sudah aktif dan `MONGO_URI` di `.env` sudah benar.

## Menjalankan frontend (Vue)

```bash
cd client
cp .env.example .env    # sesuaikan VITE_API_URL bila perlu
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

## Konsep Vue yang dipakai

| Bagian versi sebelumnya               | Padanan di Vue                                                |
| ------------------------------------- | ------------------------------------------------------------- |
| `AuthContext` / Angular `AuthService` | Pinia store `useAuthStore` (`stores/auth.js`)                 |
| axios instance + interceptor          | `api/axios.js` (sama polanya, request/response interceptor)   |
| `PrivateRoute` / `authGuard`          | `router.beforeEach` navigation guard (`meta.requiresAuth`)    |
| `ItemList`, `ItemDetail`              | `ItemList.vue`, `ItemDetail.vue` (Single File Components)     |
| React Router / Angular Router         | Vue Router dengan lazy-loaded route components                |
| `useState` / `FormGroup` form         | `reactive()` + `v-model` (form biasa, tanpa library tambahan) |

## Endpoint API

| Method | Endpoint           | Keterangan                                    | Auth |
| ------ | ------------------ | --------------------------------------------- | ---- |
| POST   | /api/auth/register | Registrasi user baru                          | -    |
| POST   | /api/auth/login    | Login, mengembalikan token JWT                | -    |
| GET    | /api/auth/me       | Data user yang sedang login                   | ✅   |
| GET    | /api/items         | Daftar item (`?search=`, `?page=`, `?limit=`) | ✅   |
| GET    | /api/items/:id     | Detail satu item                              | ✅   |
| POST   | /api/items         | Buat item baru                                | ✅   |
| PUT    | /api/items/:id     | Update item                                   | ✅   |
| DELETE | /api/items/:id     | Hapus item                                    | ✅   |

Semua endpoint ber-`✅` butuh header `Authorization: Bearer <token>`.

## Pagination

`GET /api/items` mendukung pagination lewat query param:

- `page` — nomor halaman (default `1`)
- `limit` — jumlah item per halaman (default `10`, maksimal `100`)

Response-nya menyertakan metadata:

```json
{
  "items": [...],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "hasPrevPage": false,
  "hasNextPage": true
}
```

Di frontend Vue, `Dashboard.vue` menyimpan state `page`/`totalPages` dan mengirim `page`/`limit` di setiap fetch. Komponen baru `Pagination.vue` menampilkan tombol "Sebelumnya"/"Berikutnya" di dalam `ItemList.vue`, otomatis disembunyikan bila hanya ada 1 halaman. Pencarian (`search`) otomatis mereset ke halaman 1.

## Cara mengembangkan lebih lanjut

- Ganti model `Item` (backend) sesuai domain bisnis Anda — frontend tinggal menyesuaikan field di `ItemList.vue` / `ItemDetail.vue`.
- Tambahkan role-based check di Vue dengan membaca `authStore.user?.role`, dipadukan dengan middleware `adminOnly` yang sudah ada di backend.
- Untuk validasi form yang lebih ketat di sisi client, pertimbangkan library seperti VeeValidate atau Zod + `@vueuse/core`.
