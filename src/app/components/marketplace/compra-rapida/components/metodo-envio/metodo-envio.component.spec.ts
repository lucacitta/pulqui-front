import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoEnvioComponent } from './metodo-envio.component';

describe('MetodoEnvioComponent', () => {
  let component: MetodoEnvioComponent;
  let fixture: ComponentFixture<MetodoEnvioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetodoEnvioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetodoEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
