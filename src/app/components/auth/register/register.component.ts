import { Component, inject, OnInit, signal } from '@angular/core';
import { AppButtonsSocialComponent } from './app-buttons-social/app-buttons-social.component';
import { FirebaseserviceauthService } from '../../../core/services/auth/firebase/firebaseserviceauth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PulquiAuthService } from '../../../core/services/auth/pulqui-auth.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { lastValueFrom, take } from 'rxjs';
import { ProfileService } from '../../marketplace/profile/profile.service';
import { ProfileModel } from '../../marketplace/profile/profile.types';
import { NewUser } from '../../../core/models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [AppButtonsSocialComponent,ReactiveFormsModule,FormsModule,MatFormFieldModule,MatIconModule,MatInputModule,MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<RegisterComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  title = signal('Registro');
  _authenticationService = inject(AuthenticationService);
  subTitle = 'Acceda a todo el ecosistema de aplicaciones de DVT';
  togglePassword="password";
  togglePassword2="password";
  toggleEye: boolean = false;
  verrecuperarcorreo = false;
  verregistro = false;
  verlogin = false;
  camporecuperarcontra:string='';
  tabActive=0;
  // clases
  submitWrapperClasses = 'action-form-wrapper';
  submitButtonClasses = 'submit-button';
  colorSubmitButton = 'primary';
  logoTitleWrapperClasses = 'logo-title-wrapper';
  imgUrl = 'assets/images/pulqui/logo-big.png';
  logoWrapperClasses = 'logo-wrapper';
  snackBarRef:MatSnackBarRef<any> | null=null;
  step: number = 0;







  registroForm = new FormGroup({
    correocampo: new FormControl('', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    contrasenacampo: new FormControl('', Validators.required),
    confirmarcontrasenacampo: new FormControl('', Validators.required),
    confirmarcapchacampo: new FormControl('', Validators.required),
  });

  registroBasicoForm = new FormGroup({
    nombres: new FormControl('', [Validators.required, Validators.maxLength(45), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$')]),
    apellidos: new FormControl('', [Validators.required, Validators.maxLength(45), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$')]),
    identificacion: new FormControl('', [Validators.required, Validators.maxLength(45), Validators.pattern('^[0-9]*$')]),
    telefono: new FormControl('', [Validators.required, Validators.maxLength(45), Validators.pattern('^[+0-9]*$')]),
  });

  LoginForm = new FormGroup({
    correocampologin:new FormControl ('',[Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    contrasenacampologin:new FormControl ('', Validators.required)
  });

  registroEmpresaForm = new FormGroup({
    CampoNombreEmpresa: new FormControl('', Validators.required),
    CampoTelefono: new FormControl('', [Validators.required,Validators.maxLength(45),Validators.pattern('^[+0-9]*$')]),
    CampoCuit: new FormControl('', Validators.required),
    CampoNombreContacto: new FormControl('', Validators.required),
    CampoCorreoElectronico: new FormControl('', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
  });

  LoginRecuperar = new FormGroup({
    correocampologinrecuperar: new FormControl('', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
  });

  autorizaControl = new FormControl(null, Validators.required);

  constructor(
    private _firebaseserviceauthService: FirebaseserviceauthService,
    private _pulquiAuthService: PulquiAuthService,
    private _snackBar: MatSnackBar,
    private _profileService: ProfileService,
    // private _authenticationService:AuthenticationService 

  ){

  }

  ngOnInit(): void {
    this._authenticationService.errorUser$.subscribe((res:any)=> {
      
      if(res) {
        this.snackBarRef? this.snackBarRef.dismiss():null;
        this.openSnackBar(res);
        this._authenticationService._errorUser.next(null);
      }
    });
    this._authenticationService.user$.subscribe((res:any)=>{
      console.log('_authenticationService res', res);
      if (res && res.email ) {
        if (res.firt_name || res.last_name) {

        } else {
          
        }
        //this.openSnackBar('¡Bienvenido!');
      }
    });
    console.log(this.data.login);
    if (this.data.login) {
      this.title.set('Iniciar Sesión')
      this.verlogin = true;
      
    } else {
      this.verregistro = true;
    }
  }

  clickSocial($event:string,type:string){
    if($event=='google') this.continuarConGoogle(type);
    else if ($event=='facebook') this.continuarConFacebook();

  }

  async continuarConGoogle(type:string) {
    this._firebaseserviceauthService.GoogleAuthV2('new')
      .then((res:any) => {
        console.log('res continuarConGoogle', res);
        //Get authenticated email
        const email = res?.user?.email;
        this.registerNewUser(email,type);
      }
    );
  }

  registerNewUser(email: string,type:string){
    //Validate email 
    this._pulquiAuthService.validar_usuario_v2(email).subscribe((res: any)=>{
      //If there's not a user created with this email
      if(res.data.length == 0 && type=='new'){
        const formBasic = this.registroBasicoForm.value;
        const data: NewUser = {
          nombres: formBasic.nombres ?? '',
          apellidos: formBasic.apellidos ?? '',
          identificacion: formBasic.identificacion ?? '',
          telefono: formBasic.telefono ?? '',
          correo: email
        }
        this._pulquiAuthService.nuevo_usuario_pulqui_v2(data).subscribe(res=>{
          this._firebaseserviceauthService.LoginAplicacionPrincipal();
          this.dialogRef.close();
        });
      }else if(res.data[0]?.is_valid){
        //If the user is valid
        this._firebaseserviceauthService.LoginAplicacionPrincipal();
        this.openSnackBar('¡Bienvenido!');
        this.dialogRef.close();
      }
      else{
        //If the user is not valid
        this.openSnackBar('Este usuario no se encuentra registrado o está inhabilitado.');
        this.dialogRef.close();
        this._firebaseserviceauthService.SignOut();
      }
    });
  }

  

  async continuarConFacebook() {
    // await this._firebaseserviceauthService.FacebookAuth();
  }


  async loginuserandpass() {
    if (this.LoginForm.valid) {

      this.openSnackBar('Cargando...');
      await this._firebaseserviceauthService.SignIn(this.LoginForm.value.correocampologin as string, this.LoginForm.value.contrasenacampologin as string)
        .then((res: any) => {
          this.snackBarRef ? this.snackBarRef.dismiss() : null;
          if (res && res.code) {
            if (res.code && res.code == "auth/user-not-found" || res.code == "auth/wrong-password") {
              this.openSnackBar('Correo electrónico y/o contraseña no válidos.');
            } else {
              this.snackBarRef ? this.snackBarRef.dismiss() : null;
              this.openSnackBar('Correo electrónico contraseña no válidos.');
            }
          } else {
            //Validate email 
            this._pulquiAuthService.validar_usuario_v2(this.LoginForm.value.correocampologin as string).subscribe((res: any) => {
              //If there's not a user created with this email
              if (res.data.length == 0) {
                this.openSnackBar('Usuario no encontrado');
              } else if (res.data[0].is_valid) {
                //If the user is valid
                this._firebaseserviceauthService.LoginAplicacionPrincipal();
                this.openSnackBar('¡Bienvenido!');
                this.dialogRef.close();
              }
              else {
                //If the user is not valid
                this.openSnackBar('Este usuario está inhabilitado.');
                this.dialogRef.close();
                this._firebaseserviceauthService.SignOut();
              }
            });
          }
        }).catch((err: any) => {
          this.openSnackBar('Error al iniciar sesión.');
          this.dialogRef.close();
        });
    }
  }


  togglePasswordFunction() {
    this.togglePassword=(this.togglePassword=="password")?"text":"password";
    this.toggleEye = !this.toggleEye;
  }
  togglePasswordFunction2() {
      this.togglePassword2=(this.togglePassword2=="password")?"text":"password";
  }

  toggleModal(): void {
    this.dialogRef.close();
  }

  VerLogin() {
    this.verlogin = true;
    this.verrecuperarcorreo = false;
    this.verregistro=false
    this.title.set('Iniciar Sesión');
  }

  VerRecuperacionCorreo() {
    this.verlogin = false;
    this.verrecuperarcorreo = true;
    this.title.set('Recuperar Contraseña');
  }

  activarTab(tab: number, step: number = 0) {
    this.tabActive = tab;
    this.step = step;
    this.verregistro = true;
    this.verlogin = false;
    this.verrecuperarcorreo = false;
    this.title.set('Registro');
    if((tab==1 || tab==2)&& step==0){
      
    }
  }

  returnTab(){
    if(this.step === 0){
      this.activarTab(0) 
    } else{
      this.activarTab(this.tabActive, this.step-1);
    }
  }


  async recuperarcorreoenvio() {
    if (this.LoginRecuperar.valid) {

      this.openSnackBar('Enviando...');

      await this._firebaseserviceauthService.ForgotPassword(this.LoginRecuperar.value.correocampologinrecuperar as string)
      .then((res)=>{
        console.log(res);
        this.verlogin = true;
        this.verrecuperarcorreo = false;
        this.openSnackBar('Correo enviado exitosamente.');
      })
      .catch((error)=>{
        console.log(error);
        this.openSnackBar('No pudimos enviar el correo de recuperación de contraseña.');

      });
    } else {
      this.openSnackBar('Error: Escriba una dirección de correo electrónico para recibir el correo de recuperación de contraseña');

    }
  }


  async registrar() {
    const isValid = this.validateRegistroFormManual()
    if (isValid) {
      if (this.registroForm.value.contrasenacampo === this.registroForm.value.confirmarcontrasenacampo) {
        if(this.validatePassword(this.registroForm.value.contrasenacampo??'' )){
          this.openSnackBar('Cargando...');
          const result = await this._firebaseserviceauthService.SignUpV2(
            this.registroForm.value.correocampo??'',
            this.registroForm.value.contrasenacampo ??'' 
          );
          console.log(result);
          
          if(result.completed){
            this.registerNewUser(this.registroForm.value.correocampo??'','new');
          }else{
            this.openSnackBar(result.message);
          }
        }
      } else  this.openSnackBar('Error: La confirmación de la contraseña no coincide');
    }
  }

  validateRegistroFormManual(){
    return !this.registroForm.get('correocampo')?.invalid &&
    !this.registroForm.get('contrasenacampo')?.invalid &&
    !this.registroForm.get('confirmarcontrasenacampo')?.invalid;
  }

  continuarRegistro(){
    if(this.registroBasicoForm.valid){
      this.activarTab(1,1);
    }
  }


  async registrarEmpresa() {
    if (this.registroEmpresaForm.valid) {
        let newRegisterEnterprise = this._authenticationService.newRegisterEnterprise(this.registroEmpresaForm.value.CampoNombreEmpresa,
          this.registroEmpresaForm.value.CampoTelefono,
          this.registroEmpresaForm.value.CampoCuit,
          this.registroEmpresaForm.value.CampoNombreContacto,
          0,
          this.registroEmpresaForm.value.CampoCorreoElectronico).pipe(take(1))
          let res:any = await lastValueFrom(newRegisterEnterprise);

        this.openSnackBar(res.msm);

    }
  }

  validatePassword(p:string) {
    var errors = [];
    if (p.length < 6) {
        errors.push("Your password must be at least 6 characters");
    }
    if (p.search(/[a-z]/i) < 0) {
        errors.push("Your password must contain at least one letter.");
    }
    if (p.search(/[0-9]/) < 0) {
        errors.push("Your password must contain at least one digit.");
    }
    if (errors.length > 0) {
        this.openSnackBar(errors.join("\n"));
        return false;
    }
    return true;
  }


  openSnackBar(message:string) {
    this.snackBarRef = this._snackBar.open(message, 'Cerrar', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 6000
    });
    
  }

  onFocusOutEvent(event: any) {}

  removeScript(event:any){
    let value:string = event.target.value;
    if (value.length<11) this.registroEmpresaForm.get('CampoCuit')?.setErrors({ minLength: true });
    else if (value.length>11)  this.registroEmpresaForm.get('CampoCuit')?.setErrors({maxLength:true});
  }

  logout(){
    this._firebaseserviceauthService.SignOut();
  }

}
