import * as THREE from 'three'
import Portal from './Portal.js'
import Environment from './Environment.js'

export default class World
{
    constructor(_options)
    {
        this.experience = window.experience
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setPortal()
                this.setEnvironment()
            }
        })
    }

    setPortal()
    {
        this.portal = new Portal()
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
    }

    destroy()
    {
    }
}