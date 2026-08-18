import { defineStore } from "pinia";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: JSON.parse(localStorage.getItem("user") || "null"),
        loading: true,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        async fetchCurrentUser() {
            const token = localStorage.getItem("token");
            if (!token) {
                this.loading = false;
                return;
            }
            try {
                const res = await api.get("/auth/me");
                this.user = res.data.user;
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                this.user = null;
            } finally {
                this.loading = false;
            }
        },

        async login(email, password) {
            const res = await api.post("/auth/login", { email, password });
            this.persistSession(res.data);
            return res.data.user;
        },

        async register(name, email, password) {
            const res = await api.post("/auth/register", {
                name,
                email,
                password,
            });
            this.persistSession(res.data);
            return res.data.user;
        },

        persistSession({ token, user }) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            this.user = user;
        },

        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            this.user = null;
        },
    },
});
