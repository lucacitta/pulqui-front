import { Component, Input, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../profile.service';
import { CompanyInformation, ProfileModel } from '../profile.types';
import { AuthenticationService } from '../../../../core/services/auth/authentication.service';

@Component({
  selector: 'app-information-seller',
  templateUrl: './information-seller.component.html',
  styleUrls: ['./information-seller.component.scss'],
})
export class InformationSellerComponent implements OnInit {
  @Input() company: CompanyInformation | null = null;
  @Output() updateUserSeller = new EventEmitter<CompanyInformation>();

  user$ = signal<ProfileModel | null>(null);
  formInformationCompany: FormGroup;
  currentOpen = -1;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _profileService: ProfileService,
    private _authenticationService: AuthenticationService
  ) {
    this.formInformationCompany = this.fb.group({
      nombres: ['', Validators.required],
      nit: [{ value: '', disabled: true }, Validators.required],
      domicilio: ['', Validators.required],
      telefono: [''],
      representante: ['', Validators.required],
      cuentas: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.company) {
      this.loadCompanyData();
    }

    this._authenticationService.user$.subscribe(user => {
      if (user) {
        this._profileService.getTokenUser(user).subscribe(res => {
          this.token = res.token;
        });
        this.user$.set(user);
      }
    });
  }

  updateBasicInfo() {
    const information: CompanyInformation = {
      cons_cliente: this.company?.cons_cliente || 0,
      nombre_empresa: this.user$()?.social ? this.company?.nombre_empresa : this.formInformationCompany.value.nombres,
      nit: this.company?.nit || '',
      correspondencia: this.formInformationCompany.controls['domicilio'].value ?? '',
      telefono_empresa: this.formInformationCompany.controls['telefono'].value ?? '',
      representante: this.user$()?.social ? this.company?.representante : this.formInformationCompany.value.representante,
      cuentas: this.formInformationCompany.get('cuentas')?.value || [],
    };

    this.updateUserSeller.emit(information);
    this.snackBar.open('Información de la empresa actualizada', 'Cerrar', { duration: 2000 });
  }

  saveToken() {
    if (!this.token) {
      this.snackBar.open('Ingrese el token. El token es requerido.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const cons_client = this.user$()?.client_id;

    this._profileService.verifyUserToken(cons_client).subscribe((res: any) => {
      this._profileService.saveTokenUser(this.token, cons_client, res.result).subscribe(() => {
        this.snackBar.open('Token guardado. Token almacenado correctamente.', 'Cerrar', {
          duration: 3000,
        });
      });
    });
  }

  deleteToken() {
    let cons_client = this.user$()?.client_id;
    this._profileService.deleteTokenUser(cons_client).subscribe((res: any) => {
      this.snackBar.open('Token eliminado. El token ha sido eliminado.', 'Cerrar', {
        duration: 3000,
      });
      this.token = '';
    });
  }

  addAccountItem(cuenta: any = {}) {
    const accountsArray = this.formInformationCompany.get('cuentas') as FormArray;
    accountsArray.push(
      this.fb.group({
        nombre: [cuenta.nombre_titular_cuenta || '', Validators.required],
        cbu: [cuenta.numero_cuenta_bancaria || '', Validators.required],
        alias: [cuenta.nombre_cuenta_bancaria || '', Validators.required],
        cuit: [cuenta.cuit_cuil || '', Validators.required],
        direccion: [cuenta.direccion_envio || '', Validators.required],
        observaciones: [cuenta.detalle_cuenta_bancaria || ''],
        active: [false],
      })
    );
  }

  toggleAccountActive(index: number) {
    const accountsArray = this.formInformationCompany.get('cuentas') as FormArray;
    for (let j = 0; j < accountsArray.length; j++) {
      accountsArray.at(j).get('active')?.patchValue(false);
    }
    if (index !== this.currentOpen) {
      accountsArray.at(index).get('active')?.patchValue(true);
      this.currentOpen = index;
    } else {
      this.currentOpen = -1;
    }
  }

  addFicha() {
    const cuentaForm = this.fb.group({
      nombre: ['', Validators.required],
      cbu: ['', Validators.required],
      alias: ['', Validators.required],
      cuit: ['', Validators.required],
      direccion: ['', Validators.required],
      observaciones: [''],
      active: [false],
    });

    this.getCuentas.push(cuentaForm);
  }

  deleteFicha(index: number) {
    this.getCuentas.removeAt(index);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files.length > 0) {
      const file: File = input.files[0];
      const validExtensions = /\.(jpg|jpeg|png)$/i;

      if (!validExtensions.test(file.name)) {
        this.snackBar.open('Tipo de archivo incorrecto. Únicamente se permiten archivos .jpg, .jpeg, .png.', 'Cerrar', {
          duration: 3000,
        });
        return;
      }

      if (this.company) {
        this._profileService.postFileLogo(file, `logo/${this.company.cons_cliente}/`, this.company.cons_cliente).subscribe(() => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            this.company!.url_logo = reader.result as string;
          };
        });
      }
    }
  }

  get getCuentas(): FormArray {
    return this.formInformationCompany.get('cuentas') as FormArray;
  }

  private loadCompanyData() {
    if (this.company) {
      this.formInformationCompany.patchValue({
        nombres: this.company.nombre_empresa,
        nit: this.company.nit,
        domicilio: this.company.correspondencia,
        telefono: this.company.telefono_empresa,
        representante: this.company.representante,
      });

      const cuentas = JSON.parse(this.company.cuentas || '[]');
      for (const cuenta of cuentas) {
        this.addAccountItem(cuenta);
      }
    }
  }
}
