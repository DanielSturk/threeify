#pragma once

struct DirectIllumination {
	vec3 color;
	vec3 lightDirection;
};

struct Surface {
	vec3 position;
	vec3 normal;
  vec3 tangent;
  vec3 bitangent;
  vec3 viewDirection;
};

mat3 surfaceToNormalMatrix( in Surface surface ) {
  return mat3(surface.tangent, surface.bitangent, surface.normal);
}
// Get normal, tangent and bitangent vectors.
// based on the glTF reference viewer
void uvToTangentFrame( inout Surface surface, in vec2 uv ) {
  vec3 tempTangent = dFdx( uv.y ) * dFdy(surface.position) - dFdy( uv.y ) * dFdx(surface.position);

  surface.normal = normalize(surface.normal);
  surface.bitangent = -normalize(tempTangent - surface.normal * dot(surface.normal, tempTangent));
  surface.tangent = -cross(surface.normal, surface.bitangent);
}

void rotateTangentFrame( inout Surface surface, in vec2 anisotropicDirection ) {
  // Due to anisoptry, the tangent can be further rotated around the geometric normal.
  // NOTE: The null anisotropic direction value is (1, 0, 0)
  mat3 normalMatrix = surfaceToNormalMatrix( surface );
  surface.tangent = normalMatrix * vec3( anisotropicDirection, 0.0 );
  surface.bitangent = normalMatrix * vec3( anisotropicDirection.y, -anisotropicDirection.x, 0.0 );
}

// this should be done after rotating the tangent frame
void perturbSurfaceNormal_ObjectSpace( inout Surface surface, in vec3 normal ) {
  // NOTE: it appears that if you distort the normal via a normal map you do not have to change tangent or bitangent.
  // It appears that you can do that normal moduluation after this tangent frame construction
  mat3 normalMatrix = surfaceToNormalMatrix( surface );
  surface.normal = normalMatrix * normalize(normal);
}

// this should be done after rotating the tangent frame
void perturbSurfaceNormal_TangentSpace( inout Surface surface, in vec3 normal ) {
  // NOTE: it appears that if you distort the normal via a normal map you do not have to change tangent or bitangent.
  // It appears that you can do that normal moduluation after this tangent frame construction
  mat3 normalMatrix = surfaceToNormalMatrix( surface );
  surface.normal = normalMatrix * normalize( normal );
}
// this likely should be done after perturbing and rotating.
void alignSurfaceWithViewDirection( inout Surface surface ) {

  // For a back-facing surface, the tangential basis vectors are negated.
  float facing = step(0.0, dot(surface.viewDirection, surface.normal)) * 2.0 - 1.0;
  surface.tangent *= facing;
  surface.bitangent *= facing;
  surface.normal *= facing;

}

vec3 bumpMapToNormal( in sampler2D bumpMap, in vec2 uv, in float bumpScale ) {

	float B = texture2D( bumpMap, uv ).x;
	vec2 gradB = vec2(
      texture2D( bumpMap, uv + dFdx( uv ) ).x,
		  texture2D( bumpMap, uv + dFdy( uv ) ).x ) - B;

  gradB *= bumpScale;

	return vec3( gradB.x, gradB.y, 1.0 - length( gradB ) );
}
