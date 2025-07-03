import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../components/auth/register/register.component';
import { VerticalHeaderAccountComponent } from './vertical-header-account/vertical-header-account.component';
import { FooterComponent } from './footer/footer.component';
import { debounceTime, filter, fromEvent, Subject, take, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SearchService } from '../components/marketplace/search/search.service';
import { CarouselComponent } from './carousel/carousel.component';

import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    VerticalHeaderAccountComponent,
    FooterComponent,
    CommonModule,
    CarouselComponent,
    HeaderComponent,
  ],
  templateUrl: './layout.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @ViewChild('productSearchInput')
  productSearchInput!: ElementRef<HTMLInputElement>;

  effectSearch = effect((): any => {
    this.searchSubject.next({ search: this.query() });
  });

  constructor(private router: Router, private searchService: SearchService) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((subject) => {
      if (this.query().length <= 2) return;
      console.log('Busqueda', subject);
      this.searchService.search(subject.search);
      this.router.navigate(['marketplace/search']);
    });
  }

  readonly dialog = inject(MatDialog);
  showSearch = signal(false);
  query = signal<String>('');
  private searchSubject: Subject<any> = new Subject<any>();

  slides = [
    {
      image: '../../../assets/images/background/slide-1.jpg',
      title: 'Título 1',
      subtitle: 'Subtítulo 1',
      buttonText: 'REGISTRATE 1',
    },
    {
      image: '../../../assets/images/background/slide-1.jpg',
      title: 'Título 2',
      subtitle: 'Subtítulo 2',
      buttonText: 'REGISTRATE 2',
    },
    {
      image: '../../../assets/images/background/slide-1.jpg',
      title: 'Título 3',
      subtitle: 'Subtítulo 3',
      buttonText: 'REGISTRATE 3',
    },
  ];

  initLogin($event: any) {
    console.log('initLogin', $event);
    this.dialog.open(RegisterComponent, {
      width: '25rem',
      data: {
        login: $event,
      },
    });
  }

  goMarketplace() {
    console.log('goMarketplace');
    this.query.set('');
    this.showSearch.set(false);
    this.router.navigate(['/marketplace/home']);
  }

  search(word: string) {
    if (word !== '') {
      return this.query.set(word);
    }
    return this.goMarketplace();
  }

  showInputSearch() {
    this.showSearch.update((before) => !before);

    if (this.showSearch()) {
      timer(50).subscribe(() => {
        this.productSearchInput.nativeElement.focus();
      });
    }
  }

  ngOnDestroy(): void {
    this.effectSearch.destroy();
  }
}
