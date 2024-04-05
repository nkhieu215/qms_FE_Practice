import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistProductionComponent } from './checklist-production.component';

describe('ChecklistProductionComponent', () => {
  let component: ChecklistProductionComponent;
  let fixture: ComponentFixture<ChecklistProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
