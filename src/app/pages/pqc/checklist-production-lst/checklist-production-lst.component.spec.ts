import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistProductionLstComponent } from './checklist-production-lst.component';

describe('ChecklistProductionLstComponent', () => {
  let component: ChecklistProductionLstComponent;
  let fixture: ComponentFixture<ChecklistProductionLstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistProductionLstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistProductionLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
