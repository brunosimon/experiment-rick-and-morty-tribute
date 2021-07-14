import * as THREE from 'three'
import shaderFragment from '../shaders/environment/fragment.glsl'
import shaderVertex from '../shaders/environment/vertex.glsl'

/**
 * TODO:
 * - Handle emissive map
 */

export default function(_parameters = {})
{
    // Base uniforms
    const uniforms = THREE.UniformsUtils.merge([
        THREE.ShaderLib[ 'standard'].uniforms,
        {}
    ])

    // Extensions
    const extensions = {
        derivatives: true,
        fragDepth: false,
        drawBuffers: false,
        shaderTextureLOD: true
    }

    // Defines
    const defines = {
        PHYSICAL: '',
        // USE_COLOR: ''
        // USE_BUMPMAP: '',
        // USE_EMISSIVEMAP: '',
    }

    if(_parameters.map)
    {
        uniforms.map.value = _parameters.map
        defines.USE_MAP = ''
        defines.USE_UV = ''
    }

    if(_parameters.alphaMap)
    {
        uniforms.alphaMap.value = _parameters.alphaMap
        defines.USE_ALPHAMAP = ''
        defines.USE_UV = ''
    }

    if(_parameters.aoMap)
    {
        uniforms.aoMap.value = _parameters.aoMap
        defines.USE_AOMAP = ''
        defines.USE_UV = ''
    }

    if(_parameters.displacementMap)
    {
        uniforms.displacementMap.value = _parameters.displacementMap
        defines.USE_DISPLACEMENTMAP = ''
        defines.USE_UV = ''
    }

    if(_parameters.normalMap)
    {
        uniforms.normalMap.value = _parameters.normalMap
        defines.USE_NORMALMAP = ''
        defines.USE_UV = ''
        defines.TANGENTSPACE_NORMALMAP = ''
        // defines.OBJECTSPACE_NORMALMAP = '' // ???
    }

    if(_parameters.metalnessMap)
    {
        uniforms.metalnessMap.value = _parameters.metalnessMap
        defines.USE_METALNESSMAP = ''
        defines.USE_UV = ''
    }

    if(_parameters.roughnessMap)
    {
        uniforms.roughnessMap.value = _parameters.roughnessMap
        defines.USE_ROUGHNESSMAP = ''
        defines.USE_UV = ''
    }

    if(_parameters.envMap)
    {
        uniforms.envMapIntensity.value = _parameters.envMapIntensity
        uniforms.envMap.value = _parameters.envMap
        uniforms.maxMipLevel.value = 11 // ???
        defines.USE_ENVMAP = ''
        defines.ENVMAP_TYPE_CUBE = ''
        // defines.ENVMAP_TYPE_CUBE_UV = ''

        // defines.ENVMAP_MODE_REFLECTION = '' // ???
        // defines.ENVMAP_MODE_REFRACTION = '' // ???
        // defines.ENVMAP_BLENDING_MULTIPLY = '' // ???
        // defines.ENVMAP_BLENDING_MIX = '' // ???
        // defines.ENVMAP_BLENDING_ADD = '' // ???
    }

    // defines.USE_SHADOWMAP = ''

    if(_parameters.fogColor)
    {
        uniforms.fogColor.value = _parameters.fogColor
        uniforms.fogNear.value = _parameters.fogNear
        uniforms.fogFar.value = _parameters.fogFar
        uniforms.fogDensity.value = _parameters.fogDensity

        defines.USE_FOG = ''

        if(_parameters.fogDensity)
        {
            defines.FOG_EXP2 = ''
        }
    }

    if(_parameters.color)
    {
        uniforms.diffuse.value = _parameters.color
    }

    uniforms.roughness.value = _parameters.roughness
    uniforms.metalness.value = _parameters.metalness

    // // Custom uniforms
    // uniforms.uBrushTexture = { value: _parameters.brushTexture }

    // Create material
    const material = new THREE.ShaderMaterial({
        wireframe: false,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        // alphaTest: 0.1,
        uniforms,
        extensions,
        defines,
        lights: true,
        vertexShader: shaderVertex,
        fragmentShader: shaderFragment
    })

    // Update properties (needed for prefixed shader code)
    if(_parameters.map)
    {
        material.map = _parameters.map
    }
    if(_parameters.envMap)
    {
        material.envMap = _parameters.envMap
    }

    return material
}