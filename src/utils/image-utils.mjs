import imageSize from "image-size";
import sharp from 'sharp';

export async function imageStats(buffer) {
    const {width, height, type: ext} = imageSize(buffer);
    return {width, height, ext};
}

export async function resize(buffer, width, height) {
    return sharp(buffer).resize(width, height).toBuffer();
}
