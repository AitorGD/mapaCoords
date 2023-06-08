import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { Coordenada } from './coordenadas';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class CoordCompleteService {
  //private coordenadasDB: AngularFireList<coordenadas>;
  // public fruits: Array<object> = [
  //   { title: "Banana", color: "Yellow" },
  //   { title: "Apple", color: "Red" },
  //   { title: "Guava", color: "Green" },
  //   { title: "Strawberry", color: "Red" }
  // ];
  coordsStringDB: any;

  constructor(private http: HttpClient) {

    // this.http.get<Coordenada[]>('./../../assets/coorIncidencias.json').subscribe(data => {
    //   this.coordenadasDB = data;
    // });

   }

   obtenerCoor(): Promise<any[]> {

    return new Promise<any[]>((resolve, reject) => {
      this.http.get<any[]>('http://localhost:8080/api/coordenadas').subscribe((data) => {
        this.coordsStringDB = data;
        //console.log(this.coordsStringDB);
        resolve(this.coordsStringDB);
      }, (error) => {
        reject(error);
      });
    });
  }


}