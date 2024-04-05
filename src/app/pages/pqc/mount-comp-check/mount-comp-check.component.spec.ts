import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MountCompCheckComponent } from './mount-comp-check.component';

describe('MountCompCheckComponent', () => {
  let component: MountCompCheckComponent;
  let fixture: ComponentFixture<MountCompCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MountCompCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MountCompCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
