import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixErrorComponent } from './fix-error.component';

describe('FixErrorComponent', () => {
  let component: FixErrorComponent;
  let fixture: ComponentFixture<FixErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
