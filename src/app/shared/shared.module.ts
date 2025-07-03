import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxStarsModule } from 'ngx-stars';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ShoppingCartService } from './services/shopping-cart/shopping-cart.service';
import { BussinessStore } from './store/bussiness-store';
import { MatTabsModule } from '@angular/material/tabs';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { DialogArchivosComponent } from './components/dialog-archivos/dialog-archivos.component';
import { ActualizarDocumentacionComponent } from './components/actualizar-documentacion/actualizar-documentacion.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SubirDocumentosComponent } from './components/subir-documentos/subir-documentos.component';
import { ValidationDirective } from './directives/validation.directive';
@NgModule({
  declarations: [
    CustomToastComponent,
    ConfirmationDialogComponent,
    DialogArchivosComponent,
    ActualizarDocumentacionComponent,
    SubirDocumentosComponent,
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    ValidationDirective
  ],
  exports: [
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxStarsModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    ConfirmationDialogComponent,
    MatCheckboxModule,
    FormsModule,
    MatSelectModule,
    MatListModule,
    MatProgressBarModule,
    MatTableModule,
    MatRadioModule,
    ActualizarDocumentacionComponent,
    MatDatepickerModule,
    MatIconModule,
    ValidationDirective
  ],
  providers: [ShoppingCartService, BussinessStore],
})
export class SharedModule {}
