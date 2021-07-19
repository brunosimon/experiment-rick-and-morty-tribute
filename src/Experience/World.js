import * as THREE from 'three'
import Portal from './Portal.js'
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
        this.setCarLight()
        this.setPortalGunLight()
        this.setEnvironment()
        
        // this.resources.on('groupEnd', (_group) =>
        // {
        //     if(_group.name === 'base')
        //     {
        //         this.setEnvironment()
        //     }
        // })
    }

    setPortal()
    {
        this.portal = new Portal()
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
    }

    resize()
    {
    }

    update()
    {
        if(this.portal)
        {
            this.portal.update()
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