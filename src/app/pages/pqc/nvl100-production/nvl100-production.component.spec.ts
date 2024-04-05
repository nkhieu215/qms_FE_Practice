import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nvl100ProductionComponent } from './nvl100-production.component';

describe('Nvl100ProductionComponent', () => {
  let component: Nvl100ProductionComponent;
  let fixture: ComponentFixture<Nvl100ProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Nvl100ProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Nvl100ProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
