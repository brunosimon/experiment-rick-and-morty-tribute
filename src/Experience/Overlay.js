import * as THREE from 'three'
import overlayVertexShader from './shaders/overlay/vertex.glsl'
import overlayFragmentShader from './shaders/overlay/fragment.glsl'

export default class Overlay
{
    constructor()
    {
        this.experience = window.experience
        this.scene = this.experience.scene

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            depthTest: false,
            uniforms:
            {
                uAlpha: { value: 1 },
                uColor: { value: new THREE.Color('#1a1f1b') }
            },
            vertexShader: overlayVertexShader,
            fragmentShader: overlayFragmentShader
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.frustumCulled = false
        this.scene.add(this.mesh)
    }
}