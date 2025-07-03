import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoCalificacionComponent } from './producto-calificacion.component';

describe('ProductoCalificacionComponent', () => {
  let component: ProductoCalificacionComponent;
  let fixture: ComponentFixture<ProductoCalificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoCalificacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
