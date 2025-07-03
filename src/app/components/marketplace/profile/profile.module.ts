import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import profileRoutes from './profile.routes';
import { NavProfileComponent } from './nav-profile/nav-profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { InformationProfileComponent } from './information-profile/information-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ResidenceComponent } from './residence/residence.component';
import { InformationSellerComponent } from './information-seller/information-seller.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    NavProfileComponent,
    InformationProfileComponent,
    ResidenceComponent,
    InformationSellerComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    RouterModule.forChild(profileRoutes),
  ],
})
export class ProfileModule { }
