var vertexShaderText = [
    'precision mediump float;',
    'attribute vec3 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    'void main(){',
    '   fragColor = vertColor;',
    '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '}'
].join('\n');

var fragmentShaderText = [
    'precision mediump float;',
    'varying vec3 fragColor;',
    'void main(){',
    '   gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');

const toRadian = (deg) => {
    return deg/180 * Math.PI;
}

var init = () => {
    const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;
    var canvas = document.getElementById("surface");
    var gl = canvas.getContext("webgl");
    if(!gl){
        gl = canvas.getContext("experimental-webgl");
    }
    if(!gl){
        alert("Doesnt support");
    }
    gl.clearColor(0.6,0.6,0.6,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error("Error vertex!");
        return;
    }
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error("Error fragment!");
        return;
    }
    console.log("no compile error");

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error("Error program!");
        return;
    }
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error("error validate!");
        return;
    }

    var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

    var limasVertices = [
        // X, Y, Z           R, G, B
		
		// Left
		-1.0, 3.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 3.0, 1.0,   0.75, 0.25, 0.5,
		0.0, 5.0, 0.0,  0.75, 0.25, 0.5,

		// Right
		1.0, 3.0, -1.0,    0.25, 0.25, 0.75,
		1.0, 3.0, 1.0,   0.25, 0.25, 0.75,
		0.0, 5.0, 0.0,  0.25, 0.25, 0.75,

		// Front
		1.0, 3.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 3.0, 1.0,    1.0, 0.0, 0.15,
		0.0, 5.0, 0.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 3.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 3.0, -1.0,    0.0, 1.0, 0.15,
		0.0, 5.0, 0.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, 3.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, 3.0, 1.0,    0.5, 0.5, 1.0,
		1.0, 3.0, 1.0,     0.5, 0.5, 1.0,
		1.0, 3.0, -1.0,    0.5, 0.5, 1.0,
    ];

    var limasIndices = [
        // Left
		24, 25, 26,
		// Right
		27, 28, 29,
		// Front
		30, 31, 32,
		// Back
		33, 34, 35,
		// Bottom
		36, 37, 38,
		38, 39, 36
    ]
    boxVertices = boxVertices.concat(limasVertices)
    boxIndices = boxIndices.concat(limasIndices)

    var boxVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);


    var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttributeLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6*Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.vertexAttribPointer(
        colorAttributeLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6*Float32Array.BYTES_PER_ELEMENT,
        3*Float32Array.BYTES_PER_ELEMENT,
    );

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);

    gl.useProgram(program);

    var matWorldLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewLocation = gl.getUniformLocation(program, 'mView');
    var matProjLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0,2,-10], [0,2,0], [0,1,0]);
    mat4.perspective(projMatrix, toRadian(45), canvas.width / canvas.height, 0.1,1000.0);

    gl.uniformMatrix4fv(matWorldLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjLocation, gl.FALSE, projMatrix);

    var id = new Float32Array(16);
    mat4.identity(id);
    var rotAngle = 0;
    var loop = () => {
        rotAngle = performance.now() / 1000 * Math.PI;
        mat4.rotate(worldMatrix, id, rotAngle, [0,1,0]);
        gl.uniformMatrix4fv(matWorldLocation, gl.FALSE, worldMatrix);
        gl.clearColor(0.6,0.6,0.6,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}