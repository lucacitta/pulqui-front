import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridProductsComponent } from './grid-products.component';

describe('GridProductsComponent', () => {
  let component: GridProductsComponent;
  let fixture: ComponentFixture<GridProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
