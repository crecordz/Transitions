
uniform sampler2D uTexture;
uniform sampler2D uTexture2;
uniform float uTime;
uniform float blend;
varying vec2 vUv;
varying vec3 v_position;


void main()
{
    float stepblend = clamp(v_position.x + v_position.y + 3.*blend - 1., 0., 1.);
    vec4 original = (texture2D(uTexture, vUv));
    vec4 target = (texture2D(uTexture2, vUv));

    vec4 result = (original*(1. - stepblend) + target*stepblend);
    gl_FragColor = result;
}