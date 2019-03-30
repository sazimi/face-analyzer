import { Component, OnInit, ViewChild } from '@angular/core';
import { FaceApiService } from 'src/app/services/face-api.service';
import { EmotivePoint } from "../../shared/models/emotivePoint";
import { Face } from "../../shared/models/faces";
import { Rect } from "../../shared/models/rect";



@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  loading = false;
  detectedFaces: any;
  identifiedPersons = [];
  imageUrl: string;
  multiplier: number;
  personGroups = [];
  selectedFace: any;
  selectedGroupId = '';
  @ViewChild('mainImg') mainImg;

  constructor(private faceApi: FaceApiService) { }

  ngOnInit() {
    this.loading = true;
  }

  detect(imgUrl) {
    this.loading = true;
    this.faceApi.detect(imgUrl).subscribe(data => {

      let faces = [];
      for (let f of data) {
        let scores = new EmotivePoint(f.faceAttributes.emotion);
        console.log('scores', scores);
        let faceRectangle = new Rect(f.faceRectangle);
        console.log('faceRectangle', faceRectangle);
        let face = new Face(scores, faceRectangle, f.faceAttributes.gender);
        faces.push(face);
      }
      this.detectedFaces = faces;
      console.log("FACES", faces);
      console.log('**detect results', this.detectedFaces);
      this.loading = false;
    });

  }

  faceClicked(face) {
    this.selectedFace = face;
    let identifiedPerson;
    if (this.selectedFace.identifiedPersonId) {
      identifiedPerson = this.identifiedPersons.map((identifiedPerson) => {
        identifiedPerson.personId = face.identifiedPersonId
      });
      this.selectedFace.name = identifiedPerson.name;
    }
  }

  imageLoaded($event) {
    this.selectedFace = null;
    this.detectedFaces = [];
    let img = this.mainImg.nativeElement;
    this.multiplier = img.clientWidth / img.naturalWidth;
  }

}
