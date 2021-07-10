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

        this.setMain()
        this.setLight()
    }

    setMain()
    {
        this.main = {}

        // Geometry
        this.main.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

        // Material
        this.main.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms:
            {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color('#5cad4a') },
                uColor2: { value: new THREE.Color('#208d45') },
                uColor3: { value: new THREE.Color('#a7cb54') },
                uColor4: { value: new THREE.Color('#f8fbf3') },
            },
            vertexShader: portalMainVertexShader,
            fragmentShader: portalMainFragmentShader
        })

        // Mesh
        this.main.mesh = new THREE.Mesh(this.main.geometry, this.main.material)
        this.group.add(this.main.mesh)
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
        this.scene.add(this.light.instance)
    }

    update()
    {
        this.light.instance.position.copy(this.light.position)
        this.light.instance.intensity = 1 + Math.sin(this.time.elapsed * 0.0001 * 100) * 0.25
        this.light.instance.position.x = Math.sin(this.time.elapsed * 0.0001 * 100) * 0.02
        this.light.instance.position.y = Math.sin(this.time.elapsed * 0.00006 * 100) * 0.02
        this.light.instance.position.z = Math.sin(this.time.elapsed * 0.00004 * 100) * 0.02
        this.main.material.uniforms.uTime.value = this.time.elapsed
    }
}
