import * as THREE from 'three'
import portalMainVertexShader from './shaders/portalMain/vertex.glsl'
import portalMainFragmentShader from './shaders/portalMain/fragment.glsl'

export default class Portal
{
    constructor()
    {
        this.experience = window.experience
        this.time = this.experience.time
        this.scene = this.experience.scene

        this.group = new THREE.Group()
        this.scene.add(this.group)

        this.setSurface()
        this.setLight()
    }

    setSurface()
    {
        this.surface = {}
        this.surface.pull = {}
        this.surface.pull.speed = 0
        this.surface.pull.target = 0
        this.surface.pull.value = 0

        window.setInterval(() =>
        {
            this.surface.pull.target = (Math.random() - 0.5) * 0.2
            window.setTimeout(() =>
            {
                this.surface.pull.target = 0
            }, 100)
        }, 3000)

        // Geometry
        this.surface.geometry = new THREE.PlaneGeometry(1, 1, 15, 15)

        // Material
        this.surface.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms:
            {
                uTime: { value: 0 },
                uPullStrength: { value: 0.1 },
                uColor1: { value: new THREE.Color('#5cad4a') },
                uColor2: { value: new THREE.Color('#208d45') },
                uColor3: { value: new THREE.Color('#a7cb54') },
                uColor4: { value: new THREE.Color('#f8fbf3') },
            },
            vertexShader: portalMainVertexShader,
            fragmentShader: portalMainFragmentShader
        })

        // Mesh
        this.surface.mesh = new THREE.Mesh(this.surface.geometry, this.surface.material)
        this.group.add(this.surface.mesh)
    }

    setLight()
    {
        this.light = {}
        
        this.light.position = new THREE.Vector3(0, 0, 0)

        // Instance
        this.light.instance = new THREE.PointLight(0x55ff55, 1, 0, 3)
        this.light.instance.castShadow = true
        this.light.instance.shadow.camera.near = 0.1
        this.light.instance.shadow.camera.far = 100
        this.light.instance.shadow.mapSize.x = 1024
        this.light.instance.shadow.mapSize.y = 1024
        this.light.instance.shadow.bias = - 0.0001
        this.scene.add(this.light.instance)
    }

    update()
    {
        // Surface
        const pullDelta = this.surface.pull.target - this.surface.pull.value
        this.surface.pull.speed += pullDelta * 0.005 * this.time.delta
        this.surface.pull.speed *= 0.97
        this.surface.pull.value += this.surface.pull.speed

        this.surface.material.uniforms.uPullStrength.value = this.surface.pull.value

        // Light
        this.light.instance.position.copy(this.light.position)
        this.light.instance.intensity = 1 + Math.sin(this.time.elapsed * 0.0001 * 100) * 0.25
        this.light.instance.position.x = Math.sin(this.time.elapsed * 0.0001 * 100) * 0.02
        this.light.instance.position.y = Math.sin(this.time.elapsed * 0.00006 * 100) * 0.02
        this.light.instance.position.z = Math.sin(this.time.elapsed * 0.00004 * 100) * 0.02
        this.surface.material.uniforms.uTime.value = this.time.elapsed
    }
}
