<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
    <Card
    v-for="c in componentes"
    :key="c.id"
    :titulo="c.titulo"
    :descricao="c.descricao"
    :imagem="c.imagem"
    class="!border-l-[15px] !border-sky-500 mt-10 px-1 transiton cursor-pointer hover:bg-sky-50 flex flex-col"
  />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import Card from "../components/Card.vue"

const componentes = ref([])

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3000/componentes")
    componentes.value = await response.json()
  } catch (error) {
    alert(`Erro ao buscar os circuitos: ${error}`)
  }
})
</script>
