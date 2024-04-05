import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NvlProductionLstComponent } from './nvl-production-lst.component';

describe('NvlProductionLstComponent', () => {
  let component: NvlProductionLstComponent;
  let fixture: ComponentFixture<NvlProductionLstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NvlProductionLstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NvlProductionLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
