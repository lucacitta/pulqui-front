import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccionPagoService } from '../../../components/marketplace/accion-pago/services/accion-pago.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { DialogArchivosComponent } from '../dialog-archivos/dialog-archivos.component';
import { EnunciadoDocuModel } from '../../../models/enunciado-document.model';
import { ArchivosModel } from '../../../models/archivos.model';
import { UrlModel } from '../../../models/url.model';
import { forkJoin, lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-actualizar-documentacion',
  templateUrl: './actualizar-documentacion.component.html',
  styleUrl: './actualizar-documentacion.component.css',
})
export class ActualizarDocumentacionComponent implements OnInit {
  @Input() fechaUpdateDoc!: Date;
  @Input() mensage!: boolean;
  @Input() color: string = '';
  @Output() notify = new EventEmitter<any>();
  documentos = false;
  colors = 'primary';
  clientId: number = 0;

  constructor(
    private accionPagoSer: AccionPagoService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.verificarFecha();
    this.setClientFromAuthService();
  }

  setClientFromAuthService(): void {
    this.authenticationService._user.subscribe({
      next: user => {
        if (user && user.client_id) {
          this.clientId = user.client_id;
        }
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  async subirDocumentos() {
    const dialogRef = this.dialog.open(DialogArchivosComponent, {
      width: '400px',
      data: <EnunciadoDocuModel>{
        enunciado: `Subir archivos`,
        nombreArchivos: [
          { nom: 'Certificado de Cámara de comercio' },
          { nom: 'Cédula de representante legal' },
          { nom: 'RUT actualizado' },
        ],
      },
    });

    const archivos: ArchivosModel[] = await dialogRef.afterClosed().toPromise();
    if (!archivos) {
      return;
    }

    try {
      const myRequests = archivos.map(myFile => {
        const fd = new FormData();
        fd.append('client', `${this.clientId}`);
        fd.append('name', myFile.nombreArchivo);
        fd.append('file', myFile.file);
        return this.accionPagoSer.subirDocumentos(fd);
      });

      const res: UrlModel[] = await lastValueFrom(forkJoin(myRequests));
      const updatedData = res.map((item, index) => ({
        name: archivos[index].nombreArchivo,
        type: index + 1,
        link: item.url,
      }));

      const update = {
        client: this.clientId,
        email: archivos[0].email,
        files: updatedData,
      };

      const res2 = await this.accionPagoSer.actualizarArchivos(update).pipe(take(1)).toPromise();
      this.notify.emit(res2);
      this.documentos = true;
    } catch (error) {
      this.snackBar.open('No es posible Actualizar documentacion', 'ok', { duration: 2000 });
    }
  }

  verificarFecha() {
    if (this.fechaUpdateDoc) {
      const fechaVencimiento = new Date(this.fechaUpdateDoc);
      fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);
      this.documentos = new Date() < fechaVencimiento;
    }
  }
}
