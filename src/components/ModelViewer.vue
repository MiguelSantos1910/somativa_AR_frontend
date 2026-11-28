<template>
    <div class="relative h-full w-full">
        <div ref="container" class="h-full w-full"></div>

        <div v-if="carregando" class="absolute inset-0 flex items-center justify-center text-sm text-gray-600">
            Carregando modelo... {{ progresso }}%
        </div>
        <div v-if="erro" class="absolute inset-0 flex items-center justify-center p-4">
            <p class="rounded bg-red-100 p-3 text-red-700">{{ erro }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const props = defineProps({
    modelo: { type: String, required: true },
})

const container = ref(null)
const carregando = ref(true)
const progresso = ref(0)
const erro = ref("")

let renderer, controls, draco, observer
let destruido = false

onMounted(() => {
    const el = container.value

    // Cena, câmera e renderizador
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.01, 1000)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    // Luzes
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2))
    const sol = new THREE.DirectionalLight(0xffffff, 1)
    sol.position.set(5, 10, 7)
    scene.add(sol)

    // Controles (girar, zoom, arrastar)
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.5

    // Carregar o .glb (com suporte a modelos comprimidos com Draco)
    draco = new DRACOLoader()
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/")
    const loader = new GLTFLoader()
    loader.setDRACOLoader(draco)

    loader.load(
        props.modelo,
        (gltf) => {
            if (destruido) return
            const model = gltf.scene

            // Centraliza e enquadra o modelo, independente da escala original
            const box = new THREE.Box3().setFromObject(model)
            const size = box.getSize(new THREE.Vector3()).length()
            const center = box.getCenter(new THREE.Vector3())
            model.position.sub(center)

            camera.position.set(size * 0.6, size * 0.5, size * 0.9)
            camera.near = size / 100
            camera.far = size * 100
            camera.updateProjectionMatrix()
            controls.maxDistance = size * 5
            controls.update()

            scene.add(model)
            carregando.value = false
        },
        (xhr) => {
            if (xhr.total) progresso.value = Math.round((xhr.loaded / xhr.total) * 100)
        },
        (e) => {
            carregando.value = false
            erro.value = `Não foi possível carregar o modelo: ${e.message ?? e}`
        }
    )

    // Loop de renderização
    renderer.setAnimationLoop(() => {
        controls.update()
        renderer.render(scene, camera)
    })

    // Ajusta ao redimensionar
    observer = new ResizeObserver(() => {
        if (!el.clientWidth || !el.clientHeight) return
        camera.aspect = el.clientWidth / el.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(el.clientWidth, el.clientHeight)
    })
    observer.observe(el)
})

onBeforeUnmount(() => {
    destruido = true
    observer?.disconnect()
    renderer?.setAnimationLoop(null)
    controls?.dispose()
    draco?.dispose()
    renderer?.dispose()
    renderer?.forceContextLoss()
})
</script>
