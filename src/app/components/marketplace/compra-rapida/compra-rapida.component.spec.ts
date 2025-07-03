import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraRapidaComponent } from './compra-rapida.component';

describe('CompraRapidaComponent', () => {
  let component: CompraRapidaComponent;
  let fixture: ComponentFixture<CompraRapidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraRapidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraRapidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
