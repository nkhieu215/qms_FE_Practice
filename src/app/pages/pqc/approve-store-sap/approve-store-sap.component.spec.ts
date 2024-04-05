import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveStoreSapComponent } from './approve-store-sap.component';

describe('ApproveStoreSapComponent', () => {
  let component: ApproveStoreSapComponent;
  let fixture: ComponentFixture<ApproveStoreSapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveStoreSapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveStoreSapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
