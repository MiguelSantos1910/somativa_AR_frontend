<template>
    <p v-if="error" class="m-6 rounded bg-red-100 p-3 text-red-700">{{ error }}</p>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
        <Card
        v-for="c in circuitos"
        :key="c.id"
        :titulo="c.titulo"
        :descricao="c.descricao"
        :imagem="c.imagem"
        class="!border-l-[15px] !border-sky-500 mt-10 px-1 transition hover:bg-sky-50 flex flex-col"
        >
            <button
                v-if="c.modelo"
                type="button"
                class="mt-2 flex items-center justify-center gap-2 rounded-md bg-sky-500 cursor-pointer px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600 active:scale-95"
                @click="selecionado = c"
            >
                <Box :size="16" :stroke-width="1.8" />
                Visualizar modelo
            </button>
            <a
                v-if="c.target"
                :href="c.target"
                target="_blank"
                rel="noopener"
                class="flex items-center justify-center gap-2 rounded-md border border-sky-500 px-4 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-100 active:scale-95"
            >
                <ScanLine :size="16" :stroke-width="1.8" />
                Abrir target
            </a>
        </Card>
    </div>

    <!-- Modal do modelo 3D -->
    <div
        v-if="selecionado"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click.self="fechar"
    >
        <div class="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-lg border-l-[15px] border-sky-500">
            <div class="flex items-center justify-between border-b border-gray-200 px-5 py-3">
                <h2 class="text-lg font-semibold text-gray-900">{{ selecionado.titulo }}</h2>
                <button
                    type="button"
                    class="rounded-md p-1 text-gray-600 transition hover:bg-slate-100"
                    aria-label="Fechar"
                    @click="fechar"
                >
                    <X :size="20" />
                </button>
            </div>
            <div class="flex-1 bg-slate-100">
                <ModelViewer :key="selecionado.id" :modelo="selecionado.modelo" />
            </div>
            <p class="px-5 py-2 text-center text-xs text-gray-600">
                Arraste para girar · Role ou use dois dedos para aproximar
            </p>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, defineAsyncComponent } from "vue"
import { Box, ScanLine, X } from "lucide-vue-next"
import Card from "../components/Card.vue"

// Carrega o Three.js só quando o modal for aberto
const ModelViewer = defineAsyncComponent(() => import("../components/ModelViewer.vue"))

const circuitos = ref([])
const error = ref("")
const selecionado = ref(null)
const API = import.meta.env.VITE_API_URL

const fechar = () => {
    selecionado.value = null
}

const fecharComEsc = (e) => {
    if (e.key === "Escape") fechar()
}

onMounted(async () => {
    window.addEventListener("keydown", fecharComEsc)
    try {
        const response = await fetch(`${API}/circuitos`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        circuitos.value = await response.json()
    } catch (e) {
        error.value = `Erro ao buscar os circuitos: ${e.message}`
    }
})

onBeforeUnmount(() => {
    window.removeEventListener("keydown", fecharComEsc)
})
</script>
