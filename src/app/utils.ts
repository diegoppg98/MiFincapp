import {classMethods} from './classMethods';
import {Notificacion} from './Clases/Notificacion';
import {Alerta} from './Clases/Alerta';
import {Pivot} from './Clases/Pivot';
import {Dispositivo} from './Clases/Dispositivo';
import {DispositivoGps} from './Clases/Dispositivo';
import {DispositivoTemperatura} from './Clases/Dispositivo';

export class Utils {

    public checkMeasurementsTemperatura(idDevice: string){
     classMethods.getMedidaMethods().checkDeviceMeasurement(idDevice).then((result) =>{  
       if(result !== null && result.length !== 0){
               var temperatureDevice = result[0].medida;
               var deviceId = result[0].id;              
               classMethods.getDispositivoMethods().checkDeviceId(deviceId).then((result) =>{
                     var userKey = result.user;
                     var deviceKey = result.device;
                     classMethods.getDispositivoMethods().deviceInformation(deviceKey).then((resultDispositivo) =>{
                       var nombreDispositivo = resultDispositivo.nombre;
                       var tipoDispositivo = resultDispositivo.tipo;
                       var idDispositivo = resultDispositivo.id;
                       var fincaDispositivo = resultDispositivo.finca;
                       var pivotDispositivo = resultDispositivo.pivot;
                       var dispositivoLocalizacion = resultDispositivo.localizacion;           
               
              var dispositivo = new DispositivoTemperatura(deviceKey,nombreDispositivo, idDispositivo, tipoDispositivo, dispositivoLocalizacion, fincaDispositivo, pivotDispositivo,[],[],temperatureDevice);
              
         classMethods.getDispositivoMethods().updateDevice(dispositivo).then((result) =>{
          }).catch((error) => { 	     
          });
                     }); 
               }); 
        }
     }); 
    }
    
