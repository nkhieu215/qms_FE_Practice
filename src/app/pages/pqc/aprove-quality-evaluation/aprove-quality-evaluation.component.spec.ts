import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AproveQualityEvaluationComponent } from './aprove-quality-evaluation.component';

describe('AproveQualityEvaluationComponent', () => {
  let component: AproveQualityEvaluationComponent;
  let fixture: ComponentFixture<AproveQualityEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AproveQualityEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AproveQualityEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
