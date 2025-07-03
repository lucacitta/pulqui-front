import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostSelledProductsComponent } from './most-selled-products.component';

describe('MostSelledProductsComponent', () => {
  let component: MostSelledProductsComponent;
  let fixture: ComponentFixture<MostSelledProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostSelledProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostSelledProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