    public async checkMeasurementsGps(idDevice: string): string{

          var updated = await classMethods.getMedidaMethods().checkDeviceMeasurement(idDevice).then((result) =>{                              
               //if items not empty, update position of pivot and device, and check if any alert is fulfilled                   
               if(result !== null && result.length !== 0){
               var locationDevice = result[0].medida;
               var deviceId = result[0].id;
                  classMethods.getDispositivoMethods().checkDeviceId(deviceId).then((result) =>{
                     var userKey = result.user;
                     var deviceKey = result.device;
                                                             
                     classMethods.getDispositivoMethods().deviceInformation(deviceKey).then((resultDispositivo) =>{
                     if(resultDispositivo !== null){ 
                       var latlngCenter = null;
                       var latlngPoint = null;      
                       var nombreDispositivo = resultDispositivo.nombre;
                       var tipoDispositivo = resultDispositivo.tipo;
                       var idDispositivo = resultDispositivo.id;
                       var fincaDispositivo = resultDispositivo.finca;
                       var pivotDispositivo = resultDispositivo.pivot;
                       var positions = JSON.parse(resultDispositivo.posiblesLocalizaciones); 
                      
                       var localizacionActualDispositivo = resultDispositivo.localizacion;
                       var coordenadasActualesDispositivo = JSON.parse(localizacionActualDispositivo[0]).geometry.coordinates;
                                        
                       classMethods.getPivotMethods().pivotInformation(pivotDispositivo).then((result) =>{
                          if(result !== null){                       
                            var localizacionPivot = result.localizacion;
                            var tipoPivot = result.tipo;
                            var nombrePivot = result.nombre; 
                            
                            var coordenadaPivot = JSON.parse(localizacionPivot[0]).geometry.coordinates;
                           
                           if(Math.floor(coordenadaPivot[0][1]*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(coordenadasActualesDispositivo[1]*Math.pow(10,4))/(Math.pow(10,4)) && Math.floor(coordenadaPivot[0][0]*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(coordenadasActualesDispositivo[0]*Math.pow(10,4))/(Math.pow(10,4))){
              latlngCenter = L.latLng(coordenadaPivot[1][1], coordenadaPivot[1][0]);
              latlngPoint = L.latLng(coordenadaPivot[0][1], coordenadaPivot[0][0]);
                           }
                           else {
              latlngCenter = L.latLng(coordenadaPivot[0][1], coordenadaPivot[0][0]);
              latlngPoint = L.latLng(coordenadaPivot[1][1], coordenadaPivot[1][0]);
                           }
                           
                           var p;
                           var punto1;
                           var punto2;

                             var puntoDevice = L.latLng(locationDevice[0], locationDevice[1]);
                             if(tipoPivot === "lineal"){
                           p = this.closestPoint(tipoPivot, positions, puntoDevice);
                           punto1=L.latLng(p[0].x, p[0].y);
                           punto2=L.latLng(p[1].x, p[1].y);
                           p=punto2;
                             }
                             else{
                           p = this.closestPoint(tipoPivot, positions, puntoDevice);
                           punto1=latlngCenter;
                           punto2=p;
                             } 

                             var m1 = L.marker(p);
                             
                             var dispositivoLocalizacion = [];
                             var layers = [];
                             layers.push(m1); 
                             layers.forEach(function(element,index) {
                               dispositivoLocalizacion.push(JSON.stringify(element.toGeoJSON()));
                             })
                             var layersPivot = [];
                             var pivotLocalizacion = [];
                             
                             
                             var LatLngs = []; LatLngs.push(punto1); LatLngs.push(punto2);
                             var polyline = L.polyline(LatLngs);
                             layersPivot.push(polyline); 
                             
                            layersPivot.forEach(function(element,index) {
                              pivotLocalizacion.push(JSON.stringify(element.toGeoJSON()));
                            })  
                           

var pivot = new Pivot(pivotDispositivo,nombrePivot, tipoPivot, pivotLocalizacion, fincaDispositivo, []);
classMethods.getPivotMethods().updatePivot(pivot).then((result) =>{
          }).catch((error) => { 	     
          });
//UPDATE TODOS LOS DISPOSITIVOS DEL PIVOT
classMethods.getDispositivoMethods().listDevices(pivotDispositivo).then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var nombreDispositivo = childResult.nombre;
          var tipoDispositivo = childResult.tipo;
          if(tipoDispositivo === 'GPS'){
            var idDispositivo = childResult.id;
            var fincaDispositivo = childResult.finca;
            var pivotDispositivo = childResult.pivot;//JSON.parse(
            var dispositivoPositions = childResult.posiblesLocalizaciones;

            var deviceKey = childResult.key;

            var dispositivo = new DispositivoGps(deviceKey,nombreDispositivo, idDispositivo, tipoDispositivo, dispositivoLocalizacion, fincaDispositivo, pivotDispositivo,[],[],dispositivoPositions);
              
         classMethods.getDispositivoMethods().updateDevice(dispositivo).then((result) =>{
          }).catch((error) => { 	     
          }); 
          }
       })
    }
   });
                                      
                          }
                       });                  
                     } 
                   });
                 }); 
                 return true;  
               } 
               return false;               
      }); 
      return updated;
    }
    
    public comparePolygon(polygon1: L.polygon, polygon2: L.polygon):boolean {
    var inside = true;
    var length1 = polygon1.length;
    var length2 = polygon2.length;
   
    if(length1!==length2){  
       return false;
    }
    else{
     for (var k=0;k<length1;k++){   
   
        if(polygon1[k].lat !== polygon2[k].lat || polygon1[k].lng !== polygon2[k].lng)
          inside = false;
     }
    }
  return inside;
  }
  
  public pointInLand(point: L.Point, polygon: L.polygon):boolean {
     var m = L.marker(point);
     if(polygon.getBounds().contains(m.getLatLng()))
        return true;
     else
        return false;
  
    /*
    //POINT IN LAND WITHOUT BORDERS
    var inside = false;
    var x = point.lat, y = point.lng;
    for (var k=0;k<polygon.getLatLngs().length;k++){
        var polyPoints = polygon.getLatLngs()[k];       
        for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
            var xj = polyPoints[j].lat, yj = polyPoints[j].lng;
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
    }
  return inside;*/
   
    /*
    //POINT IN LAND INCLUDING BORDERS
    var classifyPoint = require("robust-point-in-polygon")
var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ]
 
console.log(
  classifyPoint(polygon, [1.5, 1.5]),
  classifyPoint(polygon, [1, 2]),
  classifyPoint(polygon, [100000, 10000]));
  */

  }
  
  public  distanciaMedidas(medidas: object[],medida1: object,medida2: object, punto1: L.Point, punto2: L.Point):number {
       var sumDistances = 0;
       var sum = false;
       var medida;
       for (var i = 0; i < medidas.length; ++i) {
         if(medidas[i] == medida1 || medidas[i] == medida2){ 
           if(sum == false){
             //medida = L.latLng(medida1.lat,medida1.lng);
             sum = true;
           }  
           else{ 
             //sumDistances = sumDistances + point2.distanceTo(this.point1);
             break;
           }  
           }
           if(sum)
             sumDistances = sumDistances +1;
         }
       return sumDistances;
  }
  
  public closestPoint(tipoPivot: string, puntos: object[], punto: L.Point):L.Point{  

    if(tipoPivot === 'lineal'){           
      var pointFinal = null;
      var distance = -1;
      for (var i=0;i<puntos.length;i++){
        var point1 = L.latLng(puntos[i][0].x, puntos[i][0].y);
        var point2 = L.latLng(puntos[i][1].x, puntos[i][1].y); 
        var distanceActual = point2.distanceTo(punto); //////////////////ARREGLAR CENTER
        if(pointFinal === null){
          pointFinal = puntos[i];
          distance = distanceActual;
        }
        else if(distance > distanceActual){
          pointFinal = puntos[i];
          distance = distanceActual;
        }
      }
      return pointFinal;
    }
    else{           
      var pointFinal = null;
      var distance = -1;
      for (var i=0;i<puntos.length;i++){
        var point = L.latLng(puntos[i].lat, puntos[i].lng);
        var distanceActual = point.distanceTo(punto);
        if(pointFinal === null){
           pointFinal = puntos[i];
           distance = distanceActual;
        }
        else if(distance > distanceActual){
          pointFinal = puntos[i];
          distance = distanceActual;
        }
      }
      return pointFinal;
    }  
  }

