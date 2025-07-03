import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionPagoComponent } from './accion-pago.component';

describe('AccionPagoComponent', () => {
  let component: AccionPagoComponent;
  let fixture: ComponentFixture<AccionPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccionPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
