import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqcShowListComponent } from './pqc-show-list.component';

describe('PqcShowListComponent', () => {
  let component: PqcShowListComponent;
  let fixture: ComponentFixture<PqcShowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PqcShowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PqcShowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
