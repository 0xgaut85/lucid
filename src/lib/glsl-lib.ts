import { CURSOR, ANIMATION, ROOT_ORB, LEVEL1, LEVEL2_SOCIALS } from './orb-config'

const l1 = LEVEL1.nodes
const l2 = LEVEL2_SOCIALS.nodes

export const GLSL_SMOOTHERSTEP = `
float smootherstep(float t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
`

export const GLSL_SPLIT_ANIMATION = `
float splitProgress(float progress, float rnd) {
  float stagger = rnd * 0.5;
  float raw = progress * (1.0 + stagger) - stagger * 0.35;
  return smoothstep(0.0, 1.0, clamp(raw, 0.0, 1.0));
}
`

export const GLSL_DISPERSION = `
vec3 disperseOffset(float progress, float rnd, vec3 dir, float strength) {
  return dir * sin(progress * 3.14159) * strength * rnd;
}
`

export const GLSL_CURSOR = `
void cursorInteract(inout vec3 pos, vec3 pointer, float cameraZ, out float cursorGlow) {
  cursorGlow = 0.0;
  float zScale = cameraZ / ${CURSOR.referenceCameraZ.toFixed(1)};
  float interactRadius = ${CURSOR.baseRadius.toFixed(1)} * zScale;
  float dist = distance(pointer, pos);
  if (dist < interactRadius) {
    vec3 away = pos - pointer;
    float len = length(away);
    if (len > 0.001) {
      away /= len;
    } else {
      away = vec3(0.0, 1.0, 0.0);
    }
    float norm = 1.0 - dist / interactRadius;
    float falloff = norm * norm * norm;
    pos += away * falloff * ${CURSOR.pushStrength.toFixed(1)} * zScale;
    float glowNorm = 1.0 - smoothstep(0.0, interactRadius * 0.5, dist);
    cursorGlow = glowNorm * glowNorm;
  }
}
`

export const GLSL_IDLE_MOTION = `
vec3 idleMotion(vec3 origPos, float rnd, float time) {
  return vec3(
    cos(time * 0.4 + origPos.y * 2.0 + rnd * 10.0) * 0.15,
    sin(time * 0.5 + origPos.x * 2.0 + rnd * 10.0) * 0.15,
    sin(time * 0.6 + origPos.z * 2.0 + rnd * 10.0) * 0.15
  );
}
`

