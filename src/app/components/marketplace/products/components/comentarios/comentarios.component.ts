import { Component, Input } from '@angular/core';
import { ComentariosModel } from '../../../../../models/comentarios.model';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.scss',
})
export class ComentariosComponent {
  @Input() comentarios: any;
}
