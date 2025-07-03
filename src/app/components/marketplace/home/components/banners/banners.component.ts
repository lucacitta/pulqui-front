import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HammerModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  signal,
  inject,
} from '@angular/core';
import { RegisterComponent } from '../../../../auth/register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, HammerModule, RouterModule],
})
export class BannersComponent implements OnInit, OnDestroy {
  @Output() login = new EventEmitter<boolean>();
  isLogged = signal(false);
  readonly dialog = inject(MatDialog);
  private authService = inject(AuthenticationService);

  public banners = [
    {
      id: 1,
      titulo: 'Banner 1',
      urlImagen:
        '../../../../../../assets/images/banner/home-banner-desk-1.webp',
      urlImagenMobile:
        '../../../../../../assets/images/banner/home-banner-mobile-1.webp',
    },
    {
      id: 2,
      titulo: 'Banner 2',
      urlImagen:
        '../../../../../../assets/images/banner/home-banner-desk-2.webp',
      urlImagenMobile:
        '../../../../../../assets/images/banner/home-banner-mobile-2.webp',
      path: '/marketplace/products',
      query: { stores: 6 },
    },
    {
      id: 3,
      titulo: 'Banner 3',
      urlImagen:
        '../../../../../../assets/images/banner/home-banner-desk-3.webp',
      urlImagenMobile:
        '../../../../../../assets/images/banner/home-banner-mobile-3.webp',
      path: '/marketplace/products',
      query: { category: 8 }
    },
  ];

  public currentIndex = 0;
  public isMobile = false;
  private intervalId!: number;

  get visibleBanners() {
    return this.isLogged()
      ? this.banners.filter((b) => b.id !== 1)
      : this.banners;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isLogged.set(!!user);
      this.currentIndex = 0;
    });

    this.checkIfMobile();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  startAutoSlide(): void {
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
    }, 8000);
  }

  stopAutoSlide(): void {
    clearInterval(this.intervalId);
  }

  nextSlide(): void {
    const len = this.visibleBanners.length;
    this.currentIndex = (this.currentIndex + 1) % len;
  }

  prevSlide(): void {
    const len = this.visibleBanners.length;
    this.currentIndex = (this.currentIndex - 1 + len) % len;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  initLogin($event: any) {
    this.dialog.open(RegisterComponent, {
      width: '25rem',
      data: { login: $event },
    });
  }
}
