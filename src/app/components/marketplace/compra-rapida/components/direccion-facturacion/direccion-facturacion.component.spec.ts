import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionFacturacionComponent } from './direccion-facturacion.component';

describe('DireccionFacturacionComponent', () => {
  let component: DireccionFacturacionComponent;
  let fixture: ComponentFixture<DireccionFacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DireccionFacturacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DireccionFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
