import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModalContinueComponent } from './product-modal-continue.component';

describe('ProductModalContinueComponent', () => {
  let component: ProductModalContinueComponent;
  let fixture: ComponentFixture<ProductModalContinueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductModalContinueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductModalContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
