import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeOrderCRUDComponent } from './make-order-crud.component';

describe('MakeOrderCRUDComponent', () => {
  let component: MakeOrderCRUDComponent;
  let fixture: ComponentFixture<MakeOrderCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeOrderCRUDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeOrderCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
