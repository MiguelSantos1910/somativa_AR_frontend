<template>
    <div class="bg-slate-100 border-l-[15px] border-sky-500 px-5 py-10 mt-5">
        <h1 class="text-xl font-bold text-slate-900 mb-2">Realidade Aumentada</h1>
        <p class="font-normal">A Realidade Aumentada é uma tecnologia que permite combinar elementos do
            ambiente físico com elementos do ambiente virtual, gerados por computadores. Os
            dispositivos de Realidade Aumentada (RA) podem ser equipados em câmeras, óculos,
            sensores, displays, tablets, notebooks e diversos outros dispositivos.
        </p>
    </div>

    <div class="bg-slate-100 border-l-[15px] border-sky-500 px-5 py-10 mt-5">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Como usar</h2>
        <ol class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <li v-for="(p, i) in passos" :key="p.titulo" class="flex gap-3">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                    {{ i + 1 }}
                </span>
                <div>
                    <p class="font-semibold text-slate-900">{{ p.titulo }}</p>
                    <p class="text-sm text-gray-600">{{ p.texto }}</p>
                </div>
            </li>
        </ol>

        <router-link
            to="/ar"
            class="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-sky-500 px-6 py-3 font-medium text-white transition hover:bg-sky-600 active:scale-95"
        >
            <Camera :size="20" :stroke-width="1.8" />
            Iniciar AR
        </router-link>
    </div>
</template>

<script setup>
import { Camera } from "lucide-vue-next"

const passos = [
    { titulo: "Imprima o marcador", texto: "Imprima a imagem do circuito que deseja estudar." },
    { titulo: "Abra a câmera", texto: "Acesse o app pelo celular e permita o uso da câmera." },
    { titulo: "Aponte e explore", texto: "O modelo 3D aparece sobre o marcador com as instruções." },
]
</script>
