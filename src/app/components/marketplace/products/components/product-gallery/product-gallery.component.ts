import { Component, OnInit, Input, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Image {
  url_imagen: string;
}

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss'],
})
export class ProductGalleryComponent implements OnInit {
  @Input() images: Image[] = [];
  @Input() image: string = '';
  selectImage = 0;
  isMobile$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    // Detectar si el tamaño de pantalla es móvil
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(
      map(result => result.matches)
    );
  }

  ngOnInit(): void {
    //image comes from external variable
    // if (this.images && this.images.length > 0) {
    //   this.image = this.images[0].url_imagen;
    // }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.zoom(event);
  }

  zoom(event: MouseEvent): void {
    // Implementa la lógica de zoom aquí
  }

  leave(event: MouseEvent): void {
    const zoomer = event.currentTarget as HTMLElement;
    zoomer.classList.add('gallery__multiple__image__img__figure--inactive');
  }

  // Cambiar imagen con swipe
  onSwipe(event: any) {
    this.isMobile$.subscribe(isMobile => {
      if (isMobile) {
        if (event.direction === 2) { // Swipe izquierda
          this.nextImage();
        } else if (event.direction === 4) { // Swipe derecha
          this.previousImage();
        }
      }
    });
  }

  nextImage() {
    if (this.selectImage < this.images.length - 1) {
      this.selectImage++;
    } else {
      this.selectImage = 0; // Volver al inicio
    }
  }

  previousImage() {
    if (this.selectImage > 0) {
      this.selectImage--;
    } else {
      this.selectImage = this.images.length - 1; // Ir al final
    }
  }

  // Cambiar la imagen seleccionada directamente
  changeImage(index: number): void {
    this.selectImage = index;
  }
}
