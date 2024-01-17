function initBuffers(gl, positionsArray, colorsArray, TexCoordsArray) {
    const positionBuffer = initBuffer(gl, positionsArray);
  
    const colorsBuffer = initBuffer(gl, colorsArray);

    const texCoordsBuffer = initBuffer(gl, TexCoordsArray);

    return {
      vertexPosition: positionBuffer,
      vertexColor: colorsBuffer,
      textureCoord: texCoordsBuffer,
    };
}
  
function initBuffer(gl, positionsArray) {
    const positionBuffer = gl.createBuffer();
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsArray), gl.STATIC_DRAW);
  
    return positionBuffer;
}
  
export { initBuffers };