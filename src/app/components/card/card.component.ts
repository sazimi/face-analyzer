import { Component, OnInit, ViewChild } from '@angular/core';
import { FaceApiService } from 'src/app/services/face-api.service';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  loading = false;
  public detectedFaces: any;
  public identifiedPersons = [];
  public imageUrl: string;
  public multiplier: number;
  public personGroups = [];
  public selectedFace: any;
  public selectedGroupId = '';
  @ViewChild('mainImg') mainImg;

  constructor(private faceApi: FaceApiService) { }

  ngOnInit() {
    this.loading = true;
  }

  detect(imgUrl) {
    this.loading = true;
    this.faceApi.detect(imgUrl).subscribe(data => {
      this.detectedFaces = data;
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
