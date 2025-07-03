import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTerminosCondicionesComponent } from './dialog-terminos-condiciones.component';

describe('DialogTerminosCondicionesComponent', () => {
  let component: DialogTerminosCondicionesComponent;
  let fixture: ComponentFixture<DialogTerminosCondicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTerminosCondicionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTerminosCondicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
