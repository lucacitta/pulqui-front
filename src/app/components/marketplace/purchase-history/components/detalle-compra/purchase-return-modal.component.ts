import { Component, Input, OnInit, Inject, ViewEncapsulation } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import Swal from 'sweetalert2';
import { PurchaseHistoryService } from '../../purcharse-history.service';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FirebaseStorageService } from '../../../../../shared/services/utils/firebase-storage.service';

@Component({
  standalone: true,
  selector: 'app-detalle-compra',
  templateUrl: './purchase-return-modal.component.html',
  styleUrls: ['../purchase-detail/purchase-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule
  ]
})
export class PurchaseReturnModalComponent implements OnInit {
  verCompras = false;
  loading = false;
  @Input() startDate: any;
  @Input() endDate: any;
  cantidad = 1;
  motivo_solicitud = "";
  images: any[] = [];
  compras: any;
  agrupadas: any;
  cons_cliente: any;
  idUser: number = 0;

  constructor(
    public dialogRef: MatDialogRef<PurchaseReturnModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _historyPurchaseService: PurchaseHistoryService,
    private _authenticationService: AuthenticationService,
    _dialog: MatDialog,
    // public userService: UserService,
    private _firebaseStorageService: FirebaseStorageService,
  ) {
    this._authenticationService.user$.subscribe(user => {
      this.idUser = user?.idUsuario;
    });
  }

  ngOnInit(): void {

    // let dataLogin = this._authService.identityClaims;
    console.log("Data: ", this.data);


  }
  changeEvent(event: any) {
    if (event.target.value > this.data.cantidad) this.cantidad = Number(this.data.cantidad);
    if (event.target.value < 1) this.cantidad = 1;
  }

  cambiarCantidad(e: any) {
    if (e > this.data.cons_producto) {
      this.cantidad = Number(this.data.cons_producto);
    }
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  roundRate() {
    this.cantidad = Math.round(+this.cantidad);
  }

  fileChange(event: any) {
    console.log("Event change file: ", event);
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log("File: ", reader.result)
        this.images.push({
          base: reader.result,
          name: file.name,
          file: file,
        });
        event.target.value = null;
      };
    }
  }

  borrarImagen(key: any) {
    this.images.splice(key, 1);
  }

  closeDialog() {
    console.log("close")
    this.dialogRef.close();
  }

  confirmar() {
    let data = {
      "cons_item_lista": this.data.cons_item_lista,
      "motivo_respuesta": this.motivo_solicitud,
      "cons_usuario": this.idUser,
      "estado": this.data.eleccion
    }
    let that = this;

    this._historyPurchaseService.setConfirmarDevolucion(data, this.data.cons_devolucion).subscribe(
      (rt: any) => {
        console.log("Respuesta: ", rt);
        if (rt.status == "Ok") {
          that.dialogRef.close(1);
          // Swal
          //   .fire({
          //     title: 'Proceso exitoso',
          //     text: 'La devolución ha sido ' + ((this.data.eleccion == "A") ? "Aprobada" : "Rechazada"),
          //     icon: 'success',
          //     confirmButtonText: 'Cerrar',
          //     confirmButtonColor: '#ffb300'
          //   })
        } else {
          that.dialogRef.close();
          // Swal
          //   .fire({
          //     title: 'Proceso exitoso',
          //     text: 'Ha ocurrido un error, intenta nuevamente.',
          //     icon: 'error',
          //     confirmButtonText: 'Cerrar',
          //     confirmButtonColor: '#ffb300'
          //   })
        }
      }
    )
  }

  async enviar() {
    this.loading = true;
    let urls: any = [];
    const uploadPromises: any = [];

    this.images.forEach((i: any) => {
      const filepath = `images/devoluciones/${this.data.numero_orden}/${this.data.cons_item_lista}/${i.file.name}`;
      const promise = this._firebaseStorageService.uploadFile(i.file, filepath)
        .then((url: any) => {
          urls.push(url);
        })
        .catch((error: any) => {
          console.error("Error al cargar una imagen:", error);
        });

      uploadPromises.push(promise);
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error al cargar una o más imágenes:", error);
    }

    let data = {
      "cons_item_lista": this.data.cons_item_lista,
      "cantidad": this.cantidad,
      "imagenes": urls,
      "motivo_solicitud": this.motivo_solicitud,
      "cons_usuario": this.idUser
    };

    let that = this;
    this.loading = false;
    console.log("Data: ", data);

    this._historyPurchaseService.setDevolucion(data).subscribe(
      rt => {
        console.log("Respuesta: ", rt);
        this.dialogRef.close({refresh: true});
      }
    )
  }

}
