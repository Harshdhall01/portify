import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function WaterBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const width = mount.clientWidth
    const height = mount.clientHeight

    // ── Scene ──────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x010b18, 0.035)

    // ── Camera ─────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 2, 8)
    camera.lookAt(0, 0, 0)

    // ── Renderer ───────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x010b18, 1)
    mount.appendChild(renderer.domElement)

    // ── Ocean Geometry ─────────────────────────────
    const geometry = new THREE.PlaneGeometry(40, 40, 120, 120)
    geometry.rotateX(-Math.PI / 2)

    const material = new THREE.MeshPhongMaterial({
      color: 0x032340,
      emissive: 0x021428,
      specular: 0x00ffe7,
      shininess: 120,
      wireframe: false,
      transparent: true,
      opacity: 0.92,
    })

    const ocean = new THREE.Mesh(geometry, material)
    scene.add(ocean)

    // ── Wireframe Overlay ──────────────────────────
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0a4f8a,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    })
    const wireOcean = new THREE.Mesh(geometry.clone(), wireMat)
    wireOcean.position.y = 0.01
    scene.add(wireOcean)

    // ── Floating Particles ─────────────────────────
    const particleCount = 200
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = Math.random() * 4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0x00ffe7,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Lights ─────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x021428, 2)
    scene.add(ambientLight)

    const deepLight = new THREE.PointLight(0x0e6eb8, 3, 20)
    deepLight.position.set(0, 5, 0)
    scene.add(deepLight)

    const biolumLight = new THREE.PointLight(0x00ffe7, 2, 15)
    biolumLight.position.set(-5, 2, -5)
    scene.add(biolumLight)

    const biolumLight2 = new THREE.PointLight(0x1a8fd1, 2, 15)
    biolumLight2.position.set(5, 2, 5)
    scene.add(biolumLight2)

    // ── Wave Animation ─────────────────────────────
    const posAttr = geometry.attributes.position
    const originalY = new Float32Array(posAttr.count)
    for (let i = 0; i < posAttr.count; i++) {
      originalY[i] = posAttr.getY(i)
    }

    // ── Mouse Parallax ─────────────────────────────
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Resize ─────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Animate ────────────────────────────────────
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Wave vertices
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i)
        const z = posAttr.getZ(i)
        const wave =
          Math.sin(x * 0.5 + t * 0.8) * 0.4 +
          Math.sin(z * 0.4 + t * 0.6) * 0.3 +
          Math.sin((x + z) * 0.3 + t * 1.0) * 0.2
        posAttr.setY(i, originalY[i] + wave)
      }
      posAttr.needsUpdate = true
      geometry.computeVertexNormals()

      // Particles drift
      particles.rotation.y = t * 0.03
      particles.position.y = Math.sin(t * 0.3) * 0.2

      // Light pulse
      biolumLight.intensity = 2 + Math.sin(t * 1.5) * 1
      biolumLight2.intensity = 2 + Math.cos(t * 1.2) * 1

      // Camera parallax
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02
      camera.position.y += (-mouseY * 0.8 + 2 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // ── Cleanup ────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  )
}