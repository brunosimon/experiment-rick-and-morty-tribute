uniform float uTime;
uniform float uSize;

attribute float aSize;

varying float vRotation;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime * 0.001 + modelPosition.z * 10000.0) * (1.0 - aSize) * 0.3;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    gl_PointSize = uSize * aSize;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vRotation = modelPosition.x * 10000.0;
}