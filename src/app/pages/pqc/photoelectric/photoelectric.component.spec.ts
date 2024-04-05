import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoelectricComponent } from './photoelectric.component';

describe('PhotoelectricComponent', () => {
  let component: PhotoelectricComponent;
  let fixture: ComponentFixture<PhotoelectricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoelectricComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoelectricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
