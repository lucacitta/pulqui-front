import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfiguracionCalificacionModel } from '../../../../../models/configuracion-calificacion.model';
import { DatosCalificacionModel } from '../../../../../models/datos-calificacion.model';

@Component({
  selector: 'app-producto-calificacion',
  templateUrl: './producto-calificacion.component.html',
  styleUrl: './producto-calificacion.component.css',
})
export class ProductoCalificacionComponent {
  flagMaxLength: boolean = false;

  @Input() cal: DatosCalificacionModel = {
    calificacion: -1,
    comentario: '',
  };

  @Input() configuracion: ConfiguracionCalificacionModel = { calificacionMaxima: 5 };

  @Output() enviaCalificacion = new EventEmitter<DatosCalificacionModel>();
  @Output() editaCalificacion = new EventEmitter<DatosCalificacionModel>();

  comentario = new FormControl('');
  calificar = new FormControl('', Validators.min(1));

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  onRating(calificacion: number): void {
    this.cal.calificacion = calificacion;
  }

  enviarCalificacion(): void {
    const comentarioValue = this.comentario.value || '';
    if (this.validarPalabras(comentarioValue)) {
      return;
    }
    this.cal.comentario = comentarioValue;
    this.enviaCalificacion.emit(this.cal);
  }

  editarCalificacion(): void {
    const comentarioValue = this.comentario.value || '';
    if (this.validarPalabras(comentarioValue)) {
      return;
    }
    this.cal.comentario = comentarioValue;
    this.editaCalificacion.emit(this.cal);
  }

  estaCalificado(): boolean {
    const cal = (this.cal.calificacion ?? -1) >= 0;
    console.log('cal: ' + cal);
    return cal;
  }

  validarPalabras(comment: string): boolean {
    this.flagMaxLength = false;
    if (!comment) {
      return true;
    }
    const hasLongWord = comment.split(' ').some((item: string) => item.length > 25);
    if (hasLongWord) {
      this.flagMaxLength = true;
      this.snackBar.open('Una de las palabras del comentario es muy larga', 'Ok', {
        duration: 2000,
      });
    }
    return this.flagMaxLength;
  }
}
