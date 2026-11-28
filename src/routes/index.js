import { createRouter, createWebHistory } from "vue-router"

import Home from "../views/Home.vue";
import Circuitos from "../views/Circuitos.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/circuitos',
        name: 'circuitos',
        component: Circuitos
    },
    {
        path: '/ar',
        name: 'ar',
        // Carrega o MindAR/Three.js só ao abrir a página do AR
        component: () => import("../views/AR.vue"),
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router