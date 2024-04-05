import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProduceComponent } from './report-produce.component';

describe('ReportProduceComponent', () => {
  let component: ReportProduceComponent;
  let fixture: ComponentFixture<ReportProduceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportProduceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
