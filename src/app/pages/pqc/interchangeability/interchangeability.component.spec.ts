import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterchangeabilityComponent } from './interchangeability.component';

describe('InterchangeabilityComponent', () => {
  let component: InterchangeabilityComponent;
  let fixture: ComponentFixture<InterchangeabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterchangeabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterchangeabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
