import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { inject } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { from, lastValueFrom, map } from 'rxjs';

export const interceptorInterceptor: HttpInterceptorFn =  (req, next) => {
  const _authenticationService = inject(AuthenticationService);

  req = req.clone({
    headers: req.headers.set('Current-User', `${_authenticationService._user.getValue()?JSON.stringify(_authenticationService._user.getValue()):'{}'}`)
  });
  

  return next(req); 
};
