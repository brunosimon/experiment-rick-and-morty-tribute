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
    }

    setMain()
    {
        this.main = {}

        // Geometry
        this.main.geometry = new THREE.PlaneGeometry(3, 3, 1, 1)

        // Material
        this.main.material = new THREE.ShaderMaterial({
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

    update()
    {
        this.main.material.uniforms.uTime.value = this.time.elapsed
    }
}
