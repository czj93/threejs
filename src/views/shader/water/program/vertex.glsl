precision lowp float;

uniform float uWaresFrequency;
uniform float uScale;


varying float vElevation;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    float elevation = sin(modelPosition.x * uWaresFrequency) * sin(modelPosition.z * uWaresFrequency);

    // float elevation = sin(modelPosition.x*uWaresFrequency+uTime*uXspeed)*sin(modelPosition.z*uWaresFrequency*uXzScale+uTime*uZspeed);

    // elevation += -abs(cnoise(vec2(modelPosition.xz*uNoiseFrequency+uTime*uNoiseSpeed))) *uNoiseScale;
    
    // vElevation = elevation;
    
    elevation *= uScale;

    vElevation = elevation;    

    modelPosition.y += elevation;

    gl_Position = projectionMatrix * viewMatrix *modelPosition;
}
