import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { HomeService } from '../../home.service';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';
import { CardProductoComponent } from '../../../../../shared/components/card-producto/card-producto.component';

@Component({
  selector: 'app-most-selled-products',
  standalone: true,
  imports: [
    CommonModule,
    CardProductoComponent
  ],
  templateUrl: './most-selled-products.component.html',
  styleUrls: ['./most-selled-products.component.css'],
})
export class MostSelledProductsComponent implements OnInit, AfterViewInit {
  @ViewChild('slider', { read: ElementRef }) slider!: ElementRef<HTMLElement>;

  public products: any[] = [];
  user_id = 0;
  isAuthenticated = false;
  scrollAmount = 300;

  // drag state
  isDown = false;
  startX = 0;
  startY = 0;
  scrollLeftStart = 0;
  directionLocked: 'horizontal' | 'vertical' | null = null;
  threshold = 5;

  // loading flag
  isLoading = false;

  constructor(
    private _homeService: HomeService,
    private _authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this._authenticationService.user$.subscribe({
      next: user => {
        this.user_id = user?.idUsuario ?? 0;
        this.isAuthenticated = !!user?.idUsuario;
        this.getMostSelledProducts();
      },
      error: err => {
        console.error('Error fetching user:', err);
        this.getMostSelledProducts();
      },
    });
  }

  ngAfterViewInit(): void {
    const width = this.slider.nativeElement.clientWidth;
    this.scrollAmount = Math.round(width * 0.8);
  }

  getMostSelledProducts() {
    this.isLoading = true;

    this._homeService.getMostSelledProducts(this.user_id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: res => {
          this.products = Array.isArray(res) ? res : [];
        },
        error: err => {
          console.error('Error loading products:', err);
        }
      });
  }

  scroll(delta: number) {
    this.slider.nativeElement.scrollBy({ left: delta, behavior: 'smooth' });
  }

  dragStart(evt: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.slider.nativeElement.classList.add('active');

    const point = evt instanceof MouseEvent ? evt : evt.touches[0];
    this.startX = point.pageX;
    this.startY = point.pageY;
    this.scrollLeftStart = this.slider.nativeElement.scrollLeft;
    this.directionLocked = null;
  }

  dragMove(evt: MouseEvent | TouchEvent) {
    if (!this.isDown) return;

    const point = evt instanceof MouseEvent ? evt : evt.touches[0];
    const deltaX = point.pageX - this.startX;
    const deltaY = point.pageY - this.startY;

    if (this.directionLocked === null) {
      if (Math.abs(deltaX) > this.threshold || Math.abs(deltaY) > this.threshold) {
        this.directionLocked = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      }
    }

    if (this.directionLocked === 'horizontal') {
      evt.preventDefault();
      this.slider.nativeElement.scrollLeft = this.scrollLeftStart - deltaX;
    }
  }

  dragEnd() {
    this.isDown = false;
    this.directionLocked = null;
    this.slider.nativeElement.classList.remove('active');
  }

  trackById(index: number, item: any): any {
    return item.id ?? index;
  }
}
