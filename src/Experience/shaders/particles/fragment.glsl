uniform sampler2D uMask;

varying float vRotation;

#pragma glslify: getRotatedUv = require('../partials/getRotatedUv.glsl')

void main()
{
    vec2 uv = getRotatedUv(gl_PointCoord, vRotation);
    float maskStrength = texture2D(uMask, uv).r;
    gl_FragColor = vec4(1.0, 1.0, 1.0, maskStrength);
}