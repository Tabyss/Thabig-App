import React, { useEffect, useRef } from "react";

interface WebGLBackgroundProps {
    colors?: {
        color1: string;
        color2: string;
        color3: string;
        color4: string;
    };
}

const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
        hex = hex
            .split("")
            .map((c) => c + c)
            .join("");
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
};

export const WebGLBackground: React.FC<WebGLBackgroundProps> = ({
    colors = {
        color1: "#330000",
        color2: "#b32600",
        color3: "#ff8000",
        color4: "#ffe633",
    },
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const colorsRef = useRef(colors);

    useEffect(() => {
        colorsRef.current = colors;
    }, [colors]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

        const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform vec3 u_color3;
      uniform vec3 u_color4;

      void main() {
          vec2 fragCoord = gl_FragCoord.xy;
          
          vec2 uv = fragCoord / max(u_resolution.x, u_resolution.y);
          float t = u_time * 0.4;
          
          vec2 p = uv * 3.5;
          for(int i = 1; i < 5; i++) {
              vec2 newp = p;
              float fi = float(i);
              newp.x += 0.7 / fi * sin(fi * p.y + t + 0.3) + 0.1;
              newp.y += 0.7 / fi * cos(fi * p.x + t + 0.3) - 0.1;
              p = newp;
          }
          
          float flow = (sin(p.x + p.y) + 1.0) * 0.5;
          flow = smoothstep(0.1, 0.9, flow);
          
          vec3 color = mix(u_color1, u_color2, smoothstep(0.0, 0.3, flow));
          color = mix(color, u_color3, smoothstep(0.3, 0.7, flow));
          color = mix(color, u_color4, smoothstep(0.7, 1.0, flow));
          
          gl_FragColor = vec4(color, 1.0);
      }
    `;

        const compileShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(
                    "Shader compile error:",
                    gl.getShaderInfoLog(shader),
                );
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(
            gl.VERTEX_SHADER,
            vertexShaderSource,
        );
        const fragmentShader = compileShader(
            gl.FRAGMENT_SHADER,
            fragmentShaderSource,
        );
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([
            -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const resolutionLocation = gl.getUniformLocation(
            program,
            "u_resolution",
        );
        const timeLocation = gl.getUniformLocation(program, "u_time");
        const c1Location = gl.getUniformLocation(program, "u_color1");
        const c2Location = gl.getUniformLocation(program, "u_color2");
        const c3Location = gl.getUniformLocation(program, "u_color3");
        const c4Location = gl.getUniformLocation(program, "u_color4");

        let animationFrameId: number;
        const startTime = performance.now();

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        };

        window.addEventListener("resize", resize);
        resize();

        const render = () => {
            const currentTime = (performance.now() - startTime) * 0.001;
            gl.uniform1f(timeLocation, currentTime);

            const currentColors = colorsRef.current;
            const rgb1 = hexToRgb(currentColors.color1);
            const rgb2 = hexToRgb(currentColors.color2);
            const rgb3 = hexToRgb(currentColors.color3);
            const rgb4 = hexToRgb(currentColors.color4);

            gl.uniform3f(c1Location, rgb1[0], rgb1[1], rgb1[2]);
            gl.uniform3f(c2Location, rgb2[0], rgb2[1], rgb2[2]);
            gl.uniform3f(c3Location, rgb3[0], rgb3[1], rgb3[2]);
            gl.uniform3f(c4Location, rgb4[0], rgb4[1], rgb4[2]);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(positionBuffer);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full z-0 pointer-events-none"
            style={{ background: "#000" }}
        />
    );
};