public pivotPosition(tipoPivot: string, puntos: object[], punto: L.Point):L.Point{  
    if(tipoPivot === 'lineal'){           
      var pointFinal = null;
      var distance = -1;
      for (var i=0;i<puntos.length;i++){
        var point1 = L.latLng(puntos[i][0].x, puntos[i][0].y);
        var point2 = L.latLng(puntos[i][1].x, puntos[i][1].y); 
        var distanceActual = point2.distanceTo(punto); //////////////////ARREGLAR CENTER
        if(pointFinal === null){
          pointFinal = i;
          distance = distanceActual;
        }
        else if(distance > distanceActual){
          pointFinal = i;
          distance = distanceActual;
        }
      }
      return pointFinal;
    }
    else{           
      var pointFinal = null;
      var distance = -1;
      for (var i=0;i<puntos.length;i++){
        var point = L.latLng(puntos[i].lat, puntos[i].lng);
        var distanceActual = point.distanceTo(punto);
        if(pointFinal === null){
           pointFinal = i;
           distance = distanceActual;
        }
        else if(distance > distanceActual){
          pointFinal = i;
          distance = distanceActual;
        }
      }
      return pointFinal;
    }  
  }
  
  public calculoPivotCircular(mapa: L.map, angle: int, point: L.latLng, center: L.latLng):L.Point {
       var maxzoom = mapa.getMaxZoom();
       if (maxzoom === Infinity)
            maxzoom = mapa.getZoom();
       var angleRad = angle*Math.PI/180;
       var pPoint = mapa.project(point, maxzoom);
       var pCenter = mapa.project(center, maxzoom);
       var x2 = Math.cos(angleRad)*(pPoint.x-pCenter.x) - Math.sin(angleRad)*(pPoint.y-pCenter.y) + pCenter.x;
       var y2 = Math.sin(angleRad)*(pPoint.x-pCenter.x) + Math.cos(angleRad)*(pPoint.y-pCenter.y) + pCenter.y;
       var dest = mapa.unproject(new L.Point(x2,y2), maxzoom);
       return dest;
  }

  
  public pivotCircular(mapa: L.map, polygon: L.polygon, pivotPoint: L.latLng, pivotCenter: L.latLng):L.Point[] {
       var angle = 0;
       var pointsFinal = [];
       for (var angle=0;angle<360;angle++){
          var pointActual = this.calculoPivotCircular(mapa, angle, pivotPoint, pivotCenter);

          if(this.pointInLand(pointActual, polygon)){
            pointsFinal.push(pointActual);
          }
       }
       return pointsFinal;
  }

    public pivotLineal(mapa: L.map, polygon: L.polygon, pivotPoint: L.latLng, pivotCenter: L.latLng):object[] {
       var offset = 0.0001;
       var pointsFinal = [];
       var out = false;
       var points = [];
       points.push({
         x: pivotCenter.lat,
         y: pivotCenter.lng,
       });
       points.push({
         x: pivotPoint.lat,
         y: pivotPoint.lng,
       });

       while (!out){
          var pointActual = this.offsetPoints(points,offset);
          var point1 = L.latLng(pointActual[0].x, pointActual[0].y);
          var point2 = L.latLng(pointActual[1].x, pointActual[1].y);

          if(this.pointInLand(point1, polygon) && this.pointInLand(point2, polygon)){
            pointsFinal.push(pointActual);
            offset = offset + 0.0001;
          }
          else out = true; 
       }
       out = false;
       offset = 0; 
       while (!out){
          var pointActual = this.offsetPoints(points,offset);
          var point1 = L.latLng(pointActual[0].x, pointActual[0].y);
          var point2 = L.latLng(pointActual[1].x, pointActual[1].y);
          if(this.pointInLand(point1, polygon) && this.pointInLand(point2, polygon)){
            pointsFinal.push(pointActual);
            offset = offset - 0.0001;
          }
          else out = true;
       }

       return pointsFinal;
  }



