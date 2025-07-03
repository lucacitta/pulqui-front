import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModalFechasComponent } from './product-modal-fechas.component';

describe('ProductModalFechasComponent', () => {
  let component: ProductModalFechasComponent;
  let fixture: ComponentFixture<ProductModalFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductModalFechasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductModalFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
