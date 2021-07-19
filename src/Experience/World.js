import gsap from 'gsap'
import Portal from './Portal.js'
import Particles from './Particles.js'
import CarLight from './CarLight.js'
import PortalGunLight from './PortalGunLight.js'
import Environment from './Environment.js'

export default class World
{
    constructor(_options)
    {
        this.experience = window.experience
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.setPortal()
        this.setParticles()
        this.setCarLight()
        this.setPortalGunLight()
        this.setEnvironment()
    }

    setPortal()
    {
        this.portal = new Portal()
    }

    setParticles()
    {
        this.particles = new Particles()
    }

    setCarLight()
    {
        this.carLight = new CarLight()
    }

    setPortalGunLight()
    {
        this.portalGunLight = new PortalGunLight()
    }
    
    setEnvironment()
    {
        this.environment = new Environment()

        this.environment.on('loaded', () =>
        {
            gsap.to(this.portal.surface.material.uniforms.uLoadingMaskAlpha, { value: 0, delay: 1, duration: 1 })
        })
    }

    resize()
    {
        if(this.particles)
        {
            this.particles.resize()
        }
    }

    update()
    {
        if(this.portal)
        {
            this.portal.update()
        }

        if(this.particles)
        {
            this.particles.update()
        }

        if(this.carLight)
        {
            this.carLight.update()
        }

        if(this.environment)
        {
            this.environment.update()
        }
    }

    destroy()
    {
    }
}