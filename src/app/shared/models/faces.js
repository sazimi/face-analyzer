"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mojis_1 = require("./mojis");
const emoji = require("emoji-dictionary");
class Face {
    constructor(emotivePoint, faceRectangle) {
        this.emotivePoint = emotivePoint;
        this.faceRectangle = faceRectangle;
        this.moji = this.chooseMoji(this.emotivePoint);
        this.mojiIcon = this.moji.emojiIcon;
    }
    get mojiName() {
        return emoji.getName(this.mojiIcon);
    }
    chooseMoji(point) {
        let closestMoji = null;
        let closestDistance = Number.MAX_VALUE;
        for (let moji of mojis_1.MOJIS) {
            let emoPoint = moji.emotiveValues;
            let distance = emoPoint.distance(point);
            if (distance < closestDistance) {
                closestMoji = moji;
                closestDistance = distance;
            }
        }
        return closestMoji;
    }
}
exports.Face = Face;
//# sourceMappingURL=faces.js.map