/*
  public puntosPivotLineal(point: L.Point, mapa: L.map, polygon: L.polygon, pivotPoint: L.latLng, pivotCenter: L.latLng):object {
       var offset = 0.0001;
       var pointFinal = null;
       var distance = -1;
       var out = false;
       var points = [];
       points.push({
         x: pivotCenter.lat,
         y: pivotCenter.lng,
       });
       points.push({
         x: pivotPoint.lat,
         y: pivotPoint.lng,
       });

       while (!out){
          var pointActual = this.offsetPoints(points,offset);
          var point1 = L.latLng(pointActual[0].x, pointActual[0].y);
          var point2 = L.latLng(pointActual[1].x, pointActual[1].y);
          if(this.pointInLand(point1, polygon) && this.pointInLand(point2, polygon)){
            var distanceActual = point1.distanceTo(point);
            if(pointFinal === null){
               pointFinal = pointActual;
               distance = distanceActual;
            }
            else if(distance > distanceActual){
               pointFinal = pointActual;
               distance = distanceActual;
            }
            offset = offset + 0.0001;
          }
          else out = true; 
       }
       out = false;
       offset = 0; 
       while (!out){
          var pointActual = this.offsetPoints(points,offset);
          var point1 = L.latLng(pointActual[0].x, pointActual[0].y);
          var point2 = L.latLng(pointActual[1].x, pointActual[1].y);
          if(this.pointInLand(point1, polygon) && this.pointInLand(point2, polygon)){
            var distanceActual = point1.distanceTo(point);
            if(pointFinal === null){
               pointFinal = pointActual;
               distance = distanceActual;
            }
            else if(distance > distanceActual){
               pointFinal = pointActual;
               distance = distanceActual;
            }
            offset = offset - 0.0001;
          }
          else out = true;
       }
       if(pointFinal === null){
          pointFinal = points;
       }
       return pointFinal;
  }
  
  public puntosPivotCircular(point: L.Point, mapa: L.map, polygon: L.polygon, pivotPoint: L.latLng, pivotCenter: L.latLng):L.Point {
       var angle = 0;
       var pointFinal = null;
       var distance = -1;

       for (var angle=0;angle<360;angle++){
          var pointActual = this.calculoPivotCircular(mapa, angle, pivotPoint, pivotCenter);

          if(this.pointInLand(pointActual, polygon)){
            var distanceActual = pointActual.distanceTo(point);
            if(pointFinal === null){
               pointFinal = pointActual;
               distance = distanceActual;
            }
            else if(distance > distanceActual){
               pointFinal = pointActual;
               distance = distanceActual;
            }
          }
       }
       return pointFinal;
  }*/

  public polygonArea(X: float[], Y: float[], numPoints: int):float
  { 
    var area = 0;         
    var j = numPoints-1;  

    for (var i=0; i<numPoints; i++)
      { area = area +  (X[j]+X[i]) * (Y[j]-Y[i]); 
        j = i;  
      }
    return Math.abs(area/2);

  /* var len = polygonPrime.length;
   
   var result = 0.0;
   var dx = 0.0;
   var dy = 0.0;
   for( var k = 0; k < (len-1); k++ )
   {
      dx = polygonPrime[k+1].lat - polygonPrime[k].lat;
      dy = polygonPrime[k+1].lng - polygonPrime[k].lng; 
      result += polygonPrime[k].lat * dy - 
                polygonPrime[k].lng * dx; 
   } 
   dx = polygonPrime[0].lat - polygonPrime[len-1].lat;
   dy = polygonPrime[0].lng - polygonPrime[len-1].lng; 
   result += polygonPrime[len-1].lat * dy - 
             polygonPrime[len-1].lng * dx;  
   return result/2.0;*/
  }


