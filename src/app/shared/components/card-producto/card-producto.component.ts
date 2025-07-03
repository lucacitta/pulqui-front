import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FavShareComponent } from '../fav-share/fav-share.component';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-card-producto',
  templateUrl: './card-producto.component.html',
  imports: [MatCardModule, MatButtonModule, RouterLink, CommonModule, MatTooltipModule, FavShareComponent],
  standalone: true
})
export class CardProductoComponent implements OnInit {
  @Input() item: any
  @Input() favorites: any;
  default_image = '../../../../assets/images/not-image.jpg';
  is_taxInclude = false;



  constructor(private _authenticationService: AuthenticationService,
      private _authService: AuthService
  ) {}

  async ngOnInit() {
    this._authenticationService.user$.subscribe({
      next: user => {

        if (user && user.idUsuario){ 
          this._authService.rolePermit(user.idUsuario,"v_iva").subscribe(res=>{
            this.is_taxInclude = res;
          })
        }else{
          this.is_taxInclude = true;
        }
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
    
  }

  getUnitDiscount(item: any) {
    
    if (item.valor_descuento){
      let valDiscount = parseFloat((item.valor_descuento - (item.valor_descuento * ((item.porcentaje >0 ? item.porcentaje : 0 )/ 100))).toFixed(0));
      return this.is_taxInclude ?  parseFloat((valDiscount + (valDiscount * ((item.impuesto >0 ? item.impuesto : 0 )/ 100))).toFixed(0)):valDiscount;
    }
    
    return;
  }

  getUnitPesos(item: any) {
    if (item.valor_descuento)  return this.is_taxInclude ?  parseFloat((item.valor_descuento + (item.valor_descuento * ((item.impuesto >0 ? item.impuesto : 0 )/ 100))).toFixed(0)):item.valor_descuento;
    return;
  }



  capitalize(text: string | undefined): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
