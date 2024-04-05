import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLineEditComponent } from './production-line-edit.component';

describe('ProductionLineEditComponent', () => {
  let component: ProductionLineEditComponent;
  let fixture: ComponentFixture<ProductionLineEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionLineEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionLineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
