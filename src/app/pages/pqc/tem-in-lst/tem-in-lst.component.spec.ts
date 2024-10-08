import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemInLstComponent } from './tem-in-lst.component';

describe('TemInLstComponent', () => {
  let component: TemInLstComponent;
  let fixture: ComponentFixture<TemInLstComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemInLstComponent]
    });
    fixture = TestBed.createComponent(TemInLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
