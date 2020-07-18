import { planeGeometry } from "../../../lib/geometry/primitives/planeGeometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler } from "../../../lib/math/Euler";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4Inverse,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
} from "../../../lib/math/Matrix4.Functions";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const passGeometry = planeGeometry(2, 2, 1, 1);
  const passMaterial = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
  const equirectangularTexture = new Texture(await fetchImage("/assets/textures/cube/garage/equirectangular.jpg"));
  equirectangularTexture.generateMipmaps = true;

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const passProgram = makeProgramFromShaderMaterial(context, passMaterial);
  const passUniforms = {
    viewToWorld: new Matrix4(),
    screenToView: makeMatrix4Inverse(makeMatrix4PerspectiveFov(45, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio)),
    equirectangularMap: makeTexImage2DFromTexture(context, equirectangularTexture),
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, passGeometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();
    passUniforms.viewToWorld = makeMatrix4Inverse(makeMatrix4RotationFromEuler(new Euler(Math.PI, -now * 0.0002, 0)));
    canvasFramebuffer.renderBufferGeometry(passProgram, passUniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();