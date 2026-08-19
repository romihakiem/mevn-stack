import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes = [
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue"),
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/Register.vue"),
    },
    {
        path: "/",
        name: "dashboard",
        component: () => import("../views/Dashboard.vue"),
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated && !localStorage.getItem("token")) {
        return { name: "login" };
    }
    return true;
});

export default router;
