import { Component, OnInit } from '@angular/core';
// import { CoordenadasService } from '../coordenadas.service';
import { MyPoint } from '../my-point';
import { Coordenada } from '../coordenadas';
import { CoordCompleteService } from '../coordComplete.service';
import { Geolocation } from '@capacitor/geolocation';
import { AemetService } from '../aemet.service';
import { tap } from 'rxjs/operators';
import { MyEstacion } from '../my-estacion';
import * as moment from 'moment';
import { async } from 'rxjs';
import { MyLinea } from '../my_linea';
import { normalize } from 'normalize-diacritics';
import { AuthService } from '../auth.service';





@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})

export class MapPage implements OnInit {

  icon = {
      url: "../../assets/icon/estacion.png", // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      // origin: new google.maps.Point(0,0), // origin
      // anchor: new google.maps.Point(0, 0) // anchor
  };
  iconV= {
    url: "../../assets/icon/estacionVerde.png", // url
    scaledSize: new google.maps.Size(50, 50), // scaled size
    // origin: new google.maps.Point(0,0), // origin
    // anchor: new google.maps.Point(0, 0) // anchor
};


// [icon]="getMarkerIcon(point.icon.url)" --> Añadir esto al HTML
  incMap =true;
  estMap =true;
  incMetMap =true;
  textoInfo: string = "Presione el boton\nCARGAR ACCIDENTES\npara mostrar los incidentes "
  selectedPoint: any;
  mapZoom = 10;
  tam: google.maps.Size = new google.maps.Size(40, 40);
  center: google.maps.LatLngLiteral;
  jsonData: any;
  newpoint: MyPoint;
  newpointW: MyPoint;
  newLinea: MyLinea;
  newEstacion: MyEstacion;
  newEstacion2: MyEstacion;
  datosEstaciones: any=[];
  lines:MyLinea[]=[];
  //points: Coordenada[];
  points: MyPoint[] = [ ];
  pointsWeather: MyPoint[] = [ ];
  estaciones:MyEstacion[]=[ ];
  estacionesClima:MyEstacion[]=[ ];
  estaciones2:MyEstacion[]=[ ];
  jsonEstaciones: any;
  diferenciaAct: number = 1000;
  user: string;

