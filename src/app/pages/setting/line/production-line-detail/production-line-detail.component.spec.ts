import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLineDetailComponent } from './production-line-detail.component';

describe('ProductionLineDetailComponent', () => {
  let component: ProductionLineDetailComponent;
  let fixture: ComponentFixture<ProductionLineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionLineDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionLineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
