import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorAddComponent } from './error-add.component';

describe('ErrorAddComponent', () => {
  let component: ErrorAddComponent;
  let fixture: ComponentFixture<ErrorAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
