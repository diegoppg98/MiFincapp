import {Notificacion} from './Clases/Notificacion';
import {Alerta} from './Clases/Alerta';
import {Pivot} from './Clases/Pivot';
import {Dispositivo} from './Clases/Dispositivo';


/**
 * Auxiliary functions related to calculations with polygons and distances 
 */
export class Utils {   
    
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
  }
  
  public  distanciaMedidas(medidas: object[],medida1: object,medida2: object, punto1: L.Point, punto2: L.Point):number {
       var sumDistances = 0;
       var sum = false;
       var medida;
       for (var i = 0; i < medidas.length; ++i) {
         if(medidas[i] == medida1 || medidas[i] == medida2){ 
           if(sum == false){
             sum = true;
           }  
           else{ 
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
        var distanceActual = point2.distanceTo(punto);
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
    else if(tipoPivot === 'circular'){           
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
        var distanceActual = point2.distanceTo(punto); 
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


  public polygonArea(X: float[], Y: float[], numPoints: int):float
  { 
    var area = 0;         
    var j = numPoints-1;  

    for (var i=0; i<numPoints; i++)
      { area = area +  (X[j]+X[i]) * (Y[j]-Y[i]); 
        j = i;  
      }
    return Math.abs(area/2);
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


