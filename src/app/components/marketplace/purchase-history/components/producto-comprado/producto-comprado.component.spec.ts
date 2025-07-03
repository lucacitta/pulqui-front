import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoCompradoComponent } from './producto-comprado.component';

describe('ProductoCompradoComponent', () => {
  let component: ProductoCompradoComponent;
  let fixture: ComponentFixture<ProductoCompradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoCompradoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoCompradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
