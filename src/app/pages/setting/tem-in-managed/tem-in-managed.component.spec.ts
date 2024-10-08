import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemInManagedComponent } from './tem-in-managed.component';

describe('TemInManagedComponent', () => {
  let component: TemInManagedComponent;
  let fixture: ComponentFixture<TemInManagedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemInManagedComponent]
    });
    fixture = TestBed.createComponent(TemInManagedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
