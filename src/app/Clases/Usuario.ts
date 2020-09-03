
export class Usuario {

    key: string;
    correo: string;
    nombre: string;
    direccion: string;
    foto: ArrayBuffer;


  constructor(key: string, correo: string, nombre: string, direccion: string, foto: ArrayBuffer) {
    this.key = key;
    this.correo = correo;
    this.nombre = nombre;
    this.direccion = direccion;
    this.foto = foto;
  }

}