  constructor(
    private coordCompleteService: CoordCompleteService,
    private aemetService: AemetService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    if(this.authService.userData !== undefined){
      this.user = this.authService.userData!.displayName!.toString();
    }
    else{
      this.user=''
    }
    this.getPosition();
    this.jsonData=this.coordCompleteService.obtenerCoor();

    //console.log(this.jsonData)

    this.aemetService.getEstaciones().subscribe(
      (response) => {
        this.jsonEstaciones=this.aemetService.getEstacionesURL(response.datos)
     },
      (error) => {
        console.error('Error fetching weather stations', error);
      }
    );

  }
  getMarkerIcon(url : any) {
    return {
      url: url,
      scaledSize: new google.maps.Size(50, 50),
    };
  }
  async cargarJSON(): Promise<any>{
    this.textoInfo="Cargando los accidentes..."
    this.jsonData= await this.coordCompleteService.obtenerCoor();
    //console.log(this.points)
    //console.log(this.jsonData)
    this.jsonEstaciones=this.aemetService.getEst();
    //console.log(this.jsonEstaciones)
    this.cargarMapa();
    this.textoInfo="Accidentes Cargados\nSelecione un marcador para mas información"

  }
  async getPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.center = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    }
  }

  cargarMapa(){
    console.log("Cargando Coordenadas en el mapa...")
    this.points=[];
    for(let coord in this.jsonData){
      
      if(this.jsonData[coord].Type=="WeatherRelatedRoadConditions"){
        console.log("Se ha detectado una incidencia de clima")
        //console.log("Hola gente");
        this.obtenerEstaciones(Number(this.jsonData[coord].Latitud),Number(this.jsonData[coord].Longitud), String(this.jsonData[coord].Time ));
        this.newpointW = { 
          position: {
            lat: Number(this.jsonData[coord].Latitud),
            lng: Number(this.jsonData[coord].Longitud),
          },
          title: this.jsonData[coord].Time,
          time: this.jsonData[coord].Time,
          type: this.jsonData[coord].Type,
          ocurrency: this.jsonData[coord].Ocurrencia,
        }
        this.pointsWeather.push(this.newpointW)

      }else{
        this.newpoint = { 
          position: {
            lat: Number(this.jsonData[coord].Latitud),
            lng: Number(this.jsonData[coord].Longitud),
          },
          title: this.jsonData[coord].Time,
          time: this.jsonData[coord].Time,
          type: this.jsonData[coord].Type,
          ocurrency: this.jsonData[coord].Ocurrencia,
        }
        this.points.push(this.newpoint)
      }

    }
    // console.log("Mostrando Estaciones ...")
    // console.log(this.estaciones);
    // console.log("Mostrando Estaciones 2 ...")
    console.log(this.points);
    // console.log("Comprobando, mirando y asegurando estacuones")
    
    // setTimeout(() => {
    //   let estacionesAux = this.aemetService.getClima();;
    //   console.log(estacionesAux)
    //   this.estacionesClima.push();

    // }, 3000);
  }

  obtenerEstaciones(lat: number, lon: number, time: string){
    console.log("Buscando estacion mas cercana a " + lat +  "," +lon);
    let estacionProx ;
    let latitud;
    let longitud;
    let timeO
    let timef;

    timeO = this.cambiarFecha(time, "ini");
    timef = this.cambiarFecha(time, "fin");

    for(let estacion in this.jsonEstaciones){
      latitud= this.jsonEstaciones[estacion].latitud
      const latDecimal = this.convertirCoordenadaANumero(latitud);
      longitud= this.jsonEstaciones[estacion].longitud
      const lonDecimal = this.convertirCoordenadaANumero(longitud);

      const latitudDiff = lat - latDecimal;
      const longitudDiff = lon - lonDecimal;
      const distancia = Math.sqrt(latitudDiff ** 2 + longitudDiff ** 2);
      let nombre = normalize(this.jsonEstaciones[estacion].nombre)
      this.newEstacion2 = { 
        position: {
          lat: latDecimal,
          lng: lonDecimal,
        },
        nombre: nombre,
        provincia: this.jsonEstaciones[estacion].provincia,
        indicativo: this.jsonEstaciones[estacion].indicativo,
        fechaIni: timeO,
        fechaFin: timef,
        clima:" Buscando..."

        }

      if(Math.abs(distancia) < Math.abs(this.diferenciaAct)){
        this.diferenciaAct=distancia;
        let nombre = this.quitarAcentos(this.jsonEstaciones[estacion].nombre)
        //console.log("La diferecnia a entrado ")
          this.newEstacion = { 
          position: {
            lat: latDecimal,
            lng: lonDecimal,
          },
          nombre: nombre,
          provincia: this.jsonEstaciones[estacion].provincia,
          indicativo: this.jsonEstaciones[estacion].indicativo,
          fechaIni: timeO,
          fechaFin: timef,
          clima:" Buscando..."

        }

          this.estaciones2.push(this.newEstacion2)

      }
    }
    //console.log(this.newEstacion);
    this.diferenciaAct=1000;
    let origen = { lat: lat, lng: lon };
    let destino = this.newEstacion.position;
    this.drawLine(origen, destino);
    this.obtenerDatosEstaciones(this.newEstacion)
    this.estaciones.push(this.newEstacion)
  }

  convertirCoordenadaANumero(coordenada: string): number {
    const grados = parseInt(coordenada.substring(0, 2));
    const minutos = parseInt(coordenada.substring(2, 4));
    const segundos = parseInt(coordenada.substring(4, 6));
  
    // Calcular el valor decimal
    const decimal = grados + (minutos / 60) + (segundos / 3600);
  
    // Comprobar si la coordenada es del hemisferio sur y multiplicar por -1 si es necesario
    const hemisferio = coordenada.slice(-1);
    if (hemisferio === 'S' || hemisferio === 'W') {
      return decimal * -1;
    }
  
    return decimal;
  }
  cambiarFecha(time: string, type: string){

    // Analizar la fecha original utilizando Moment.js
    let fechaMoment: moment.Moment = moment(time, "ddd MMM DD HH:mm:ss zzz YYYY");
    
    if (fechaMoment.isValid()) {
      if(type=="ini"){
        fechaMoment = fechaMoment.startOf('day');
        console.log("Fecha ini ..")
      }
      else{
        fechaMoment = fechaMoment.endOf('day');
      }
      // Obtener la fecha formateada en el nuevo formato "AAAA-MM-DDTHH:MM:SSUTC"
      const fechaFormateada: string = fechaMoment.utc().format("YYYY-MM-DDTHH:mm:ss").replace(/:/g, '%3A'); 

      console.log(fechaFormateada); 
      
      return fechaFormateada + "UTC";;

    } else {
      console.log("Fecha no válida");
      return time;
    }

  }
  async obtenerDatosEstaciones(estacionAct: MyEstacion) {
    try {
      const response = await this.aemetService.getClimaEstacion(estacionAct).toPromise();
      console.log("Esperando response ...")
      console.log(response.estado);
      
      if (response.estado == 200) {
        this.datosEstaciones = await this.aemetService.getClimaEstacionUrl(response.datos);
        console.log(this.datosEstaciones);
        let tiempo = "Temp.- " + this.datosEstaciones[0].tmed + " / Viento " + this.datosEstaciones[0].velmedia + " / Racha " +this.datosEstaciones[0].racha + " / Prec. " + this.datosEstaciones[0].prec;
        this.newEstacion = {
          position: estacionAct.position,
          nombre: estacionAct.nombre,
          provincia: estacionAct.provincia,
          indicativo: estacionAct.indicativo,
          fechaIni: estacionAct.fechaIni,
          fechaFin: estacionAct.fechaFin,
          clima: tiempo,
        };
      } else {
        this.newEstacion = {
          position: estacionAct.position,
          nombre: estacionAct.nombre,
          provincia: estacionAct.provincia,
          indicativo: estacionAct.indicativo,
          fechaIni: estacionAct.fechaIni,
          fechaFin: estacionAct.fechaFin,
          clima: "No hay datos del clima disponibles en esta estacion",
        };
      }
      
      this.estacionesClima.push(this.newEstacion);
    } catch (error) {
      console.error('Error fetching weather stations', error);
    }
  }
  drawLine(origin: any, destination: any) {
    this.newLinea = {
      position:[origin, destination],
    }
    this.lines.push(this.newLinea);
    console.log("Mostrando Lineas")
    console.log(this.lines)
  }
  quitarAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  async realizarLogin(){
    this.user = await this.authService.GoogleAuth()
    this.user= this.user.replace(/["']/g, '');
  }
  marcadorEstacion(estacion:any) {
    this.textoInfo=estacion;
  }
  marcadorClicado(){
    console.log("Me has cliclado")
  }
  // showInfoWindow(point: any) {
  //   console.log("Me has cliclado")
  //   this.selectedPoint = point;
  // }

  closeInfoWindow() {
    console.log("Me has cliclado")
    this.selectedPoint = null;
  }
  showInfoEstacion(point:any) {
    console.log(point)
    this.textoInfo= point.provincia+" - "+point.nombre+"\n"
                  +point.clima+"\n"+point.fechaIni.replace(/%3A/g, ':')+"\n"
                  +point.fechaFin.replace(/%3A/g, ':') + "\n"
                  +"Lat: "+point.position.lat.toFixed(2) + " " +"Lon: "+ point.position.lng.toFixed(2)+"\n"
                  +"Indicativo:  " + point.indicativo;
  }
  showInfoWindow(point:any) {
    console.log(point)
    this.textoInfo= point.title+"\n"
                  +"Lat: "+point.position.lat.toFixed(2) + " " +"Lon: "+ point.position.lng.toFixed(2)+"\n"
                  +"Tipo: " + point.type+"\n" + "   - " + point.ocurrency;
    
  }
  alterarIncidente(){
    if(this.incMap){
      this.incMap = false
    }
    else{
      this.incMap = true
    }
  }
  alterarIncidenteMetereo(){
    if(this.incMetMap){
      this.incMetMap = false
    }
    else{
      this.incMetMap = true
    }
  }
  alterarEstacion(){
    this.estMap=!this.estMap;
    
  }
}
