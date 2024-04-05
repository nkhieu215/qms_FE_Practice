import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nvl100ProductionLstComponent } from './nvl100-production-lst.component';

describe('Nvl100ProductionLstComponent', () => {
  let component: Nvl100ProductionLstComponent;
  let fixture: ComponentFixture<Nvl100ProductionLstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Nvl100ProductionLstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Nvl100ProductionLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
