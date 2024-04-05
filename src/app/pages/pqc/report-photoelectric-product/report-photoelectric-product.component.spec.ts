import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPhotoelectricProductComponent } from './report-photoelectric-product.component';

describe('ReportPhotoelectricProductComponent', () => {
  let component: ReportPhotoelectricProductComponent;
  let fixture: ComponentFixture<ReportPhotoelectricProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPhotoelectricProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPhotoelectricProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
