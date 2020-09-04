class Raytracer {

    constructor(canvas) {
    
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        if(!navigator.gpu) {
            throw new Error("WebGPU is not available in this browser.")
        }

    }

    async createGPUBuffer(arrayBuf, mappedAtCreation, usage) {
        return this.device.createBuffer({
            mappedAtCreation: mappedAtCreation,
            size: arrayBuf.byteLength,
            usage: usage
        });
    };

    async initBuffers() {

        this.gpuBuffers = {};
        this.buffers = {};

        // one ray per pixel on screen
        this.buffers.rayOrgBuf = new Float32Array(canvas.width * canvas.height * 3);
        this.buffers.rayDirBuf = new Float32Array(canvas.width * canvas.height * 3);

        this.gpuBuffers.rayOrgBuf = await this.createGPUBuffer(this.buffers.rayOrgBuf, true, GPUBufferUsage.STORAGE);
        let arrayBufRayOrg = this.gpuBuffers.rayOrgBuf.getMappedRange();
        new Float32Array(arrayBufRayOrg).set(this.buffers.rayOrgBuf);
        this.gpuBuffers.rayOrgBuf.unmap();

        this.gpuBuffers.rayDirBuf = await this.createGPUBuffer(this.buffers.rayDirBuf, true, GPUBufferUsage.STORAGE);
        let arrayBufRayDir = this.gpuBuffers.rayDirBuf.getMappedRange();
        new Float32Array(arrayBufRayDir).getMappedRange();
        this.gpuBuffers.rayDirBuf.unmap();

    }

    async init() {

        this.adapter = await navigator.gpu.requestAdapter();
        this.device = await this.adapter.requestDevice();

        await this.initBuffers();

    }

}

const canvas = document.getElementById("webgpu-canvas");
const raytracer = new Raytracer(canvas);
raytracer.init();