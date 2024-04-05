import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinCheckComponent } from './tin-check.component';

describe('TinCheckComponent', () => {
  let component: TinCheckComponent;
  let fixture: ComponentFixture<TinCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TinCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TinCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
