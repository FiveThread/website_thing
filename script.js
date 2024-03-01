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

function getRandomInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max-min +1)) + min;
}

function drawRect(gl, x, y, width, height)
{
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array
    ([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}


//draw the scene
function drawScene(canvas, gl, program, posAttribLoc, resUniformLoc, colourUniformLoc, posBuffer)
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
    gl.uniform2f(resUniformLoc, gl.canvas.width, gl.canvas.height);

    for(var ii = 0; ii < 50; ii++)
    {
        drawRect(gl, getRandomInt(20, 300), getRandomInt(20, 300), getRandomInt(20, 300), getRandomInt(20, 300));
        gl.uniform4f(colourUniformLoc, Math.random(), Math.random(), Math.random(), 1);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
    
        gl.drawArrays(primitiveType, offset, count);
    }
}


function main()
{
    if(!webgl) {window.alert("Your browser does not support webgl. HAHHAHHAHAHHAHA nerd :3"); return;}

    var vertexShader = createShader(webgl, webgl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(webgl, webgl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(webgl, vertexShader, fragmentShader);

    var posAttribLoc = webgl.getAttribLocation(program, "a_position");
    var resUniformLoc = webgl.getUniformLocation(program, "u_resolution"); 
    var colourUniformLoc = webgl.getUniformLocation(program, "u_colour");



    var posBuffer = webgl.createBuffer();

    webgl.bindBuffer(webgl.ARRAY_BUFFER, posBuffer);

    var positions =
    [
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30,
    ];

    webgl.bufferData(webgl.ARRAY_BUFFER,new Float32Array(positions), webgl.STATIC_DRAW);

    drawScene(webgl.canvas, webgl, program, posAttribLoc, resUniformLoc, colourUniformLoc, posBuffer);
}

main();
