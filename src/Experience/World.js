import * as THREE from 'three'
import Portal from './Portal.js'

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
            }
        })
    }

    setPortal()
    {
        this.portal = new Portal()
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