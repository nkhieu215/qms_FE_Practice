import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoelectricProductComponent } from './photoelectric-product.component';

describe('PhotoelectricProductComponent', () => {
  let component: PhotoelectricProductComponent;
  let fixture: ComponentFixture<PhotoelectricProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoelectricProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoelectricProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
