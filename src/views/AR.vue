<template>
    <!-- "isolate" é necessário: o MindAR põe o vídeo da câmera com z-index -2,
         e sem isso ele fica escondido atrás do fundo preto -->
    <div ref="container" class="relative isolate h-[calc(100vh-64px)] w-full overflow-hidden bg-black">
        <!-- Circuito reconhecido + alertas -->
        <div
            v-if="encontrado"
            class="absolute left-4 right-4 top-4 z-10 rounded-xl bg-white/90 px-5 py-3 shadow-lg border-l-[15px] border-sky-500"
        >
            <p class="text-sm text-gray-600">Circuito reconhecido</p>
            <p class="text-lg font-semibold text-gray-900">{{ encontrado.titulo }}</p>

            <ul v-if="encontrado.alertas?.length" class="mt-2 flex flex-col gap-1">
                <li
                    v-for="a in encontrado.alertas"
                    :key="a.texto"
                    class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium"
                    :class="classeAlerta[a.tipo] ?? classeAlerta.info"
                >
                    <TriangleAlert :size="16" :stroke-width="2" class="shrink-0" />
                    {{ a.texto }}
                </li>
            </ul>
        </div>

        <!-- Dica enquanto nenhum marcador é encontrado -->
        <p
            v-else-if="iniciado"
            class="absolute bottom-6 left-4 right-4 z-10 rounded-xl bg-black/60 px-4 py-3 text-center text-sm text-white"
        >
            Aponte a câmera para o marcador do circuito
        </p>
    </div>
    <p v-if="error" class="m-6 rounded bg-red-100 p-3 text-red-700">{{ error }}</p>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { TriangleAlert } from "lucide-vue-next"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js"
import { criarSeta, criarAlertas, animarEfeitos, liberar } from "../ar/efeitos.js"

const container = ref(null)
const error = ref("")
const encontrado = ref(null)
const iniciado = ref(false)
const API = import.meta.env.VITE_API_URL

const classeAlerta = {
    perigo: "bg-red-600 text-white",
    atencao: "bg-amber-400 text-gray-900",
    info: "bg-sky-500 text-white",
}

let mindar
let destruido = false
const setas = []
const paineisAlerta = []

// Ajusta o modelo para ficar do tamanho do marcador (no MindAR, 1 = largura da imagem)
const ajustarAoMarcador = (model) => {
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const escala = 1 / Math.max(size.x, size.y, size.z)
    model.scale.setScalar(escala)
    model.position.sub(center.multiplyScalar(escala))
}

onMounted(async () => {
    try {
        // 1. Busca os circuitos (a ordem é a mesma do .mind)
        const response = await fetch(`${API}/circuitos`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const circuitos = await response.json()
        if (destruido) return

        // 2. Inicia o MindAR com o arquivo de targets
        mindar = new MindARThree({
            container: container.value,
            imageTargetSrc: "/targets/targets.mind",
            uiScanning: "no",
        })
        const { renderer, scene, camera } = mindar
        scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5))
        const sol = new THREE.DirectionalLight(0xffffff, 1)
        sol.position.set(0, 1, 2)
        scene.add(sol)

        // 3. Liga cada target ao seu modelo, setas e alertas
        const draco = new DRACOLoader()
        draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/")
        const loader = new GLTFLoader()
        loader.setDRACOLoader(draco)

        circuitos.forEach((c, i) => {
            const anchor = mindar.addAnchor(i)

            if (c.modelo) {
                loader.load(c.modelo, (gltf) => {
                    ajustarAoMarcador(gltf.scene)
                    anchor.group.add(gltf.scene)
                })
            }

            // Setas direcionais
            ;(c.setas ?? []).forEach((dados) => {
                const seta = criarSeta(dados)
                setas.push(seta)
                anchor.group.add(seta)
            })

            // Alertas visuais flutuando acima do modelo
            if (c.alertas?.length) {
                const painel = criarAlertas(c.alertas)
                paineisAlerta.push(painel)
                anchor.group.add(painel)
            }

            anchor.onTargetFound = () => (encontrado.value = c)
            anchor.onTargetLost = () => {
                if (encontrado.value?.id === c.id) encontrado.value = null
            }
        })

        // 4. Liga a câmera e o loop de animação
        await mindar.start()
        if (destruido) return pararAR()
        iniciado.value = true

        const relogio = new THREE.Clock()
        renderer.setAnimationLoop(() => {
            animarEfeitos(setas, paineisAlerta, relogio.getElapsedTime())
            renderer.render(scene, camera)
        })
    } catch (e) {
        error.value = `Erro ao iniciar o AR: ${e.message ?? e}`
    }
})

const pararAR = () => {
    if (!mindar) return
    mindar.renderer.setAnimationLoop(null)
    mindar.stop()
    ;[...setas, ...paineisAlerta].forEach(liberar)
    mindar.renderer.dispose()
    mindar = null
}

onBeforeUnmount(() => {
    destruido = true
    pararAR()
})
</script>
