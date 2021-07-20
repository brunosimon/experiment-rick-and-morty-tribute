import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export default class CarLight
{
    constructor()
    {
        this.experience = window.experience
        this.camera = this.experience.camera
        this.targetElement = this.experience.targetElement
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.scene = this.experience.scene

        // Debug
        this.debugFolder = this.debug.addFolder({
            title: 'carLight',
            expanded: false,
        })

        this.setLight()
    }

    setLight()
    {
        this.light = {}
        
        this.light.color = '#3ec0ff'
        this.light.intensity = 0.22

        // Instance
        this.light.instance = new THREE.PointLight(this.light.color, this.light.intensity, 0, 5.98)
        this.light.instance.position.set(2.172, -0.216, 2.271)
        this.scene.add(this.light.instance)

        // Controls
        this.light.controls = new TransformControls(this.camera.instance, this.targetElement)
        this.light.controls.enabled = false
        this.light.controls.attach(this.light.instance)
        this.light.controls.addEventListener('dragging-changed', (event) =>
        {
            this.camera.modes.debug.orbitControls.enabled = ! event.value
        })
        if(this.light.controls.enabled)
        {
            this.scene.add(this.light.controls)
        }

        // Debug
        this.debugFolder
            .addInput(
                this.light,
                'color',
                { view: 'color' }
            )
            .on('change', () =>
            {
                this.light.instance.color.set(this.light.color)
            })

        this.debugFolder
            .addInput(
                this.light,
                'intensity',
                { min: 0, max: 10 }
            )

        this.debugFolder
            .addInput(
                this.light.instance,
                'decay',
                { min: 0, max: 10 }
            )

        this.debugFolder
            .addInput(
                this.light.controls,
                'enabled',
                { label: 'controlsEnabled' }
            )
            .on('change', () =>
            {
                if(this.light.controls.enabled)
                {
                    this.scene.add(this.light.controls)
                }
                else
                {
                    this.scene.remove(this.light.controls)
                }
            })
    }

    update()
    {
        // Light
        this.light.instance.intensity = this.light.intensity + Math.sin(this.time.elapsed * 0.00004 * 100) * this.light.intensity * 0.5 - this.light.intensity * 0.5
        // this.light.instance.intensity = this.light.intensity
    }
}
