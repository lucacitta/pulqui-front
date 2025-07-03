import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  screenSize$: Observable<'mobile' | 'tablet' | 'desktop'>;

  constructor(private breakpointObserver: BreakpointObserver) {
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
}
