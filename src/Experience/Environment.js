export default class Environment
{
    constructor()
    {
        this.experience = window.experience
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.model = this.resources.items.environmentModel.scene
        
        this.model.traverse((_child) =>
        {
            _child.castShadow = true
            _child.receiveShadow = true
        })

        this.scene.add(this.model)
    }
}