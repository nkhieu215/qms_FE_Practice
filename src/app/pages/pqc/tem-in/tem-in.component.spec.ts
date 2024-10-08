import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemInComponent } from './tem-in.component';

describe('TemInComponent', () => {
  let component: TemInComponent;
  let fixture: ComponentFixture<TemInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemInComponent]
    });
    fixture = TestBed.createComponent(TemInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
