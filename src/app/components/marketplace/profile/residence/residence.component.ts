import { Component, Input, OnInit, signal } from '@angular/core';
import { Address, ProfileModel } from '../profile.types';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-residence',
  templateUrl: './residence.component.html',
  styleUrls: ['./residence.component.scss'],
})
export class ResidenceComponent implements OnInit {
  @Input() user?: ProfileModel;
  address$ = signal<Address[]>([]);

  constructor(private _profileService: ProfileService) {}

  ngOnInit() {
    this._profileService.getAddressByCode().subscribe((res) => {
      this.address$.set(res);    
    });
  }
}
