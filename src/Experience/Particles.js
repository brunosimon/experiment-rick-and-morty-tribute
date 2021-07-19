import * as THREE from 'three'
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'

export default class Particles
{
    constructor()
    {
        this.experience = window.experience
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.scene = this.experience.scene

        // Debug
        this.debugFolder = this.debug.addFolder({
            title: 'particles',
            expanded: true,
        })

        this.setGeometry()
        this.setMaterial()
        this.setPoints()
    }

    setGeometry()
    {
        // this.geometry = new THREE.BoxGeometry(2, 2, 2, 10, 10, 10)
        this.geometry = new THREE.BufferGeometry()

        const count = 100

        const positionAttribute = new Float32Array(count * 3)
        const sizeAttribute = new Float32Array(count)

        for(let i = 0; i < count ; i++)
        {
            // Position
            let distance = Infinity
            let x = null
            let y = null
            let z = null

            while(distance > 6)
            {
                x = (Math.random() - 0.5) * 12
                y = (Math.random() - 0.5) * 2.5
                z = (Math.random() - 0.5) * 12

                distance = Math.hypot(x, z)
            }

            positionAttribute[i * 3 + 0] = x
            positionAttribute[i * 3 + 1] = y
            positionAttribute[i * 3 + 2] = z

            // Size
            sizeAttribute[i] = Math.random()
        }

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionAttribute, 3))
        this.geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizeAttribute, 1))
    }

    setMaterial()
    {
        const textureLoader = new THREE.TextureLoader()

        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uTime: { value: 0 },
                uSize: { value: 40 * this.config.pixelRatio },
                uMask: { value: textureLoader.load('assets/particlesMask.png') }
            },
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader
        })
    }

    setPoints()
    {
        this.points = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.points)
    }

    resize()
    {
        this.material.uniforms.uSize.value = 40 * this.config.pixelRatio
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed
    }
}
