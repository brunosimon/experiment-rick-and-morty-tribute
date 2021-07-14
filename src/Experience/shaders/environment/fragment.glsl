#define STANDARD

#ifdef PHYSICAL
	#define REFLECTIVITY
	#define CLEARCOAT
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform vec3 attenuationColor;
	uniform float attenuationDistance;
#endif

#ifdef REFLECTIVITY
	uniform float reflectivity;
#endif

#ifdef CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif

#ifdef USE_SHEEN
	uniform vec3 sheen;
#endif

varying vec3 vViewPosition;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

	#ifdef USE_TANGENT

		varying vec3 vTangent;
		varying vec3 vBitangent;

	#endif

#endif

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <transmission_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform float uRevealProgress;
uniform vec3 uPlasmaColor1;
uniform vec3 uPlasmaColor2;
varying vec4 vWorldPosition;

#pragma glslify: getPerlinNoise3d = require('../partials/getPerlinNoise3d.glsl')

void main()
{
    float distanceToCenter = length(vWorldPosition);
    float perlinStrength = getPerlinNoise3d(vWorldPosition.xyz * 3.0);
    float revealProgress = (distanceToCenter + perlinStrength * 0.2) / 7.0 - uRevealProgress;

    if(revealProgress > 0.0)
    {
        discard;
    }

    float plasmaStrength = 1.0 - clamp(abs(revealProgress * 10.0), 0.0, 1.0);

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

	#include <transmission_fragment>

	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
    outgoingLight = mix(outgoingLight, uPlasmaColor2, step(0.3, plasmaStrength) * plasmaStrength);
    outgoingLight = mix(outgoingLight, uPlasmaColor1, step(0.95, plasmaStrength));

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	// gl_FragColor = vec4( plasmaStrength, plasmaStrength, plasmaStrength, 1.0 );

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}