uniform float uTime;
uniform float blend;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uTexture2;
varying vec3 v_position;
attribute float aRandom;
varying vec3 vecPos;
uniform vec2 uMouse;
uniform vec2 uResolution;


float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
      uv -= disc_center;
      float dist = sqrt(dot(uv, uv));
      return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}
void main()
{
    vUv = uv;
    v_position = position.xyz;
    float stepblend = clamp(v_position.x + v_position.y + 3.*blend - 1., 0., 1.);
    float roundblend = sin(3.1415926*blend);
    
    float original = texture2D(uTexture, vUv).r;
    float target = texture2D(uTexture2, vUv).r;

    float c = circle(vUv, uMouse, 0.01, 0.2);
    v_position.z = 0.15* mix(original+c, target+c, stepblend) + roundblend*0.1*sin(v_position.x*15. + uTime);
    
    
   
    
    // v_position.z += original*sin(uTime*2.5)*0.1*v_position.y;
    // v_position.z += target*sin(uTime*2.5)*0.1*v_position.y;

    v_position.x += roundblend*0.3*sin(v_position.x + v_position.y + blend);
    v_position.y += roundblend*0.2*sin(v_position.x + v_position.y + blend);
   

    vecPos = (modelViewMatrix * vec4(v_position, 1.0)).xyz;
    gl_Position = projectionMatrix * vec4(vecPos, 1.0);
  

    
    
}