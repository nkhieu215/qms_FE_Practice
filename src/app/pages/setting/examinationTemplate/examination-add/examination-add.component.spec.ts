import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationAddComponent } from './examination-add.component';

describe('ExaminationAddComponent', () => {
  let component: ExaminationAddComponent;
  let fixture: ComponentFixture<ExaminationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
