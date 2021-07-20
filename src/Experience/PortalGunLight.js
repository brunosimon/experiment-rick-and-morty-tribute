import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export default class PortalGunLight
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
            title: 'portalGunLight',
            expanded: false,
        })

        this.setLight()
    }

    setLight()
    {
        this.light = {}
        
        this.light.color = '#60ff00'

        // Instance
        this.light.instance = new THREE.PointLight(this.light.color, 0.01, 0, 8.70)
        this.light.instance.position.set(-3.099, -1.085, 3.845)
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
                this.light.instance,
                'intensity',
                { min: 0, max: 1 }
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
}
