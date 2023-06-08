import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MyEstacion } from './my-estacion';

@Injectable({
  providedIn: 'root'
})
export class AemetService {

  
  private estaciones = [];
  private estacionesClima: any =[];
  private estacionClimaF: MyEstacion[] =[];

  private apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnb21lemRvbWluZ3VlemFpdG9yMjAwMUBnbWFpbC5jb20iLCJqdGkiOiJjZTc0YTA1Zi02NDU2LTRmNmYtOTM5ZC0wNWIwZmNjZWFiNzEiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTY4NTk3OTY2OSwidXNlcklkIjoiY2U3NGEwNWYtNjQ1Ni00ZjZmLTkzOWQtMDViMGZjY2VhYjcxIiwicm9sZSI6IiJ9.5aRbn9-8xV1plu1LQ4JO4OMLjYpydscUGjqzm7UDmYI';

  constructor(private http: HttpClient) { }


  getEstaciones(): Observable<any> {
    const url = `https://opendata.aemet.es/opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones/?api_key=${this.apiKey}`; // URL de la API de AEMET para obtener estaciones

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "cache-control": "no-cache"
    });
    console.log("Cargando estaciones...")
    return this.http.get(url, { headers: headers });
  }
  getEstacionesURL(datos: any): any {
    const jsonURL = datos;

    fetch(jsonURL)
      .then(response => response.json())
      .then(jsonData => {
        this.estaciones = jsonData;
        console.log(this.estaciones);
        return this.estaciones;
        
      })
      .catch(error => {
        console.error('Error al obtener el archivo JSON:', error);
      });
   }
   getEst(): any {
    console.log("Cargando Estaciones 2---")
    console.log(this.estaciones)
    return this.estaciones;
   }
  //  getClima(): MyEstacion[] {
  //   console.log("Cargando climas ---")
  //   console.log(this.estacionesClima)
  //   console.log(this.estacionesClima[1][0].nombre,)

  //   for(let i=0; i<this.estacionesClima.length; i++){
  //     let newEstacion = { 
  //       position: {
  //         lat: this.estacionesClima[i][0].latitud,
  //         lng: this.estacionesClima[i][0].longitud,
  //       },
  //       nombre: this.estacionesClima[i][0].nombre,
  //       provincia: this.estacionesClima[i][0].provincia,
  //       indicativo: this.estacionesClima[i][0].indicativo,
  //       fechaIni: this.estacionesClima[i][0].nombre,
  //       fechaFin: this.estacionesClima[i][0].nombre,
  //       clima:" Buscando..."

  //     }
  //     this.estacionClimaF.push(newEstacion)
  //   }
  //   console.log("Mostrando estaciones con clima")
  //   console.log(this.estacionClimaF)
  //   return this.estacionClimaF;
  //  }

  async getClimaEstacionUrl(datos: any): Promise<any> {
    try {
      const jsonURL = datos;
      //console.log(jsonURL);
      const response = await fetch(jsonURL);
      const jsonData = await response.json();
      
      this.estacionesClima=jsonData;
      //console.log(this.estacionesClima);
      
      return this.estacionesClima;
    } catch (error) {
      console.error('Error al obtener el clima de las estaciones:', error);
    }
  }
  

  getClimaEstacion(estacionAct: MyEstacion): Observable<any> {
    console.log("Obtenendo los datos de ...")
    console.log(estacionAct)
    const url = `https://opendata.aemet.es/opendata/api/valores/climatologicos/diarios/datos/fechaini/${estacionAct.fechaIni}/fechafin/${estacionAct.fechaFin}/estacion/${estacionAct.indicativo}/?api_key=${this.apiKey}`

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "cache-control": "no-cache"
    });
    console.log("Cargando estaciones...")
    return this.http.get(url, { headers: headers });
  }


}
