import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSuccessComponent } from './button-success.component';

describe('ButtonSuccessComponent', () => {
  let component: ButtonSuccessComponent;
  let fixture: ComponentFixture<ButtonSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
