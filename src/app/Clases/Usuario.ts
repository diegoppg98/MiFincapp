
export class Usuario {

    key: string;
    correo: string;
    nombre: string;
    direccion: string;
    foto: object;


  constructor(key: string, correo: string, nombre: string, direccion: string, foto: object) {
    this.key = key;
    this.correo = correo;
    this.nombre = nombre;
    this.direccion = direccion;
    this.foto = foto;
  }

}

