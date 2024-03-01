var canvas = document.querySelector("canvas");
var webgl = canvas.getContext("webgl");

var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

//compile the shader sources
function createShader(gl, type, source)
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var sus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(sus) return shader;
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

//create shader program
function createProgram(gl, vertexShader, fragmentShader)
{
    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var sus = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(sus) return program;

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}


//resize the canvas size to fit the display
function resizeCanvasToDisplaySize(canvas)
{
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    //check if canvasis not the same size
    const needResize = canvas.width !== displayWidth ?? canvas.height !== displayHeight;

    if(needResize)
    {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}


//draw the scene
function drawScene(canvas, gl, program, posAttribLoc, posBuffer)
{
    resizeCanvasToDisplaySize(canvas);

    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    //clear canvas
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //use shader program
    gl.useProgram(program);

    //use data from buffer and supply it to attrib in shader
    gl.enableVertexAttribArray(posAttribLoc);

    //bind pos buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

    //tell attrib how to get data out of posBuffer
    var size = 2;           //2 components per iteration
    var type = gl.FLOAT;    //data is 32bit float
    var normalize = false;  //dont normalize data
    var stride = 0;         //0 = move forward size * sizeof(type) each iteration to get the next pos
    var offset = 0;         //star at the beginning of the buffer

    //bind current ARRAY_BUFFER to attrib
    gl.vertexAttribPointer(posAttribLoc, size, type, normalize, stride, offset);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;

    gl.drawArrays(primitiveType, offset, count);
}


function main()
{
    if(!webgl) {window.alert("Your browser does not support webgl. HAHHAHHAHAHHAHA nerd :3"); return;}

    var vertexShader = createShader(webgl, webgl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(webgl, webgl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(webgl, vertexShader, fragmentShader);

    var posAttribLoc = webgl.getAttribLocation(program, "a_position"); 

    var posBuffer = webgl.createBuffer();

    webgl.bindBuffer(webgl.ARRAY_BUFFER, posBuffer);

    var positions =
    [
        0, 0,
        0, 0.5,
        0.7, 0
    ];

    webgl.bufferData(webgl.ARRAY_BUFFER,new Float32Array(positions), webgl.STATIC_DRAW);

    drawScene(webgl.canvas, webgl, program, posAttribLoc, posBuffer);
}

main();
