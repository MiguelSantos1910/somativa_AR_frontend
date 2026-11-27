<template>
  <nav class="bg-slate-900 text-white shadow-md">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <router-link to="/" class="text-xl font-bold text-white transition hover:text-slate-200">
        Guia AR
      </router-link>

      <ul class="flex items-center gap-4 sm:gap-4">
        <li>
          <router-link
            to="/"
            class="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer hover:bg-slate-800"
            active-class="bg-slate-800 text-sky-400"
          >
            <House :size="16" :stroke-width="1.8" />
            <span>Dashboard</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/circuitos"
            class="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer hover:bg-slate-800"
            active-class="bg-slate-800 text-sky-400"
          >
            <CircuitBoard :size="16" :stroke-width="1.8" />
            <span>Circuitos</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/componentes"
            class="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer hover:bg-slate-800"
            active-class="bg-slate-800 text-sky-400"
          >
            <Component :size="16" :stroke-width="1.8" />
            <span>Componentes</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { CircuitBoard, Component, House } from "lucide-vue-next";
</script>
