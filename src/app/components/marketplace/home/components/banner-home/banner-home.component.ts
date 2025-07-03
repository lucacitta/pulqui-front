import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-home.component.html',
  styleUrl: './banner-home.component.scss'
})
export class BannerHomeComponent {
  @Input() position: 'header' | 'footer' = 'header';
}
