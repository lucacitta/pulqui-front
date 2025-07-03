import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth/authentication.service';
import { lastValueFrom, take } from 'rxjs';

export const authGuard: CanActivateFn = async  (route, state) => {
  const _authenticationService = inject(AuthenticationService);
  const router = inject(Router); 
  const user$  = _authenticationService.user$.pipe(take(1));
  const user = await lastValueFrom(user$);
  if (!user) router.navigate(['/'])
  return user?true:false;
};
