import { createWholeShader, setShaderAttribute, setShaderUniformMat4, setShaderUniformVec3 } from "./shaders.js";

let objectsArray = [];
let deltaTime = 0;

function Vec3(X = 0.0, Y = 0.0, Z = 0.0) {
    this.x = X;
    this.y = Y;
    this.z = Z;
}

function Object(name, positions, scale, shaders, buffers, textures) {
    this.name = name;
    let position = positions;
    let size = scale;
    let shader = shaders;
    let buffer = buffers;
    let texture = textures;
    let texCoordOffset = [0.0, 0.0, 0.0];

    this.moveObject = function(X = 0, Y = 0, Z = 0) {
        position.x += X;
        position.y += Y;
        position.z += Z;
    }

    this.offsetTexture = function(X, Y) {
        texCoordOffset[0] += X;
        texCoordOffset[1] += Y;
    }

    this.getPosition = function() {
        return position;
    }

    this.changeTexture = function(newTexture) {
        texture = newTexture;
    }

    this.draw = function(gl, projectionMatrix) {
        const modelViewMatrix = mat4.create();
      
        mat4.translate(
          modelViewMatrix, // destination matrix
          modelViewMatrix, // matrix to translate
          [position.x, position.y, position.z]
        ); // amount to translate

        mat4.scale(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            [size.x, size.y, size.z]
          ); // amount to translate

        setShaderAttribute(gl, buffer, shader, "vertexPosition", 2);
        setShaderAttribute(gl, buffer, shader, "vertexColor", 4);
        setShaderAttribute(gl, buffer, shader, "textureCoord", 2);

        gl.useProgram(shader.programInfo.program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shader.programInfo.uniformLocations.uSampler, 0);
        
        setShaderUniformMat4(gl, shader, projectionMatrix, "projectionMatrix");
        setShaderUniformMat4(gl, shader, modelViewMatrix, "modelViewMatrix");
        setShaderUniformVec3(gl, shader, texCoordOffset, "TexCoordOff");
        {
          const offset = 0;
          const vertexCount = 4;
          gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
}

function addNewObject(name, Xpos, Ypos, Zpos, Xsiz, Ysiz, Zsiz, shader, buffers, texture)
{
    const Pos = new Vec3(Xpos, Ypos, Zpos);
    const Siz = new Vec3(Xsiz, Ysiz, Zsiz);
    let object = new Object(name, Pos, Siz, shader, buffers, texture);
    objectsArray.push(object);
    return object;
}

function drawScene(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  
    for(let i=0; i<objectsArray.length; i++) {
        objectsArray[i].draw(gl, projectionMatrix);
    }
}

function renderScene(gl, update) {
    let then = 0;
    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;

        update(deltaTime);

        drawScene(gl);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

export { renderScene, addNewObject, objectsArray };