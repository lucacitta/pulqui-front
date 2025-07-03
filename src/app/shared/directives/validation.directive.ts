import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../core/services/auth/authentication.service';
import { lastValueFrom } from 'rxjs';

@Directive({
  selector: '[appValidation]',
  standalone: true
})
export class ValidationDirective {

  url = `${environment.URL_BACKEND}/roles/getPermission`;
  constructor( 
      private http: HttpClient,
      private el: ElementRef, 
      private renderer: Renderer2,
      private _authenticationService: AuthenticationService
    ) { }
  @Input() set appValidation(ban:string)  {
    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    this._authenticationService.user$.subscribe(async user=>{
        if (user && user.idUsuario) {
          let qdata={userId: user.idUsuario,permis: ban};
          const permitions$  = this.http.post(this.url,qdata);
          await lastValueFrom(permitions$).then((result:any)=>{
            if (result.data)  this.renderer.removeStyle(this.el.nativeElement,'display');
          });
        }
      
    });
  }

}
