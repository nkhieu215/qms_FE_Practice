import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingCriticalGroupComponent } from './testing-critical-group.component';

describe('TestingCriticalGroupComponent', () => {
  let component: TestingCriticalGroupComponent;
  let fixture: ComponentFixture<TestingCriticalGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestingCriticalGroupComponent]
    });
    fixture = TestBed.createComponent(TestingCriticalGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
