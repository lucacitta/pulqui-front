import { Component, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-pulqui-new';

  constructor(
    private router: Router,
    private renderer: Renderer2
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Verifica si la URL incluye `/marketplace/home`
        const isHomePage = event.urlAfterRedirects === '/marketplace/home';
        const body = document.body;

        if (isHomePage) {
          // Agregar la clase `isHome` si es la página de inicio
          this.renderer.addClass(body, 'isHome');
        } else {
          // Eliminar la clase `isHome` si no es la página de inicio
          this.renderer.removeClass(body, 'isHome');
        }
      }
    });
  }
}
