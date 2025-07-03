import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
interface EnunciadoDocuModel {
  enunciado: string;
  nombreArchivos: NomArchivosModel[];
}

interface NomArchivosModel {
  nom: string;
}
@Component({
  selector: 'app-subir-documentos',
  templateUrl: './subir-documentos.component.html',
  styleUrl: './subir-documentos.component.css',
})
export class SubirDocumentosComponent implements OnInit {
  @Input() datos: NomArchivosModel[] = [];
  @Output() files = new EventEmitter<File[]>();

  archivos: (File | null)[] = [];

  constructor() {}

  ngOnInit(): void {
    // Inicializar el array de archivos con valores nulos
    this.archivos = new Array(this.datos.length).fill(null);
  }

  cargarArchivos(event: Event, idFile: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivos[idFile] = input.files[0];
      this.emitirArchivos();
    }
  }

  eliminarArchivo(idFile: number): void {
    this.archivos[idFile] = null;
    this.emitirArchivos();
  }

  private emitirArchivos(): void {
    const archivosFiltrados = this.archivos.filter((archivo): archivo is File => archivo !== null);
    this.files.emit(archivosFiltrados);
  }
}
