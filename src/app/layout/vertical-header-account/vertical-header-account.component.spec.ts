import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalHeaderAccountComponent } from './vertical-header-account.component';

describe('VerticalHeaderAccountComponent', () => {
  let component: VerticalHeaderAccountComponent;
  let fixture: ComponentFixture<VerticalHeaderAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalHeaderAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalHeaderAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
