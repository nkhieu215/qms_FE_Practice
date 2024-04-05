import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NvlProductionComponent } from './nvl-production.component';

describe('NvlProductionComponent', () => {
  let component: NvlProductionComponent;
  let fixture: ComponentFixture<NvlProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NvlProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NvlProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
