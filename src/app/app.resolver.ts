import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FirebaseserviceauthService } from './core/services/auth/firebase/firebaseserviceauth.service';
import { forkJoin } from 'rxjs';

export const appResolver: ResolveFn<any> = (route, state) => {
  const firebaseServices = inject(FirebaseserviceauthService);

  return firebaseServices.getAuthStateInit();
};
