#define M_PI 3.1415926535897932384626433832795

uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

#pragma glslify: getPerlinNoise2d = require('../partials/getPerlinNoise2d.glsl')
#pragma glslify: getPerlinNoise3d = require('../partials/getPerlinNoise3d.glsl')

vec2 rotate(vec2 v, float a)
{
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

varying vec2 vUv;

void main()
{
    // UVs
    vec2 centeredUv = vUv - 0.5;
    float distanceToCenter = length(centeredUv);
    float radialRatio = atan(centeredUv.y, centeredUv.x) / (M_PI * 2.0) + 0.5;

    // Discard
    float discardPerlin = getPerlinNoise3d(vec3(centeredUv * 20.0, uTime * 0.001));

    if(distanceToCenter - discardPerlin * 0.03 > 0.5 - (0.03 * 0.5))
    {
        discard;
    }

    // First mix
    vec2 distoredUv1 = rotate(centeredUv, distanceToCenter * 6.0);
    float mix1 = getPerlinNoise3d(vec3(distoredUv1 * 20.0, uTime * 0.0005));
    mix1 += getPerlinNoise3d(vec3(distoredUv1 * 8.0, uTime * 0.0001));
    mix1 -= distanceToCenter * 6.0;
    mix1 = step(- 1.5, mix1);
    vec3 color = mix(uColor1, uColor2, mix1);
    
    // Second mix
    vec2 distoredUv2 = rotate(centeredUv, distanceToCenter * 4.0 - uTime * 0.0001);
    float mix2 = getPerlinNoise3d(vec3(distoredUv2 * 20.0, uTime * 0.0005));
    mix2 += getPerlinNoise3d(vec3(centeredUv * 3.0, uTime * 0.0001));
    mix2 += pow(abs((distanceToCenter - 0.25) * 4.0), 2.0);
    mix2 = step(0.4, mix2);
    color = mix(color, uColor3, mix2);

    // Third mix
    vec2 distoredUv3 = rotate(centeredUv, - uTime * 0.00002);
    float mix3 = getPerlinNoise3d(vec3(distoredUv3 * 25.0, uTime * 0.0001));
    mix3 += (distanceToCenter - 0.3) * 1.0;
    mix3 = step(0.6, mix3);
    color = mix(color, uColor4, mix3);

    gl_FragColor = vec4(color, 1.0);
}