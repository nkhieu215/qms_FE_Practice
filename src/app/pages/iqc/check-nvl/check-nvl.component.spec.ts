import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckNvlComponent } from './check-nvl.component';

describe('CheckNvlComponent', () => {
  let component: CheckNvlComponent;
  let fixture: ComponentFixture<CheckNvlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckNvlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckNvlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