////////////////// COPY OF https://raw.githubusercontent.com/bbecquet/Leaflet.PolylineOffset/master/leaflet.polylineoffset.js START ////////////////////////////

  public offsetPoints(pts: object, offset: float):object
  { 
    var offsetSegments = this.offsetPointLine(pts, offset);
    return this.joinLineSegments(offsetSegments, offset, 'round');
  }
  public translatePoint(pt: object, dist: float, radians: float):object
  { 
    return L.point(pt.x + dist * Math.cos(radians), pt.y + dist * Math.sin(radians));
  }
  public offsetPointLine(points: object, distance: float):object
  { 
    var l = points.length;
    if (l < 2) {
      throw new Error('Line should be defined by at least 2 points');
    }
    var a = points[0], b;
    var offsetAngle, segmentAngle;
    var offsetSegments = [];

    for(var i=1; i < l; i++) {
      b = points[i];
      // angle in (-PI, PI]
      segmentAngle = Math.atan2(a.y - b.y, a.x - b.x);
      // angle in (-1.5 * PI, PI/2]
      offsetAngle = segmentAngle - Math.PI/2;

      // store offset point and other information to avoid recomputing it later
      offsetSegments.push({
        angle: segmentAngle,
        offsetAngle: offsetAngle,
        distance: distance,
        original: [a, b],
        offset: [
          this.translatePoint(a, distance, offsetAngle),
          this.translatePoint(b, distance, offsetAngle)
        ]
      });
      a = b;
    }
    return offsetSegments;

  }
  public intersection(l1a:object, l1b:object, l2a:object, l2b:object):object
  { 
    var line1 = this.lineEquation(l1a, l1b),
    line2 = this.lineEquation(l2a, l2b);

    if (line1 == null || line2 == null) {
      return null;
    }

    if(line1.hasOwnProperty('x')) {
      if(line2.hasOwnProperty('x')) {
        return null;
      }
      return L.point(line1.x, line2.a * line1.x + line2.b);
    }
    if(line2.hasOwnProperty('x')) {
      return L.point(line2.x, line1.a * line2.x + line1.b);
    }

    if (line1.a == line2.a) {
      return null;
    }

    var x = (line2.b - line1.b) / (line1.a - line2.a),
        y = line1.a * x + line1.b;

    return L.point(x, y);
  }
  public lineEquation(pt1:object, pt2:object):object
  { 
    if (pt1.x != pt2.x) {
      var a = (pt2.y - pt1.y) / (pt2.x - pt1.x);
      return {
        a: a,
        b: pt1.y - a * pt1.x
      }; 
    }

    if (pt1.y != pt2.y) {
      return { x: pt1.x };
    }

  }
  public joinSegments(s1:object, s2:object, offset: float, joinStyle:string):object
  { 
    var jointPoints = [];
    switch(joinStyle) {
      case 'round':
        jointPoints = this.circularArc(s1, s2, offset);
        break;
      case 'cut':
        jointPoints = [
          this.intersection(s1.offset[0], s1.offset[1], s2.original[0], s2.original[1]),
          this.intersection(s1.original[0], s1.original[1], s2.offset[0], s2.offset[1])
        ];
        break;
      case 'straight':
        jointPoints = [s1.offset[1], s2.offset[0]];
        break;
      case 'intersection':
      default:
        jointPoints = [this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1])];
    }
    // filter out null-results
    return jointPoints.filter(function(v) {return v;});
  }
  public joinLineSegments(segments:object, offset: float, joinStyle:string):object
  { 
    var l = segments.length;
    var joinedPoints = [];
    var s1 = segments[0], s2 = segments[0];
    joinedPoints.push(s1.offset[0]);
    
    for(var i=1; i<l; i++) {
      s2 = segments[i];
      joinedPoints = joinedPoints.concat(this.joinSegments(s1, s2, offset, joinStyle));
      s1 = s2;
    }
    joinedPoints.push(s2.offset[1]);

    return joinedPoints;
  }
  public circularArc(s1:object, s2:object, distance: float):object
  { 
    if (s1.angle == s2.angle)
      return [s1.offset[1]];

    var center = s1.original[1];
    var points = [];

    if (distance < 0) {
      var startAngle = s1.offsetAngle;
      var endAngle = s2.offsetAngle;
    } else {
      // switch start and end angle when going right
      var startAngle = s2.offsetAngle;
      var endAngle = s1.offsetAngle;
    }

    if (endAngle < startAngle) {
      endAngle += Math.PI * 2; // the end angle should be bigger than the start angle
    }

    if (endAngle > startAngle + Math.PI) {
      return [this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1])];
    }

    // Step is distance dependent. Bigger distance results in more steps to take
    var step = Math.abs(8/distance); 
    for (var a = startAngle; a < endAngle; a += step) {
      points.push(this.translatePoint(center, distance, a));
    }
    points.push(this.translatePoint(center, distance, endAngle));

    if (distance > 0) {
      // reverse all points again when going right
      points.reverse();
    }

    return points;
  }

}


