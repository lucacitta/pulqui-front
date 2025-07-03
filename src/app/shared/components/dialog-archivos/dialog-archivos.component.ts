import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AccionPagoService } from '../../../components/marketplace/accion-pago/services/accion-pago.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { ArchivosModel } from '../../../models/archivos.model';
import { forkJoin, lastValueFrom, map, take } from 'rxjs';
import { UrlModel } from '../../../models/url.model';

@Component({
  selector: 'app-dialog-archivos',
  templateUrl: './dialog-archivos.component.html',
  styleUrl: './dialog-archivos.component.css',
})
export class DialogArchivosComponent {
  @Input() data: any = {
    enunciado: `Carga de Documentos`,
    nombreArchivos: [{ nom: 'RUT actualizado' }],
  };

  loading: boolean = false;
  archivos: (File | null)[] = [];
  error = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  clientId: number = 0;

  constructor(
    private accionPagoSer: AccionPagoService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.data.nombreArchivos.forEach(() => this.archivos.push(null));
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

  archivosCargados(archivos: File[]): void {
    if (archivos.length === this.data.nombreArchivos.length) {
      const hasNull = archivos.some(file => file === null);
      if (this.error && !hasNull) {
        this.error = false;
      }
      this.archivos = archivos;
    }
  }

  async subirArchivos() {
    this.loading = true;
    if (this.archivos.includes(null)) {
      this.error = true;
      this.loading = false;
      return;
    }
    if (this.email.invalid) {
      this.email.markAsTouched();
      this.loading = false;
      return;
    }
    if (!this.error && this.email.valid) {
      try {
        const archivos: ArchivosModel[] = this.archivos.map((file, index) => ({
          nombreArchivo: this.data.nombreArchivos[index].nom,
          file: file as File, // Aseguramos que file no sea null
          email: this.email.value!,
        }));

        const myRequests = archivos.map(myFile => {
          const fd = new FormData();
          fd.append('client', `${this.clientId}`);
          fd.append('name', myFile.nombreArchivo);
          fd.append('file', myFile.file);
          return this.accionPagoSer.subirDocumentos(fd);
        });

        const res: UrlModel[] = await lastValueFrom(forkJoin(myRequests).pipe(map(results => results as UrlModel[])));
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
        this.loading = false;
        this.snackBar.open('Tus documentos están subidos y actualizados correctamente', 'Ok, gracias', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      } catch (error) {
        this.loading = false;
        this.snackBar.open('No es posible actualizar la documentación', 'ok', { duration: 2000 });
      }
    }
  }
}
