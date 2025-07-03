import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarDocumentacionComponent } from './actualizar-documentacion.component';

describe('ActualizarDocumentacionComponent', () => {
  let component: ActualizarDocumentacionComponent;
  let fixture: ComponentFixture<ActualizarDocumentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarDocumentacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
