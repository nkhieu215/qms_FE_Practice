import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLineAddComponent } from './production-line-add.component';

describe('ProductionLineAddComponent', () => {
  let component: ProductionLineAddComponent;
  let fixture: ComponentFixture<ProductionLineAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionLineAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionLineAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
