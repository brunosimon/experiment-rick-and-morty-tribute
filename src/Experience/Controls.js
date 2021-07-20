import gsap from 'gsap'
import * as THREE from 'three'
import normalizeWheel from 'normalize-wheel'

export default class Controls
{
    constructor()
    {
        this.experience = window.experience
        this.targetElement = this.experience.targetElement
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.overlay = this.experience.overlay

        this.setSpherical()
        this.setAnimation()
        this.setMouse()
        this.setWheel()
        this.setMix()

        this.animation.next()
    }

    setSpherical()
    {
        this.spherical = {}
        
        this.spherical.object = new THREE.Object3D()
        this.spherical.object.rotation.reorder('YXZ')
        // this.spherical.object.up.set(0, 1, 1)
        
        this.spherical.value = new THREE.Spherical(3.25, Math.PI * 0.35, Math.PI * 0.15)
        
        this.spherical.eased = {}
        this.spherical.eased.multiplier = 0.0075
        this.spherical.eased.value = this.spherical.value.clone()

        this.spherical.target = new THREE.Vector3(0, 0, 0)
    }

    setAnimation()
    {
        this.animation = {}
        this.animation.currentIndex = null
        this.animation.delayedCall = null

        this.animation.object = new THREE.Object3D()
        this.animation.object.rotation.reorder('YXZ')
        
        this.animation.sequences = [
            [
                { position: new THREE.Vector3(2.0943, 1.202, 1.738), rotation: new THREE.Euler(-0.398, 0.855, 0, 'YXZ') },
                { position: new THREE.Vector3(-1.584, -0.356, 1.971), rotation: new THREE.Euler(0.134, -0.677, 0, 'YXZ') },
            ],
            [
                { position: new THREE.Vector3(0, -0.894, 1.985), rotation: new THREE.Euler(0.423, 0, 0, 'YXZ') },
                { position: new THREE.Vector3(0, -1.343, 4.760), rotation: new THREE.Euler(0.2749, 0, 0, 'YXZ') },
            ],
            [
                { position: new THREE.Vector3(-3.047, 2.122, 1.565), rotation: new THREE.Euler(-0.554, -1.096, 0, 'YXZ') },
                { position: new THREE.Vector3(-2.18, 1.954, 8.248), rotation: new THREE.Euler(-0.274, -0.360, 0, 'YXZ') },
            ],
            [
                { position: new THREE.Vector3(-2.206, -1.250, -4.548), rotation: new THREE.Euler(0.2425, -2.689, 0, 'YXZ') },
                { position: new THREE.Vector3(0.9, -1.181, -4.904), rotation: new THREE.Euler(0.228, -2.883, 0, 'YXZ') },
            ],
            [
                { position: new THREE.Vector3(-0.705, -1.0, 4.793), rotation: new THREE.Euler(0.203, -0.1460, 0, 'YXZ') },
                { position: new THREE.Vector3(-3.440, -1.396, 5.385), rotation: new THREE.Euler(0.185, -0.3344, 0, 'YXZ') },
            ],
        ]

        this.animation.next = () =>
        {
            if(this.animation.currentIndex === null)
            {
                this.animation.currentIndex = 0
            }
            else
            {
                this.animation.currentIndex++

                if(this.animation.currentIndex > this.animation.sequences.length - 1)
                {
                    this.animation.currentIndex = 0
                }
            }

            const duration = 8

            // Get sequence
            const sequence = this.animation.sequences[this.animation.currentIndex]

            // Animate position
            gsap.fromTo(
                this.animation.object.position,
                {
                    x: sequence[0].position.x,
                    y: sequence[0].position.y,
                    z: sequence[0].position.z,
                },
                {
                    duration: duration,
                    ease: 'power1.inOut',
                    x: sequence[1].position.x,
                    y: sequence[1].position.y,
                    z: sequence[1].position.z,
                }
            )

            // Animate rotation
            gsap.fromTo(
                this.animation.object.rotation,
                {
                    x: sequence[0].rotation.x,
                    y: sequence[0].rotation.y,
                },
                {
                    duration: duration,
                    ease: 'power1.inOut',
                    x: sequence[1].rotation.x,
                    y: sequence[1].rotation.y,
                }
            )

            // Overlay
            gsap.to(
                this.overlay.material.uniforms.uAlpha,
                {
                    duration: 1,
                    ease: 'power1.out',
                    value: 0
                }
            )

            gsap.delayedCall(duration - 1, () =>
            {
                if(!this.mix.enabled)
                {
                    gsap.to(
                        this.overlay.material.uniforms.uAlpha,
                        {
                            duration: 1,
                            ease: 'power1.in',
                            value: 1
                        }
                    )
                }
            })

            // Wait and repeat
            if(this.animation.delayedCall)
            {
                this.animation.delayedCall.kill()
            }

            this.animation.delayedCall = gsap.delayedCall(duration, () =>
            {
                if(!this.enabled)
                {
                    this.animation.next()
                }
            })
        }
    }

