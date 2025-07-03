import { Component, OnInit, signal } from '@angular/core';
import { ProfileService } from '../profile.service';
import { CompanyInformation, ProfileModel } from '../profile.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../../core/services/auth/authentication.service';

@Component({
  selector: 'app-nav-profile',
  templateUrl: './nav-profile.component.html',
  styleUrls: ['./nav-profile.component.scss'],
})
export class NavProfileComponent implements OnInit {
  idUser: number = 0;
  profile$ = signal<ProfileModel | null>(null);
  company$ = signal<CompanyInformation | null>(null);
  isCompany: boolean = false;

  constructor(
    private _profileService: ProfileService,
    private _authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this._authenticationService.user$.subscribe(user => {
      if (user) this.getProfileData(user.idUsuario);
    });
  }

  getProfileData(idUsuario: number) {
    this._profileService.getProfile(idUsuario).subscribe(res => {
      this.profile$.set(res[0]);
      this.isCompany = this.profile$()?.es_empresa || false;
      if (this.isCompany) this.company$.set(res[0]);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files.length > 0) {
      const file: File = input.files[0];
      const profile = this.profile$();
      const validExtensions = /\.(jpg|jpeg|png)$/i;

      if (!validExtensions.test(file.name)) {
        this.snackBar.open('Tipo de archivo incorrecto. Únicamente se permiten archivos .jpg, .jpeg, .png.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });
        return;
      }

      if (profile) {
        this._profileService.postFile(file, `perfil/${profile.cons_persona}/`, profile.cons_persona).subscribe(() => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            profile.enlace_imagen = reader.result as string;
          };
        });
      }
    }
  }

  onUserUpdated(updatedData: ProfileModel) {
    const currentProfile = this.profile$();
    if (currentProfile) {
      currentProfile.nombres = updatedData.nombres;
      currentProfile.apellidos = updatedData.apellidos;
      currentProfile.correo = updatedData.correo;
    }
  }

  onUserSellerUpdated(updatedData: any) {
    this._profileService
      .updateCompanyProfileInfo(updatedData)
      .subscribe({
        next: (res: any) => {
          const currentUser = this.profile$();
  
          if (currentUser) {
            currentUser.nombre_empresa = updatedData.nombre_empresa;
            this.profile$.set({ ...currentUser });
          }
          
          this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', {
            duration: 3000,
          });
        },
        error: (error: any) => {
          console.log(error);
          this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      });
  }
  
}
