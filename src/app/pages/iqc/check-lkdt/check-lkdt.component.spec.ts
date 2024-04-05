import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckLkdtComponent } from './check-lkdt.component';

describe('CheckLkdtComponent', () => {
  let component: CheckLkdtComponent;
  let fixture: ComponentFixture<CheckLkdtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckLkdtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckLkdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