    setMouse()
    {
        this.mouse = {}

        this.mouse.x = 0
        this.mouse.y = 0

        this.mouse.delta = {}
        this.mouse.delta.x = 0
        this.mouse.delta.y = 0
        this.mouse.sensitivity = {}
        this.mouse.sensitivity.x = - 0.01
        this.mouse.sensitivity.y = - 0.01

        this.mouse.onDown = (_event) =>
        {
            this.mouse.x = _event.clientX
            this.mouse.y = _event.clientY

            this.targetElement.style.cursor = 'grabbing'

            this.mix.action()

            window.addEventListener('mousemove', this.mouse.onMove)
            window.addEventListener('mouseup', this.mouse.onUp)
        }

        this.mouse.onMove = (_event) =>
        {
            const x = _event.clientX
            const y = _event.clientY

            this.mouse.delta.x += x - this.mouse.x
            this.mouse.delta.y += y - this.mouse.y

            this.mouse.x = x
            this.mouse.y = y

            this.mix.action()
            this.mix.enable()
        }

        this.mouse.onUp = (_event) =>
        {
            this.targetElement.style.cursor = null

            window.removeEventListener('mousemove', this.mouse.onMove)
            window.removeEventListener('mouseup', this.mouse.onUp)
        }

        window.addEventListener('mousedown', this.mouse.onDown)
    }

    setWheel()
    {
        this.wheel = {}
        
        this.wheel.delta = 0
        this.wheel.sensitivity = 0.01

        this.wheel.onWheel = (_event) =>
        {
            const normalizedWheel = normalizeWheel(_event)

            this.wheel.delta += normalizedWheel.pixelY
        }

        window.addEventListener('mousewheel', this.wheel.onWheel)
    }

    setMix()
    {
        this.mix = {}
        
        this.mix.enabled = false
        this.mix.value = 0
        this.mix.triggerDelay = null

        this.mix.enable = () =>
        {
            if(this.mix.enabled)
            {
                return
            }

            this.mix.enabled = true

            this.spherical.value.setFromVector3(this.animation.object.position)
            this.spherical.eased.value.copy(this.spherical.value)

            gsap.to(this.mix, { duration: 1, value: 1 })
        }

        this.mix.disable = () =>
        {
            if(!this.mix.enabled)
            {
                return
            }

            gsap.to(
                this.overlay.material.uniforms.uAlpha,
                {
                    duration: 1,
                    ease: 'power1.out',
                    value: 1,
                    onComplete: () =>
                    {
                        this.mix.enabled = false
                        this.mix.value = 0
                        this.animation.next()
                    }
                }
            )

        }

        this.mix.autodisable = () =>
        {
            if(!this.mix.enabled)
            {
                return
            }
            
            this.mix.enabled = false

            gsap.to(this.mix, { duration: 1, value: 0 })
        }

        this.mix.action = () =>
        {
            if(this.mix.triggerDelay)
            {
                this.mix.triggerDelay.kill()
                this.mix.triggerDelay = null
            }

            this.mix.triggerDelay = gsap.delayedCall(3, this.mix.disable)
        }

        window.addEventListener('keydown', (_event) =>
        {
            if(_event.code === 'Escape')
            {
                this.mix.disable()
            }
        })
    }

    update()
    {
        /**
         * Spherical
         */
        // Theta
        this.spherical.value.theta += this.mouse.delta.x * this.mouse.sensitivity.x

        // Phi
        this.spherical.value.phi += this.mouse.delta.y * this.mouse.sensitivity.y
        this.spherical.value.phi = Math.max(Math.min(this.spherical.value.phi, Math.PI * 0.8), Math.PI * 0.2)

        // Radius
        this.spherical.value.radius += this.wheel.delta * this.wheel.sensitivity
        this.spherical.value.radius = Math.max(Math.min(this.spherical.value.radius, 7), 2)

        // Eased
        this.spherical.eased.value.phi += (this.spherical.value.phi - this.spherical.eased.value.phi) * this.spherical.eased.multiplier * this.time.delta
        this.spherical.eased.value.theta += (this.spherical.value.theta - this.spherical.eased.value.theta) * this.spherical.eased.multiplier * this.time.delta
        this.spherical.eased.value.radius += (this.spherical.value.radius - this.spherical.eased.value.radius) * this.spherical.eased.multiplier * this.time.delta

        // Object
        this.spherical.object.position.setFromSpherical(this.spherical.eased.value)
        this.spherical.object.lookAt(new THREE.Vector3())
        this.spherical.object.rotateY(Math.PI)
        this.spherical.object.position.y = Math.max(this.spherical.object.position.y, - 1.25)

        /**
         * Camera
         */
        const mixedPosition = this.animation.object.position.clone()
        mixedPosition.x += (this.spherical.object.position.x - mixedPosition.x) * this.mix.value
        mixedPosition.y += (this.spherical.object.position.y - mixedPosition.y) * this.mix.value
        mixedPosition.z += (this.spherical.object.position.z - mixedPosition.z) * this.mix.value

        const mixedRotation = this.animation.object.rotation.clone()
        mixedRotation.x += (this.spherical.object.rotation.x - mixedRotation.x) * this.mix.value
        mixedRotation.y += (this.spherical.object.rotation.y - mixedRotation.y) * this.mix.value

        this.camera.modes.default.instance.position.copy(mixedPosition)
        this.camera.modes.default.instance.rotation.copy(mixedRotation)

        /**
         * Mouse
         */
        this.mouse.delta.x = 0
        this.mouse.delta.y = 0

        /**
         * Wheel
         */
        this.wheel.delta = 0
    }
}