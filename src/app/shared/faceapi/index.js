"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const node_fetch_1 = require("node-fetch");
const path = require("path");
const emotivePoint_1 = require("../models/emotivePoint");
const faces_1 = require("../models/faces");
const rect_1 = require("../models/rect");
const API_URL = process.env["FACE_API_URL"];
const API_KEY = process.env["FACE_API_KEY"];
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function callFaceApi(context, contentType, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const faceApiUrlWithParams = API_URL +
            "/detect?returnFaceId=false&returnFaceLandmarks=false&returnFaceAttributes=emotion";
        let response;
        try {
            response = yield node_fetch_1.default(faceApiUrlWithParams, {
                headers: {
                    "Ocp-Apim-Subscription-Key": API_KEY,
                    "Content-Type": contentType
                },
                method: "POST",
                body: body
            });
        }
        catch (error) {
            throw new Error(`Call to Face API with URL: [${API_URL}] threw exception: [${error.message}]. Check that the FACE_API_URL environment variable is set`);
        }
        if (!response.ok) {
            context.log(`Call to Face API with URL: [${API_URL}] failed with status [${response.status}: ${response.statusText}]`);
            if (response.status == 429) {
                context.log(`${response.statusText}: waiting 30 seconds and trying again`);
                yield timeout(30000);
                return yield callFaceApi(context, contentType, body);
            }
            else {
                throw new Error(`Call to Face API with URL: [${API_URL}] failed with status [${response.status}: ${response.statusText}]`);
            }
        }
        else {
            return yield response.json();
        }
    });
}
function getEmotionFromLocalProxyImage(context, emoji) {
    return __awaiter(this, void 0, void 0, function* () {
        let trainEmojiFileName = path.resolve(__dirname, "../proxy-images/" + emoji + ".jpg");
        const buffer = fs.readFileSync(trainEmojiFileName);
        let faceData = yield callFaceApi(context, "application/octet-stream", buffer);
        return faceData[0].faceAttributes.emotion;
    });
}
exports.getEmotionFromLocalProxyImage = getEmotionFromLocalProxyImage;
function getFaces(context, imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = JSON.stringify({ url: imageUrl });
        let faceData = yield callFaceApi(context, "application/json", body);
        let faces = [];
        for (let f of faceData) {
            let scores = new emotivePoint_1.EmotivePoint(f.faceAttributes.emotion);
            let faceRectangle = new rect_1.Rect(f.faceRectangle);
            let face = new faces_1.Face(scores, faceRectangle);
            faces.push(face);
        }
        return faces;
    });
}
exports.getFaces = getFaces;
//# sourceMappingURL=index.js.map