export function buildVertexShader(): string {
  return `
uniform float uTime;
uniform vec3 uPointer;
uniform float uHoverProgress;
uniform float uSocialsProgress;
uniform float uAgentProgress;
uniform float uCameraZ;
uniform vec3 uForwardFlags;
attribute vec3 originalPosition;
attribute float aRandom;
attribute vec3 aAgentTarget;
attribute float aAgentBrightness;
varying float vDistance;
varying float vRandom;
varying float vRadialDist;
varying float vCursorGlow;
varying float vSplitProgress;
varying float vGroupFade;
varying float vIsLink;
varying float vAgentAlpha;

${GLSL_SMOOTHERSTEP}
${GLSL_SPLIT_ANIMATION}
${GLSL_DISPERSION}
${GLSL_CURSOR}
${GLSL_IDLE_MOTION}

void main() {
  vRandom = aRandom;
  vIsLink = 0.0;
  vAgentAlpha = 1.0;

  vec3 nPos = normalize(originalPosition);
  vec3 dirTL = normalize(vec3(${l1[0].center[0] < 0 ? '-0.7' : '0.7'}, 0.7, 0.0));
  vec3 dirTR = normalize(vec3(0.7, 0.7, 0.0));
  vec3 dirB  = normalize(vec3(0.0, -1.0, 0.0));

  float wTL = max(0.0, dot(nPos, dirTL));
  float wTR = max(0.0, dot(nPos, dirTR));
  float wB  = max(0.0, dot(nPos, dirB));

  vec3 targetCenter;
  float isSocials = 0.0;
  float isAgent = 0.0;
  if (wTL > wTR && wTL > wB) {
    targetCenter = vec3(${l1[0].center.map(v => v.toFixed(1)).join(', ')});
    isAgent = 1.0;
  } else if (wTR > wB) {
    targetCenter = vec3(${l1[1].center.map(v => v.toFixed(1)).join(', ')});
    isSocials = 1.0;
  } else {
    targetCenter = vec3(${l1[2].center.map(v => v.toFixed(1)).join(', ')});
  }

  float smallRadius = ${l1[0].radius.toFixed(1)};

  float theta = aRandom * 6.2831853 + originalPosition.x * 3.17;
  float cosPhi = 2.0 * fract(aRandom * 137.51 + originalPosition.y * 0.53) - 1.0;
  float sinPhi = sqrt(1.0 - cosPhi * cosPhi);
  vec3 sphereDir = vec3(sinPhi * cos(theta), sinPhi * sin(theta), cosPhi);

  float origDist = length(originalPosition);
  float normalizedDist = origDist / ${ROOT_ORB.radius.toFixed(1)};
  float smallDist = pow(normalizedDist, 1.8) * smallRadius;

  vec3 targetPos = targetCenter + sphereDir * smallDist;

  // First split
  float easedL1 = smootherstep(uHoverProgress);
  float particleProgress = splitProgress(easedL1, aRandom);
  vec3 pos = mix(originalPosition, targetPos, particleProgress);

  vec3 disperseDir = normalize(vec3(
    sin(aRandom * 127.1 + originalPosition.x * 4.37),
    cos(aRandom * 269.5 + originalPosition.y * 3.91),
    sin(aRandom * 419.2 + originalPosition.z * 5.13)
  ));
  pos += disperseOffset(particleProgress, aRandom, disperseDir, ${ANIMATION.dispersion.toFixed(1)}) * uForwardFlags.x;

  vSplitProgress = particleProgress;

  float bigOrbRadial = normalizedDist;
  float smallOrbRadial = smallDist / smallRadius;
  vRadialDist = mix(bigOrbRadial, smallOrbRadial, particleProgress);

  // Second-level split — socials into sub-orbs + links
  if (isSocials > 0.5 && uSocialsProgress > 0.001) {
    vec3 sDirA = normalize(vec3(-0.7, 0.7, 0.0));
    vec3 sDirBd = normalize(vec3( 0.7, 0.7, 0.0));
    vec3 sDirCd = normalize(vec3( 0.0,-1.0, 0.0));
    float sA = max(0.0, dot(sphereDir, sDirA));
    float sBd = max(0.0, dot(sphereDir, sDirBd));
    float sCd = max(0.0, dot(sphereDir, sDirCd));

    vec3 subCenter;
    if (sA > sBd && sA > sCd) {
      subCenter = vec3(${l2[0].center.map(v => v.toFixed(1)).join(', ')});
    } else if (sBd > sCd) {
      subCenter = vec3(${l2[1].center.map(v => v.toFixed(1)).join(', ')});
    } else {
      subCenter = vec3(${l2[2].center.map(v => v.toFixed(1)).join(', ')});
    }

    float subRad = ${l2[0].radius.toFixed(1)};

    // Link detection
    float linkHash = fract(sin(dot(originalPosition.xy, vec2(12.9898, 78.233))) * 43758.5453);
    float isLink = step(linkHash, ${LEVEL2_SOCIALS.linkConfig.threshold.toFixed(3)});

    vec3 subTargetPos;

    if (isLink > 0.5) {
      vec3 cA = vec3(${l2[0].center.map(v => v.toFixed(1)).join(', ')});
      vec3 cB = vec3(${l2[1].center.map(v => v.toFixed(1)).join(', ')});
      vec3 cC = vec3(${l2[2].center.map(v => v.toFixed(1)).join(', ')});

      float lineSelect = fract(sin(dot(originalPosition.yz, vec2(43.13, 17.71))) * 29173.1);
      float linePos = fract(sin(dot(originalPosition.xz, vec2(91.37, 53.89))) * 61549.3);

      if (lineSelect < 0.333) {
        subTargetPos = mix(cA, cB, linePos);
      } else if (lineSelect < 0.666) {
        subTargetPos = mix(cA, cC, linePos);
      } else {
        subTargetPos = mix(cB, cC, linePos);
      }
      subTargetPos.z += (fract(linkHash * 531.7) - 0.5) * ${LEVEL2_SOCIALS.linkConfig.noise.toFixed(3)};
      vIsLink = 1.0;
    } else {
      float sTheta2 = aRandom * 6.2831853 + sphereDir.x * 7.13;
      float sCosPhi2 = 2.0 * fract(aRandom * 311.7 + sphereDir.y * 2.3) - 1.0;
      float sSinPhi2 = sqrt(1.0 - sCosPhi2 * sCosPhi2);
      vec3 subSphDir = vec3(sSinPhi2 * cos(sTheta2), sSinPhi2 * sin(sTheta2), sCosPhi2);
      float subNd = smallDist / smallRadius;
      float subD = pow(subNd, 1.8) * subRad;
      subTargetPos = subCenter + subSphDir * subD;
    }

    float easedL2 = smootherstep(uSocialsProgress);
    float sProgress = splitProgress(easedL2, aRandom);

    pos = mix(pos, subTargetPos, sProgress);

    float sDispStr = mix(${ANIMATION.dispersion.toFixed(1)}, ${ANIMATION.linkDispersion.toFixed(1)}, isLink);
    pos += disperseOffset(sProgress, aRandom, disperseDir, sDispStr) * uForwardFlags.y;

    float subRadialDist = length(subTargetPos - subCenter) / subRad;
    vRadialDist = mix(vRadialDist, mix(subRadialDist, 0.1, isLink), sProgress);
    vSplitProgress = max(particleProgress, sProgress);
  }
  
  // Agent split — morph into humanoid figure
  // All agent effects use the same curve so morph/fade/shrink stay in sync
  float agentCurve = smoothstep(0.0, 1.0, uAgentProgress);
  if (isAgent > 0.5 && uAgentProgress > 0.001) {
    float easedA = smootherstep(uAgentProgress);
    float aProgress = splitProgress(easedA, aRandom);
    
    vec3 transitionNoise = vec3(
      sin(uTime * 2.0 + originalPosition.z * 5.0),
      cos(uTime * 2.1 + originalPosition.x * 5.0),
      sin(uTime * 2.2 + originalPosition.y * 5.0)
    ) * 0.08 * sin(aProgress * 3.14159) * uForwardFlags.z;
    
    vec3 finalPos = aAgentTarget;
    finalPos.y += sin(uTime * 1.2 + originalPosition.x) * 0.025 * aProgress;
    finalPos.x += cos(uTime * 0.8 + originalPosition.y) * 0.015 * aProgress;
    
    pos = mix(pos, finalPos + transitionNoise, aProgress);
    
    vRadialDist = mix(vRadialDist, 0.2, aProgress);
    vSplitProgress = max(particleProgress, aProgress);
    
    vAgentAlpha = mix(1.0, aAgentBrightness, aProgress);
  }

  float overallFade = 1.0;
  if (uSocialsProgress > 0.001) {
    overallFade -= uSocialsProgress * (1.0 - isSocials);
  }
  if (uAgentProgress > 0.001) {
    overallFade -= agentCurve * (1.0 - isAgent);
  }
  vGroupFade = clamp(overallFade, 0.0, 1.0);

  // Cursor interaction — dampen during agent morph so figure isn't disrupted
  float agentDampen = 1.0 - isAgent * agentCurve * 0.85;
  vec3 preCursorPos = pos;
  float cGlow;
  cursorInteract(pos, uPointer, uCameraZ, cGlow);
  pos = mix(pos, preCursorPos, 1.0 - agentDampen);
  vCursorGlow = cGlow * agentDampen;
  vDistance = distance(uPointer, pos);

  float idleScale = 1.0 - isAgent * agentCurve * 0.8;
  pos += idleMotion(originalPosition, aRandom, uTime) * idleScale;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  float baseSize = 10.0 + aRandom * 30.0;
  float sizeBoost = 1.0 + (1.0 - smoothstep(0.0, 0.5, vRadialDist)) * 0.6;
  sizeBoost += vCursorGlow * 0.2;

  float linkShrink = mix(1.0, ${LEVEL2_SOCIALS.linkConfig.sizeFactor.toFixed(1)}, vIsLink * smoothstep(0.0, 1.0, uSocialsProgress));
  float agentShrink = mix(1.0, 0.45, isAgent * agentCurve);
  gl_PointSize = (baseSize * sizeBoost * linkShrink * agentShrink / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`
}

export function buildFragmentShader(): string {
  return `
varying float vDistance;
varying float vRandom;
varying float vRadialDist;
varying float vCursorGlow;
varying float vSplitProgress;
varying float vGroupFade;
varying float vIsLink;
varying float vAgentAlpha;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float distToCenter = length(coord);
  if (distToCenter > 0.5) discard;
  
  float alpha = 1.0 - (distToCenter * 2.0);
  alpha *= (0.3 + vRandom * 0.7);
  
  float coreEdge = mix(0.4, 0.7, vSplitProgress);
  float radialFade = 1.0 - smoothstep(coreEdge, 1.0, vRadialDist);
  alpha *= 0.05 + radialFade * 0.95;
  
  alpha = mix(alpha, 0.4 + vRandom * 0.3, vIsLink);
  
  alpha += vCursorGlow * 0.3;
  alpha *= vGroupFade;
  alpha *= vAgentAlpha;
  
  if (alpha < 0.001) discard;
  
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
`
}
