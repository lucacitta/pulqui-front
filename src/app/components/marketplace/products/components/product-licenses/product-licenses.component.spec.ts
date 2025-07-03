import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLicensesComponent } from './product-licenses.component';

describe('ProductLicensesComponent', () => {
  let component: ProductLicensesComponent;
  let fixture: ComponentFixture<ProductLicensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLicensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLicensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
