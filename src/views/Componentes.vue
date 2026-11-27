<template>
  <p v-if="error" class="m-6 rounded bg-red-100 p-3 text-red-700">{{ erro }}</p>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
    <Card
    v-for="c in componentes"
    :key="c.id"
    :titulo="c.titulo"
    :descricao="c.descricao"
    :imagem="c.imagem"
    class="!border-l-[15px] !border-sky-500 mt-10 px-1 transition cursor-pointer hover:bg-sky-50 flex flex-col"
  />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import Card from "../components/Card.vue"

const componentes = ref([])
const API = import.meta.env.VITE_API_URL

onMounted(async () => {
    try {
        const response = await fetch(`${API}/componentes`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        componentes.value = await response.json()
    } catch (e) {
        error.value = `Erro ao buscar os componentes: ${e.message}`
    }
})
</script>
