// Vertex shader program
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;
    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
      vTextureCoord = aTextureCoord;
    }
  `;

  const fsSource = `
  varying lowp vec4 vColor;
  varying highp vec2 vTextureCoord;

  uniform sampler2D uSampler;
  uniform highp vec3 TexCoordOff;

  void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord + TexCoordOff.xy) * vColor;
    if(gl_FragColor.a < 0.9) discard;
  }
`;

function createWholeShader(gl) {
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
          vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
          textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
          uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
          TexCoordOff: gl.getUniformLocation(shaderProgram, "TexCoordOff"),
        },
      };

    return {
        shaderProgram,
        programInfo
    };
}

function setShaderAttribute(gl, buffers, shader1, whatAttribute, numberOfComponents) {
    const numComponents = numberOfComponents; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[whatAttribute]);
    gl.vertexAttribPointer(
      shader1.programInfo.attribLocations[whatAttribute],
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(shader1.programInfo.attribLocations[whatAttribute]);
}

function setShaderUniformMat4(gl, shader1, data, location) {
    gl.uniformMatrix4fv(
      shader1.programInfo.uniformLocations[location],
      false,
      data
    );
}
function setShaderUniformVec3(gl, shader1, data, location) {
  gl.uniform3fv(
    shader1.programInfo.uniformLocations[location],
    data
  );
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    // Create the shader program
  
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // If creating the shader program failed, alert
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
      return null;
    }
  
    return shaderProgram;
}
  

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    // Send the source to the shader object
  
    gl.shaderSource(shader, source);
  
    // Compile the shader program
  
    gl.compileShader(shader);
  
    // See if it compiled successfully
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
      );
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
}

export { createWholeShader, setShaderAttribute, setShaderUniformMat4, setShaderUniformVec3 };