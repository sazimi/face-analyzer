import { MOJIS } from "./mojis";
import { Rect } from "./rect";
// import * as emoji from "emoji-dictionary";

export class Face {
  emotivePoint;
  faceRectangle;
  moji;
  mojiIcon;
  gender;

  constructor(emotivePoint, faceRectangle: Rect, gender) {
    this.emotivePoint = emotivePoint;
    this.faceRectangle = faceRectangle;
    this.moji = this.chooseMoji(this.emotivePoint);
    this.mojiIcon = this.moji.emojiIcon;
    this.gender = gender;
  }

  get mojiName() {
    // Given an emoji like 😴 returns the word version, like 'sleepy'
    //return emoji.getName(this.mojiIcon);
    return 'sleepy'
  }

  chooseMoji(point) {
    let closestMoji = null;
    let closestDistance = Number.MAX_VALUE;
    for (let moji of MOJIS) {
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
