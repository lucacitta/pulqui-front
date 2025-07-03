import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  signal,
  effect,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from './category.service';
import { take, finalize } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { MatDrawer } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  animations: [
    trigger('overlayFade', [
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class CategoryComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  @ViewChild('drawer') drawer?: MatDrawer;
  @ViewChild('scrollContainer', { read: ElementRef })
  scrollContainer!: ElementRef<HTMLElement>;

  // flags & signals
  isLoading = true;
  private initialScrollDone = false;
  user = signal<any>(null);

  // data stores
  categories: any[] = [];
  subCategories: any[] = [];
  products = signal<any[]>([]);
  filterData: any = {
    CF: [],
    CL: [],
    MR: [],
    precio: { desde: null, hasta: null },
  };
  private initialFilterData = JSON.parse(JSON.stringify(this.filterData));

  // route params
  id_category: number | null = null;
  id_subcat: number | null = null;
  id_store: number | null = null;
  isStore = false;
  name_subcat = '';
  nameCategory = '';

  // layout & UI
  filter = true;
  isHandset = false;
  filterList = [
    { name: 'Mayor precio', val: -1 },
    { name: 'Menor precio', val: 1 },
  ];
  suscriptionFilter: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public _categoryService: CategoryService,
    private _authenticationService: AuthenticationService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    // escuchar filtro desde el hijo
    this.suscriptionFilter = this._categoryService
      .getFilterChangeEmitter()
      .subscribe((data) => {
        this.filterData = data;
        this.getAllItems(this.id_subcat);
      });

    // parámetros de ruta
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.id_subcat = params.get('subcategories')
        ? +params.get('subcategories')!
        : null;
      this.id_store = params.get('stores') ? +params.get('stores')! : null;
      this.id_category = params.get('category')
        ? +params.get('category')!
        : null;
      this.isStore = !!this.id_store;
      this.getCategories();
    });

    // estado inicial de filtros en móvil
    if (window.innerWidth < 780) this.filter = false;
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isHandset = result.matches;
        this.filter = !result.matches;
      });

    // reaccionar a usuario autenticado
    effect(
      () => {
        this._authenticationService.user$.subscribe((user) => {
          this.user.set(user);
          this.getCategories();
        });
      },
      { allowSignalWrites: true }
    );
  }

  ngAfterViewInit() {
    // nada aquí; scroll se hará en AfterViewChecked
  }

  ngAfterViewChecked() {
    if (!this.initialScrollDone) {
      this.scrollToTop();
      this.initialScrollDone = true;
    }
  }

  ngOnDestroy(): void {
    this.suscriptionFilter.unsubscribe();
  }

  getDrawerMode(): 'side' | 'over' {
    return this.isHandset ? 'over' : 'side';
  }

  private scrollToTop() {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getCategories() {
    if (this.id_store) {
      this.getAllItems(this.id_subcat);
    } else {
      this._categoryService
        .getCategories()
        .pipe(take(2))
        .subscribe(
          (list: any) => {
            this.categories = Array.isArray(list) ? list : [];
            const found = this.categories.find(
              (c) => c.id === this.id_category
            );
            this.subCategories = Array.isArray(found?.subcategories)
              ? found!.subcategories
              : [];
            this.getAllItems(this.id_subcat);
          },
          (err) => console.error('Error fetching categories:', err)
        );
    }
  }

  getAllItems(subcat: number | null) {
    this.isLoading = true;
    this.id_subcat = subcat;

    const call$ = this.id_store
      ? this._categoryService.allProductsStore(this.id_store, this.filterData)
      : this._categoryService.allProductsCategory(
          this.id_category,
          this.id_subcat ?? 0,
          this.filterData
        );

    call$
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.scrollToTop(); // scroll tras cada carga
        })
      )
      .subscribe(
        (res) => {
          this.nameCategory = res[0]?.des_categoria_producto ?? '';
          this.products.set(res);
          this._categoryService.isFavoritesReady$.set(true);
        },
        (err) => console.error('Error loading products:', err)
      );
  }

  orderList(val: number) {
    const arr = [...this.products()];
    this.products.set(
      arr.sort((a, b) =>
        val === 1 ? (a.valor > b.valor ? 1 : -1) : a.valor < b.valor ? 1 : -1
      )
    );
  }

  resetFilters() {
    this.filterData = JSON.parse(JSON.stringify(this.initialFilterData));
    this.getAllItems(this.id_subcat);
  }
}
