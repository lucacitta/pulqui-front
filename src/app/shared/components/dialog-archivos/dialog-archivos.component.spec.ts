import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogArchivosComponent } from './dialog-archivos.component';

describe('DialogArchivosComponent', () => {
  let component: DialogArchivosComponent;
  let fixture: ComponentFixture<DialogArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogArchivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
