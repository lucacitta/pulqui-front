import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavShareComponent } from './fav-share.component';

describe('FavShareComponent', () => {
  let component: FavShareComponent;
  let fixture: ComponentFixture<FavShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
