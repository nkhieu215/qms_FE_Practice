import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineAddComponent } from './machine-add.component';

describe('MachineAddComponent', () => {
  let component: MachineAddComponent;
  let fixture: ComponentFixture<MachineAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
