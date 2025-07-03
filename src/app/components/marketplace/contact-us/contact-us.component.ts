import { ContactUsService } from './../../../shared/services/contact-us/contact-us.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit {
  asuntos: any = [];
  contactUsForm: FormGroup = new FormGroup({
    asunto: new FormControl({ value: '', disabled: false }, Validators.required),
    correo: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
    mensaje: new FormControl({ value: '', disabled: false }, Validators.required),
  });
  corrreoEnvio: any;
  asunto: any;
  srcResult: File | any;

  constructor(private _contactUsService: ContactUsService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.obtenerAsuntos()
  }

  obtenerAsuntos() {
    this._contactUsService.obtenerAsuntos().subscribe((res: any) => {
      this.asuntos = res;
    })
  }

  onSelectChange(event: any) {
    const asuntos = [...this.asuntos];
    const element = asuntos.find(e => e.cons_codigo == event.value);
    this.corrreoEnvio = element.descripcion_2
    this.asunto = element.descripcion_1
    console.log('event', event, element);
  }

  onFileSelected(event: any) {
    this.srcResult = event.target.files[0];
  }

  enviar() {
    console.log('conatct us form: ', this.contactUsForm)
    if (this.contactUsForm.valid) {
      let formData = new FormData();
      formData.append('asunto', this.asunto);
      formData.append('corrreoEnvio', this.corrreoEnvio);
      formData.append('correo', this.contactUsForm.get('correo')?.value);
      formData.append('mensaje', this.contactUsForm.get('mensaje')?.value);
      formData.append('file', this.srcResult);
      formData.append('path', 'contactenos');
      console.log('form: ', formData);
      this._contactUsService.saveContactUs(formData).subscribe(
        {
          next: (res) => {
            console.log('res saveContactUs', res);
            this.openSnackBar('¡Muchas gracias! Tu consulta fue enviada, nos estaremos comunicando a la brevedad');
            this.router.navigate(['/marketplace/home']);
          },
          error: (e) => {
            this.openSnackBar('Ocurrió un error. Intente de nuevo');
          }
        }
      );
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 6000
    });
  }
}
