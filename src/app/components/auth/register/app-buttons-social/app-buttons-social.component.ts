import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-buttons-social',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './app-buttons-social.component.html',
  styleUrl: './app-buttons-social.component.scss'
})
export class AppButtonsSocialComponent {
  @Output() clickSocialEvent = new EventEmitter<string>();


  clickSocial(social:string){
    this.clickSocialEvent.emit(social);
  }
}
