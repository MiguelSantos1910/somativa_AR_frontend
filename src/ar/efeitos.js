import * as THREE from "three"

// Cores de cada tipo de alerta
const CORES_ALERTA = {
    perigo: { fundo: "#dc2626", texto: "#ffffff" },
    atencao: { fundo: "#f59e0b", texto: "#1f2937" },
    info: { fundo: "#0ea5e9", texto: "#ffffff" },
}

// Cria um texto 3D (sprite) que sempre fica virado para a câmera
export const criarRotulo = (texto, { fundo = "#0f172a", cor = "#ffffff", altura = 0.08 } = {}) => {
    const fonte = 48
    const padding = 24
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    ctx.font = `bold ${fonte}px system-ui, sans-serif`
    canvas.width = Math.ceil(ctx.measureText(texto).width) + padding * 2
    canvas.height = fonte + padding * 2

    // Fundo arredondado
    ctx.fillStyle = fundo
    ctx.beginPath()
    ctx.roundRect(0, 0, canvas.width, canvas.height, 20)
    ctx.fill()

    // Texto
    ctx.font = `bold ${fonte}px system-ui, sans-serif`
    ctx.fillStyle = cor
    ctx.textBaseline = "middle"
    ctx.fillText(texto, padding, canvas.height / 2)

    const textura = new THREE.CanvasTexture(canvas)
    textura.colorSpace = THREE.SRGBColorSpace
    const material = new THREE.SpriteMaterial({ map: textura, depthTest: false, transparent: true })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set((altura * canvas.width) / canvas.height, altura, 1)
    sprite.renderOrder = 10 // desenha por cima do modelo
    return sprite
}

// Cria uma seta 3D que aponta para baixo (em direção ao marcador), com um rótulo em cima
export const criarSeta = ({ rotulo, cor = "#f59e0b", x = 0, y = 0, z = 0 }) => {
    const material = new THREE.MeshStandardMaterial({ color: cor, emissive: cor, emissiveIntensity: 0.4 })

    // A ponta da seta fica na origem do grupo e o corpo vai para cima (+Z, em direção à câmera)
    const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 24), material)
    ponta.rotation.x = -Math.PI / 2 // cone aponta para -Z
    ponta.position.z = 0.04

    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 16), material)
    haste.rotation.x = Math.PI / 2
    haste.position.z = 0.14

    const seta = new THREE.Group()
    seta.add(ponta, haste)

    if (rotulo) {
        const texto = criarRotulo(rotulo, { fundo: cor, altura: 0.06 })
        texto.position.z = 0.26
        seta.add(texto)
    }

    seta.position.set(x, y, z)
    seta.userData.zBase = z
    return seta
}

// Cria o painel de alertas que flutua acima do modelo
export const criarAlertas = (alertas = []) => {
    const grupo = new THREE.Group()
    alertas.forEach((a, i) => {
        const cores = CORES_ALERTA[a.tipo] ?? CORES_ALERTA.info
        const rotulo = criarRotulo(a.texto, { fundo: cores.fundo, cor: cores.texto, altura: 0.08 })
        rotulo.position.y = i * -0.1
        rotulo.userData.perigo = a.tipo === "perigo"
        rotulo.userData.escalaBase = rotulo.scale.clone()
        grupo.add(rotulo)
    })
    // Acima do marcador (o marcador vai de -0.5 a 0.5)
    grupo.position.set(0, 0.7, 0.2)
    return grupo
}

// Anima as setas (sobe e desce) e faz os alertas de perigo pulsarem
export const animarEfeitos = (setas, alertas, tempo) => {
    setas.forEach((s) => {
        s.position.z = s.userData.zBase + Math.abs(Math.sin(tempo * 3)) * 0.05
    })
    alertas.forEach((grupo) => {
        grupo.children.forEach((r) => {
            if (!r.userData.perigo) return
            const pulso = 1 + Math.sin(tempo * 6) * 0.06
            r.scale.copy(r.userData.escalaBase).multiplyScalar(pulso)
        })
    })
}

// Libera da memória as geometrias, materiais e texturas de um objeto
export const liberar = (objeto) => {
    objeto.traverse((o) => {
        o.geometry?.dispose()
        o.material?.map?.dispose()
        o.material?.dispose()
    })
}
