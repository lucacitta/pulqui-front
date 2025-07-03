import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';
import { HomeService } from './../../home.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProductoComponent } from '../../../../../shared/components/card-producto/card-producto.component';


@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss',
  standalone: true,
  imports: [RouterLink, RouterOutlet,CardProductoComponent , CommonModule]
})
export class StoresComponent implements OnInit{
  public stores: any = ''; //TODO: create types
  user_id: number = 0;
  isAuthenticated = false;


  constructor(
    private _homeService:HomeService, 
    private _authenticationService: AuthenticationService,
    private router:Router
  ){}

  ngOnInit(): void {
    this._authenticationService.user$.subscribe({
      next: user => {
        if (user && user.idUsuario) {
          this.user_id = user.idUsuario;
          this.getStores();
          this.isAuthenticated = true;
        } else {
          this.user_id = 0;
          this.getStores();
          this.isAuthenticated = false;
        }
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  getStores(): void {
    this._homeService.getStores(this.user_id).subscribe(
      (res: Store[]) => {
        this.stores = res; // Asignamos directamente los datos recibidos
      },
      (error) => {
        console.error('Error al obtener las tiendas:', error);
        this.stores = []; // Aseguramos que esté vacío si hay un error
      }
    );
  }

  trackByStore(index: number, store: Store): number {
    return store.cons_cliente; // Usamos el ID único de la tienda para el trackBy
  }
  openStore(cons_cliente: number){
    this.router.navigate(['/marketplace/products'],{queryParams:{stores:cons_cliente}})
  }


}

// Creamos un tipo para las tiendas
interface Store {
  cons_cliente: number;
  nombre_cliente: string;
  url_logo: string;
}
