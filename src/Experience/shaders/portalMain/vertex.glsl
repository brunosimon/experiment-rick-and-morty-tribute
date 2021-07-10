#define M_PI 3.1415926535897932384626433832795

uniform float uPullStrength;

varying vec2 vUv;

void main()
{
    vec3 newPosition = position;
    vec2 centeredUv = uv - 0.5;
    float distanceToCenter = length(centeredUv) * 2.0;
    float pullStrength = (cos(distanceToCenter * M_PI) + 1.0);
    pullStrength *= uPullStrength;
    newPosition.z += pullStrength;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vUv = uv;
}