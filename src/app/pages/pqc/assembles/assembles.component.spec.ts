import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblesComponent } from './assembles.component';

describe('AssemblesComponent', () => {
  let component: AssemblesComponent;
  let fixture: ComponentFixture<AssemblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssemblesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
