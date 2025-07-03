import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FavoritesService } from '../../favorites/services/favorites.service';
import { Color } from '../../../models/colors.model';
import { UdcService } from '../../udc/services/udc.service';
import { Product } from '../../../models/product.model';
import { UDC } from '../../../models/udc.model';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { DatosCalificacionModel } from '../../../models/datos-calificacion.model';
import { ComentariosModel } from '../../../models/comentarios.model';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { EnviarCalificacionModel } from '../../../models/enviar-calificacion.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HeaderService } from '../../../layout/header/header.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  idUser!: number;
  favorites: number[] = [];
  product: any = {};
  favoritesLength: number = 0;
  idProducto: string = '';
  colorList: Color[] = [];
  isValid: boolean = false;
  consumidorFinal: boolean = false;
  empresa: boolean = false;
  caracteristicas: any = {};
  verMas = false;
  isIvaPermission: boolean = false;
  screenSize$: Observable<'mobile' | 'tablet' | 'desktop'>;

  colorsDepreciados: string[] = [];
  // Comentario
  calificacion$ = new BehaviorSubject<DatosCalificacionModel>({
    calificacion: 0,
    comentario: '',
  });
  comentarios$!: Observable<ComentariosModel[]>;
  idUsuario: number = 0;
  isLoadingMoney = false;
  isAuthenticated = false;
  esEmpresa = false;


  constructor(
    private productService: ProductService,
    private favoritosService: FavoritesService,
    private _udcServices: UdcService,
    public _rutaActiva: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private headerService: HeaderService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {
    this.screenSize$ = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Tablet, Breakpoints.Web])
      .pipe(
        map((state) => {
          if (state.breakpoints[Breakpoints.XSmall]) {
            return 'mobile';
          } else if (state.breakpoints[Breakpoints.Tablet]) {
            return 'tablet';
          } else {
            return 'desktop';
          }
        })
      );
  }

  ngOnInit(): void {
    this.idProducto = this._rutaActiva.snapshot.params['idProducto'];
    this.getProductInfo();
    this.authenticationService._user.subscribe({
      next: user => {
        if (user && user.idUsuario) {
          this.idUsuario = user.idUsuario;
          this.authService.rolePermit(this.idUsuario, "v_iva").subscribe(data => {
            this.isIvaPermission = data;
          });
          this.esEmpresa = user.empresa;
          this.getFavorites();
          this.getProductInfo();
          this.cargarComentarios();
          this.isAuthenticated = true;
        } else {
          this.idUsuario = 0;
          this.isValid = false;
          this.isAuthenticated = false;
          this.isIvaPermission = true;
        }
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  getProductInfo() {
    this.isLoadingMoney = true;
    this.productService.detailProduct(this.idProducto).subscribe({
      next: async (prod) => {
        this.product = prod;

        if (!this.product["name"]) {
          this.router.navigate(['/marketplace/home']);
          return
        }

        this.productService.getColorList().subscribe((colors: Color[]) => {
          this.colorList = colors;
          this.colorList.map((color: Color) => (color.select = false));

          this.isValid = this.product['permite_compra'];
          this.consumidorFinal = this.product['venta_cosumidor_final'];
          this.empresa = this.product['venta_publica'];
          if (this.product['url_image']) {
            this.product['url_image'] = this.product['url_image'].replace(/ /g, '%20');
          }
          if (this.product['image'].length) {
            this.product['image'].map((item: any) => (item['url_imagen'] = item['url_imagen'].replace(/ /g, '%20')));
          }
          this.product['cons_producto'] = this.idProducto;

          const colorsPadre = this.product['colores_padre'] ? JSON.parse(this.product['colores_padre']) : [];

          this.colorList = colorsPadre
            .map((element: string) => this.colorList.find((color: Color) => color.cod.toUpperCase() === element.toUpperCase()))
            .filter((color: Color): color is Color => color !== undefined);
          this.getCaracteristicas();
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.log(err);
        this.router.navigate(['/marketplace/home']);
      },
    });
  }

  getFavorites() {
    let array_ids: number[] = [];
    this.favoritosService.getFavorites({ usuario: this.idUsuario }).subscribe((data: any) => {
      let datos = data.data;
      datos.forEach((d: any) => {
        array_ids.push(d.cons_producto);
      });
      this.favorites = array_ids;
      this.favoritesLength = this.favorites.length;
      let url = environment.urlPublic + '/marketplace/producto/' + this.product['cons_producto'];
      let color = 'basic';

      let find_favorite = this.favorites.findIndex((i: number) => i == this.product['cons_producto']);
      if (find_favorite !== -1) color = 'accent';
      this.product['color'] = color;
      this.product['url'] = url;
    });
  }
  /** Método para añadir o quitar de favoritos */
  toggleFavorite(): void {
    const prodId = Number(this.product.cons_producto);
    if (this.favorites.includes(prodId)) {
      // ya está en favoritos -> lo quitamos
      this.favoritosService
        .removeFavorites({
          producto: prodId, usuario: this.idUsuario,
          favorite: undefined
        })
        .subscribe(() => {
          this.favorites = this.favorites.filter(f => f !== prodId);
        });
    } else {
      // no está -> lo añadimos
      this.favoritosService
        .addFavorites({ producto: prodId, usuario: this.idUsuario })
        .subscribe(() => {
          this.favorites.push(prodId);
        });
    }
  }

  getCaracteristicas() {
    this.productService.detailProductCaracteristicas(this.idProducto).subscribe(prod => {
      const data = prod?.data?.[0];
      if (data?.marca) {
        this.caracteristicas = data;
        this.caracteristicas.caracteristicas = JSON.parse(data.carfisicas || '{}');
      }
      this.isLoadingMoney = false;
    });
  }

  obtenerColoresOcultos(producto: Product) {
    const { curva_padre, reference } = producto;
    const obj = {
      cons_codigo_producto: '00T',
      cons_codigo_definido_usuario: curva_padre,
    };

    this._udcServices.obtenerDetalleUDC(obj).subscribe((res: UDC[]) => {
      const tallas = [...new Set(res.map(item => item.cons_codigo))];

      this.productService.getColorsForValdiate(reference).subscribe((response: Color[]) => {
        const colors: string[] = [...new Set(response.map(element => element['color']))];

        colors.forEach(color => {
          const sizesFiltered = response.filter(element => element['color'] === color && tallas.includes(element['talla']));
          const allDepreciated = sizesFiltered.every(element => element['depreciado'] === 1);

          if (allDepreciated) {
            this.colorsDepreciados.push(color.toUpperCase());
          }
        });

        console.log('colores ocultos', this.colorsDepreciados);
      });
    });
  }

  initSingup() {
    this.headerService.initLogin(true);
  }

  goToCategory(): void {
    if (this.product) {
      const consClienteOut = this.product.cons_cliente_out;
      if (consClienteOut) {
        this.router.navigate(['/marketplace/products'], {
          queryParams: { stores: consClienteOut }
        });
      } else {
        console.error('cons_cliente_out no está definido en el producto');
      }
    } else {
      console.error('Producto no está definido');
    }
  }

  onEviaCalificacion(calificacion: DatosCalificacionModel): void {
    this.handleCalificacion(calificacion);
  }

  onEditarCalificacion(calificacion: DatosCalificacionModel): void {
    this.handleCalificacion(calificacion);
  }

  private handleCalificacion(calificacion: DatosCalificacionModel): void {
    const cal = {
      product: this.idProducto,
      user: this.idUsuario,
      comment: calificacion.comentario,
      score: calificacion.calificacion,
    };

    if (this.isAuthenticated) {
      const cal: EnviarCalificacionModel = {
        product: this.idProducto,
        user: this.idUsuario,
        comment: calificacion.comentario || '', // Proporciona un valor predeterminado si es undefined
        score: calificacion.calificacion ?? 0, // Proporciona un valor predeterminado si es undefined
      };
      this.productService
        .enviarCalificacion(cal)
        .pipe(take(1))
        .subscribe(() => {
          this.cargarComentarios();
        });
    } else {
      // this.authService.login();
    }
  }

  cargarComentarios(): void {
    this.comentarios$ = this.productService.obtenerListaCalificaciones(this.idProducto).pipe(
      tap(lista => {
        if (!this.idUsuario) {
          return;
        }
        const cal = lista.find(item => item.cons_usuario === this.idUsuario);
        if (cal) {
          const { calificacion, comentario } = cal;
          this.calificacion$.next({ calificacion, comentario });
        }
      }),
      map(lista =>
        lista.map(({ nombres, apellidos, calificacion, comentario, fecha_calificacion }) => ({
          nombres,
          apellidos,
          calificacion,
          comentario,
          fecha: fecha_calificacion,
        }))
      )
    );
  }

  toggleVerMas(): void {
    this.verMas = !this.verMas;
  }

  validarColorOcultos(color: string) {
    return !this.colorsDepreciados.includes(color.toUpperCase());
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }


  getUnitDiscount(item: any, valor: number) {

    if (valor) {
      let valDiscount = parseFloat((valor - (valor * ((item.porcentaje_descuento > 0 ? item.porcentaje_descuento : 0) / 100))).toFixed(0));
      return this.isIvaPermission ? parseFloat((valDiscount + (valDiscount * ((item.iva > 0 ? item.iva : 0) / 100))).toFixed(0)) : valDiscount
    }

    return;
  }



}


