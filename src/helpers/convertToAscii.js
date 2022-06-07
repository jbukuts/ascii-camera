import json from '../json/char_map.json';

const HEIGHT = 480;
const WIDTH = 640;
const FONT_SIZE = 2;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const asciiCanvas = document.createElement('canvas');
const ctxAscii = asciiCanvas.getContext('2d');
asciiCanvas.width = WIDTH;
asciiCanvas.height = HEIGHT*FONT_SIZE;

let charSet = [...new Set(Object.values(json))];
charSet = charSet.slice(charSet.length-255-2, charSet.length-1).reverse()
const reducer = (accumulator, currentValue) => accumulator + currentValue;

const convertToAscii = async (video, frameColor, resReduce, destination) => {

    await ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

    const myImageData = await ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let pixels = myImageData.data;

    let grayData = [];
    for (var i = 0; i < pixels.length; i += 4*resReduce)
        grayData.push(charSet[parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3)]);

    ctxAscii.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);
    ctxAscii.fillStyle = '#000';
    ctxAscii.fillRect(0, 0, asciiCanvas.width, asciiCanvas.height);

    ctxAscii.fillStyle = `rgb(${frameColor[0]},${frameColor[1]},${frameColor[2]})`;
    ctxAscii.font = `${FONT_SIZE*resReduce}px consola`;

    
    let c = FONT_SIZE;
    for(var j=0;j<(WIDTH*HEIGHT)/2; j+= WIDTH) {
        let row = grayData.slice(j, (j+WIDTH-1));
        let rowStr = row.reduce(reducer, "");
        ctxAscii.fillText(rowStr, 0, c);
        c += FONT_SIZE*resReduce;
    }

    destination.drawImage(
        asciiCanvas, 0, 0,
        asciiCanvas.width, asciiCanvas.height, 0, 0, 
        asciiCanvas.width, asciiCanvas.height*.5
    );
    //return ctxAscii.getImageData(0,0,width,height);
    return;
}

export default convertToAscii;