import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorEditComponent } from './error-edit.component';

describe('ErrorEditComponent', () => {
  let component: ErrorEditComponent;
  let fixture: ComponentFixture<ErrorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
