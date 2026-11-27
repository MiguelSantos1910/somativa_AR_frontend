import { createRouter, createWebHistory } from "vue-router"

import Home from "../views/Home.vue";
import Circuitos from "../views/Circuitos.vue";
import Componentes from "../views/Componentes.vue";

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
        path: '/componentes',
        name: 'componentes',
        component: Componentes,
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router