import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingCriticalComponent } from './testing-critical.component';

describe('TestingCriticalComponent', () => {
  let component: TestingCriticalComponent;
  let fixture: ComponentFixture<TestingCriticalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestingCriticalComponent]
    });
    fixture = TestBed.createComponent(TestingCriticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
