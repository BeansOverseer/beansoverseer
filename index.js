import { createWholeShader, setShaderAttribute, setShaderUniformMat4, setShaderUniformVec3 } from "./shaders.js";
import { initBuffers } from "./buffers.js";
import { renderScene, addNewObject, objectsArray } from "./render.js";
import { loadTexture } from "./texture.js";

function main() {
    // init WEBGL contexts
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl");
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
    }

    // set square data (should read this from file later...)
    const squarePositions = [1.0, 1.0, // top right
                            -1.0, 1.0, // top left
                             1.0, -1.0, // bottom right
                            -1.0, -1.0]; // bottom left
    const squareColors = [1.0, 1.0, 1.0, 1.0,
                          1.0, 1.0, 1.0, 1.0,
                          1.0, 1.0, 1.0, 1.0,
                          1.0, 1.0, 1.0, 1.0];
    const squareTexCoords = [1.0, 1.0, // top right
                             0.0, 1.0, // top left
                             1.0, 0.0, // bottom right
                             0.0, 0.0]; // bottom left
    // create the buffers to use in drawring calls
    let shader1 = createWholeShader(gl);
    let square1 = initBuffers(gl, squarePositions, squareColors, squareTexCoords);

    // load our textures
    const textures = [loadTexture(gl, "bird.png"), loadTexture(gl, "bird_fly.png"), loadTexture(gl, "UpPipe.png"), loadTexture(gl, "DoPipe.png")
                      ,loadTexture(gl, "Background.png"), loadTexture(gl, "Floor.png")];
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // create objects
    let bird = addNewObject("bird", 0.0, 1.5, -16.0, 0.75, 0.75, 0.75, shader1, square1, textures[0]);
    let background = addNewObject("background", 0.0, 0.5, -17.0, 10.0, 10.0, 1.0, shader1, square1, textures[4]);

    let obstacles = [];
    let yPosPipe = (Math.random() * 7.0) - 3.0;
    obstacles.push(addNewObject("floor", 0.0, -7.0, -15.0, 10.0, 2.0, 1.0, shader1, square1, textures[5]));
    obstacles.push(addNewObject("upward pipe 0", 8.0, -7.0 + yPosPipe, -16.0, 1.0, 5.0, 1.0, shader1, square1, textures[2]));
    obstacles.push(addNewObject("downward pipe 0", 8.0, 7.0 + yPosPipe, -16.0, 1.0, 5.0, 1.0, shader1, square1, textures[3]));
    yPosPipe = (Math.random() * 7.0) - 3.0;
    obstacles.push(addNewObject("upward pipe 1", 15.0, -7.0 + yPosPipe, -16.0, 1.0, 5.0, 1.0, shader1, square1, textures[2]));
    obstacles.push(addNewObject("downward pipe 1", 15.0, 7.0 + yPosPipe, -16.0, 1.0, 5.0, 1.0, shader1, square1, textures[3]));
    yPosPipe = (Math.random() * 7.0) - 3.0;
    obstacles.push(addNewObject("upward pipe 2", 22.0, -7.0 + yPosPipe, -16.0, 1.0, 5.0, 1.0, shader1, square1, textures[2]));
    obstacles.push(addNewObject("downward pipe 2", 22.0, 7.0 + yPosPipe, -16.0, 1.0, 5.0, 1.0, shader1, square1, textures[3]));

    let pressedClick = true;
    let strength = -1.0;
    function update(deltaTime) {
        bird.moveObject(0.0, deltaTime * strength, 0.0);
        strength -= deltaTime * 20.0;

        if(strength >= 0) {
            bird.changeTexture(textures[0]);
        }
        else {
            bird.changeTexture(textures[1]);
        }

        let newyPosPipe = -1;
        obstacles[0].offsetTexture(deltaTime / 8.0, 0.0);
        for(let i=1; i<obstacles.length; i++) {
            obstacles[i].moveObject(-deltaTime * 4.0, 0.0, 0.0);
            if(obstacles[i].getPosition().x <= -11.0) {
                if(newyPosPipe == -1) {
                    newyPosPipe = (Math.random() * 7.0) - 3.0;
                    obstacles[i].getPosition().x = 10.0;
                    obstacles[i].getPosition().y = -7.0 + newyPosPipe;
                }
                else {
                    obstacles[i].getPosition().x = 10.0;
                    obstacles[i].getPosition().y = 7.0 + newyPosPipe;
                    newyPosPipe = -1;
                }
            }
        }

        canvas.addEventListener('click', function(event){
            if(pressedClick == true) {
                strength = 6.5;
                pressedClick = false;
            }
        }, true);
        canvas.addEventListener('click', function(event){
            pressedClick = true;
        }, false);
    }

    renderScene(gl, update);
}

main();
