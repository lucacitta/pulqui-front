import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgIf, NgFor, MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides: Slide[] = [];
  currentIndex = 0;
  autoSlideInterval: any;
  isMobile: boolean = false;

  ngOnInit() {
    this.startAutoSlide();
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  @HostListener('swipeleft', ['$event'])
  onSwipeLeft(event: any) {
    if (this.isMobile) {
      this.nextSlide();
    }
  }

  @HostListener('swiperight', ['$event'])
  onSwipeRight(event: any) {
    if (this.isMobile) {
      this.prevSlide();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = window.innerWidth <= 768;
  }
}
