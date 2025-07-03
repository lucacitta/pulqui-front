import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, filter, map, Observable, Subject } from 'rxjs';
import { VerticalHeaderAccountComponent } from '../vertical-header-account/vertical-header-account.component';
import { RegisterComponent } from '../../components/auth/register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { SearchService } from '../../components/marketplace/search/search.service';
import { AuthenticationService } from '../../core/services/auth/authentication.service';
import { HeaderService } from './header.service';
import { CategoryService } from '../../components/marketplace/category/category.service';
import { HomeService } from '../../components/marketplace/home/home.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    VerticalHeaderAccountComponent,
    FormsModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @ViewChild('productSearchInput') productSearchInput: ElementRef = {} as ElementRef;

  isLogged = signal(false);
  isMenuOpen: boolean = false;
  screenSize$: Observable<'mobile' | 'tablet' | 'desktop'>;
  searchInput: string = '';
  itemCart = this.headerService.itemsCart$;
  categories: any = {};
  user: any = null;

  private searchSubject = new Subject<string>(); // Nuevo Subject para manejar el debounce
  readonly dialog = inject(MatDialog);

  constructor(
    private _authenticationService: AuthenticationService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private _searchService: SearchService,
    private headerService: HeaderService,
    private CategoryService: CategoryService,
    private _homeService: HomeService
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

    _authenticationService.user$.subscribe((res: any) => {
      this.user = res;
      if (res) {
        this.isLogged.set(true);
      } else {
        this.isLogged.set(false);
      }
      this.getShopItemsCart1();
      this._homeService.getCategories(this.user?.idUsuario ?? 0).subscribe(res => {
        this.categories = res;
      });
    });

    // Manejo del debounce del search
    this.searchSubject.pipe(
      debounceTime(800)
    ).subscribe(query => {
      if (query.length > 2) {
        this._searchService.search(query);
        this.router.navigate(['marketplace/search']);
      }
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url != '/marketplace/search') {
          this.searchInput = '';
        }
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.toggleScrollBlock(this.isMenuOpen);
  }

  toggleScrollBlock(block: boolean): void {
    if (block) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  initLogin($event: any) {
    this.dialog.open(RegisterComponent, {
      width: '25rem',
      data: {
        login: $event,
      },
    });
  }

  goMarketplace(): void {
    this.router.navigate(['/marketplace/home']);
  }

  onSearchChange(value: string): void {
    if (value === '') {
      this.goMarketplace();
    }
    this.searchSubject.next(value);
  }

  getShopItemsCart1() {
    this.headerService.getShopItemsCart();
  }

  openCategory(item: any) {
    console.log(item);
    this.router.navigate(['/marketplace/products'], {
      queryParams: { category: item.id }
    }).then(() => window.location.reload());
  }

  descargarCatalogo() {
    location.href = 'https://storage.googleapis.com/storage-pulqui-mkp/catalogo/catalogo_all.pdf';
  }
}
