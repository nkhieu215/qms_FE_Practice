import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityEvaluationComponent } from './quality-evaluation.component';

describe('QualityEvaluationComponent', () => {
  let component: QualityEvaluationComponent;
  let fixture: ComponentFixture<QualityEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
