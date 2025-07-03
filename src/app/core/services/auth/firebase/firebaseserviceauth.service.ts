import { inject, Injectable, NgZone } from '@angular/core';
import { User } from '../../../models/user';

//import firebase from 'firebase/app';
//import {Auth, FacebookAuthProvider,GoogleAuthProvider,signInWithEmailAndPassword} from'firebase/auth';
//import 'firebase/messaging';

import { Auth,authState,FacebookAuthProvider,GoogleAuthProvider,signInWithEmailAndPassword,getAuth,createUserWithEmailAndPassword ,sendPasswordResetEmail,signInWithPopup } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Router } from '@angular/router';


import { AuthenticationService } from '../authentication.service';
//import { PulquiAuthService } from '../pulqui-auth.service';
import { BehaviorSubject, lastValueFrom, Observable, ObservableInput, Subscription, take } from 'rxjs';
import { initializeApp } from '@angular/fire/app';
import { environment } from '../../../../../environments/environment';






@Injectable({
  providedIn: 'root',
})
export class FirebaseserviceauthService {
  private afAuth: Auth = inject(Auth);
  private _userData=new BehaviorSubject<any>({}); // Save logged in user data
  politicas: any[] = [];
  public messaging = null;
  authState$ = authState(this.afAuth);
  token:any=null;
  user_type: string = 'old';

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    //public afm: AngularFireMessaging, // Inject Firestore service
    //public afAuth: Auth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    private _authenticationService: AuthenticationService,
    //private pulquiAuthService: PulquiAuthService
  ) {
    //TODO: nOTIFICACIONES PUSH
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    // if(firebase.messaging.isSupported()) {
    //   // let messaging = initializedFirebaseApp.messaging();
    //   this.messaging = firebase.messaging();
    // }
    const _appFirebase =initializeApp(environment.firebase)
    this.afAuth = getAuth(_appFirebase);
    this.authState$ = authState(this.afAuth);

    
  }
  get userData$() {
    return this._userData.asObservable();
  }
  set userData(value: User) {
    this._userData.next(value);
  }

  async getAuthState(){
    this.authState$.subscribe(async (aUser: any | null) =>{
      this._userData.next(aUser);
      if (this._userData.getValue() && this._userData.getValue().email) {
        let createUser$ = this._authenticationService.newuserpulqui(this._userData.getValue().email).pipe(take(1));
        await  lastValueFrom(createUser$);
        this.LoginAplicacionPrincipal();
      }
    })
  }
  
  async getAuthStateInit(){
    this.authState$.subscribe(async (aUser: any | null) =>{
      this._userData.next(aUser);
      if (this._userData.getValue() && this._userData.getValue().email && this.user_type == 'old') {
        this.ValidatorUserData();
      }
    })
  }

  async FacebookAuth() {
    
    let respuesta = await this.AuthLogin(new FacebookAuthProvider());
  }


  async GoogleAuth() {
    return  this.AuthLogin(new GoogleAuthProvider().addScope('https://www.googleapis.com/auth/contacts.readonly'))
      .then((result) => {
        if (result && result.user) {
          this.SetUserData(result.user );
          this.getAuthState();
        }
        return result;
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  async GoogleAuthV2(user_type: string) {
    this.user_type = user_type;
    return  this.AuthLogin(new GoogleAuthProvider().addScope('https://www.googleapis.com/auth/contacts.readonly'))
      .then((result) => {
        return result;
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Auth logic to run auth providers
  async AuthLogin(provider:any) {
    return signInWithPopup(this.afAuth,provider)
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user:any) {
    this.token=user.accessToken;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('currentUser');
      this._authenticationService.user=null;
      this.router.navigate(['/marketplace/home']);

      // this.router.navigate(['/marketplace/home']);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 500);
    });
  }


  // Sign in with email/password
  SignIn(email:string, password:string) {

    return signInWithEmailAndPassword(this.afAuth,email, password)
      .then((result) => {

        this.SetUserData(result.user);
        this.getAuthState();

      })
      .catch((error) => {
        console.log(error.code);
        return error;
      });
  }

  VerifyToken(){
    
  }































  requestPermission(emailin:string) {
    // [START messaging_request_permission]
    if (emailin) {

      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {    
          // TODO(developer): Retrieve a registration token for use with FCM.

          this.getToken(emailin);

          // ...
        } else {
          console.log('Unable to get permission to notify.');
        }
      });
    }
    // [END messaging_request_permission]
  }


  //TODO: nOTIFICACIONES PUSH
  async getToken(inemail:string) {

    // if(firebase.messaging.isSupported()) {

    //   this.afm.getToken.
    //     .getToken()
    //     .then((currentToken) => {
    //       if (currentToken) {
    //         // Send the token to your server and update the UI if necessary
    //         // ...
    //         console.log('fb', currentToken);
    //         this.afs.doc(`/usersmessage/${inemail}`).set({ token: currentToken });
    //       } else {
    //         // Show permission request UI
    //         console.log('No registration token available. Request permission to generate one.');
    //         // ...
    //       }
    //     })
    //     .catch((err) => {
    //       console.log('An error occurred while retrieving token. ', err);
    //       // ...
    //     });
    //   // [END messaging_get_token]
    // }
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.afAuth,email, password)
      .then((value) => {
        this.router.navigateByUrl('/profile');
      })
      .catch((err) => {
        console.log('Something went wrong: ', err.message);
      });
  }

  

  // Sign up with email/password
  SignUp(email:string, password:string) {
    return createUserWithEmailAndPassword(this.afAuth,email, password)
      .then((result) => {
        console.log('result in SignUp', result);
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        // this.SendVerificationMail();

        // this.getAuthState();

        this.SetUserData(result.user);
      })
      .catch((error) => {
        console.log('error', error)
        let sms ='Ocurrió un error a al momento de registrarse '
        sms = error.code =="auth/email-already-in-use"? 'La dirección de correo electrónico ya está en uso por otra cuenta':sms;
        console.log(sms);
        // swal.fire({
        //   text: sms,
        //   icon: 'error',
        // });
      });
  }


  // Sign up with email/password
  SignUpV2(email:string, password:string) {
    this.user_type = "new";
    return createUserWithEmailAndPassword(this.afAuth, email, password)
      .then((result) => {
        console.log('result in SignUp', result);
        this.SetUserData(result.user);
        return {completed: true, message: "El usuario se ha registrado exitosamente."}
      })
      .catch((error) => {
        let sms ='Ocurrió un error a al momento de registrarse '
        sms = error.code =="auth/email-already-in-use"? 'La dirección de correo electrónico ya está en uso por otra cuenta':sms;
        return {completed: false, message: sms}
      });
  }
  // Sign up with email/password
  SignUpEnterprise(email:string, password:string) {
    return createUserWithEmailAndPassword(this.afAuth,email, password)
      .then((result) => {
        this.ForgotPassword(email);
      })
      .catch((error) => {
        // swal.fire({
        //   text: error.message,
        //   icon: 'error',
        // });
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    // return this.afAuth.currentUser.sendEmailVerification().then(() => {
    //   this.router.navigate(['verify-email-address']);
    // });
  }

  // Reset Forggot password
  async ForgotPassword(passwordResetEmail:string,) {
    console.log(passwordResetEmail);  
    return await sendPasswordResetEmail(this.afAuth,passwordResetEmail);
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!):null;
    return user !== null ? true : false;
  }

  // Sign in with Google

  async LoginAplicacionPrincipal() {
    this.user_type = 'old';
    this._authenticationService.loginUser(this._userData.getValue().email).subscribe((res) => {
      if (res && res.user && res.user.email) {
        this._authenticationService.user=res.user;
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        localStorage.setItem('token', res.user.accessToken);
      }else{
        console.log('entra al signout')
        this.SignOut();
      }
    },(err)=>{
      console.log('entra al signout 2')
      this.SignOut();
    });
  }

  
  async ValidatorUserData() {
    this._authenticationService.loginUser(this._userData.getValue().email)
    .pipe(take(1)).subscribe((res) => {
      if (res && res.user && res.user.email && res.user.last_name && res.user.first_name) {
        this._authenticationService.user=res.user;
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        localStorage.setItem('token', res.user.accessToken);
      }else{

        this.SignOut();
      }
    },(err)=>{
      console.log('entra al signout')

      this.SignOut();
    });
  }




  

  // IniciarSession

  IniciarSession() {
    this.router.navigate(['sign-in']);
  }

  
}
