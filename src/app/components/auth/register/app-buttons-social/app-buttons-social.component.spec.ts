import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppButtonsSocialComponent } from './app-buttons-social.component';

describe('AppButtonsSocialComponent', () => {
  let component: AppButtonsSocialComponent;
  let fixture: ComponentFixture<AppButtonsSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppButtonsSocialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppButtonsSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
