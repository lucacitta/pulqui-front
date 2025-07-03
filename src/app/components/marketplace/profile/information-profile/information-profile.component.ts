import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ProfileModel } from '../profile.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../../core/services/auth/authentication.service';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-information-profile',
  templateUrl: './information-profile.component.html',
  styleUrls: ['./information-profile.component.scss'],
})
export class InformationProfileComponent implements OnInit {
  @Input() user?: ProfileModel;
  @Output() updateUser = new EventEmitter<ProfileModel>();
  formInformation: FormGroup;
  cont = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _authenticationService: AuthenticationService,
    private _profileService: ProfileService
  ) {
    this.formInformation = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      identificacion: ['', [Validators.required, Validators.maxLength(10)]],
      telefono: [''],
    });
  }

  ngOnInit() {
    if (this.user) {
      this.formInformation.patchValue(this.user);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'].currentValue !== undefined) {
      //this.crearFormulario();
    }

    this._authenticationService.user$.subscribe(user => {});
  }

  updateDataUser() {
    const dataUser: ProfileModel = {
      cons_persona: this.user?.cons_persona || 0,
      nombres: this.user?.social ? this.user?.nombres : this.formInformation.get('nombres')?.value,
      apellidos: this.user?.social ? this.user?.apellidos : this.formInformation.get('apellidos')?.value,
      identificacion: this.formInformation.get('identificacion')?.value || '',
      telefono: this.formInformation.get('telefono')?.value || '',
      correo: this.user?.correo || '',
      enlace_imagen: this.user?.enlace_imagen || '',
    };

    this._profileService.updateDataUser(dataUser).subscribe({
      next: () => {
        this.updateUser.emit(dataUser);
        this.snackBar.open('Información básica cambiada', 'cerrar', { duration: 2000 });
      },
      error: error => {
        console.log(error);
      },
    });
  }
}
