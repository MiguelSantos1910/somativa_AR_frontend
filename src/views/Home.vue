<template>
    <section class="bg-slate-50 py-5 mt-5">
        <div class="mx-2 max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 class="text-3x1 font-bold tracking-tight text-slate-900">
                Realidade Aumentada
            </h2>
            <p class="mt-2 justify-items-start text-slate-600">
                A Realidade Aumentada é uma tecnologia que permite combinar elementos do 
                ambiente físico com elementos do ambiente virtual, gerados por computadores. Os
                dispositivos de Realidade Aumentada (RA) podem ser equipados em câmeras, óculos,
                sensores, displays, tablets, notebooks e diversos outros dispositivos.
            </p>
        </div>
</section>
    <Card
        :titulo="titulo"
        :descricao="descricao"
        class="mt-5"
    />
</template>
<script setup>
import Card from "../components/Card.vue"
const titulo = "Exemplos de componentes em Realidade Aumentada"
const descricao = "Descrição do exemplo"
</script>