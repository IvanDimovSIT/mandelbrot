const MAX_ITERATIONS = 1000;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const TIME_BETWEEN_FRAMES_MS = 20;
const ZOOM_PER_FRAME = 20;
const ZOOM_X = 0.518;
const ZOOM_Y = 0.59;

class Color{
    constructor(r, g, b){
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

function mandelbrotToColor(value){
    const value2 = value*value;
    return new Color(
        100*value2,
        200*value2,
        255*Math.sqrt(value));
}

function scaleX(x, minX, maxX){
    return ((x-minX)/(maxX - minX))*2.47 - 2.0;
}

function scaleY(y, minY, maxY){
    return ((y-minY)/(maxY - minY))*2.24 - 1.12;
}

function mandelbrot(px, py, minX, maxX, minY, maxY){
    const x0 = scaleX(px, minX, maxX);
    const y0 = scaleY(py, minY, maxY);
    let x = 0;
    let y = 0;
    let xSquared = 0;
    let ySquared = 0;
    let i;
    for(i=0; (i<MAX_ITERATIONS) && (xSquared+ySquared<=4); i++){
        let xTemp = xSquared - ySquared + x0;
        y = 2*x*y + y0;
        x = xTemp;
        xSquared = x*x;
        ySquared = y*y;
    }

    return 1 - i/MAX_ITERATIONS;
}

function putPixel(ctx, x, y, color){
    ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    ctx.fillRect(x, y, 1, 1);
}

function drawMandelbrot(ctx, zoom, zoomX, zoomY){
    const zoomXMin = zoomX - zoomX*zoom;
    const zoomXMax = zoomX + (WIDTH-zoomX)*zoom;
    const zoomYMin = zoomY - zoomY*zoom;
    const zoomYMax = zoomY + (HEIGHT-zoomY)*zoom;
    for(let y=0; y<HEIGHT; y++){
        for(let x=0; x<WIDTH; x++){
            putPixel(
                ctx,
                x,
                HEIGHT-y-1,
                mandelbrotToColor(mandelbrot(x,y,zoomXMin,zoomXMax,zoomYMin,zoomYMax))
            );
        }
    }
}

async function main()
{
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    for(let i=1; true; i+= ZOOM_PER_FRAME){
        drawMandelbrot(ctx, i, ZOOM_X*WIDTH, ZOOM_Y*HEIGHT);
        await new Promise(resolve => setTimeout(resolve, TIME_BETWEEN_FRAMES_MS));
    }
}

main();
