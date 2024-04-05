import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolderCheckComponent } from './solder-check.component';

describe('SolderCheckComponent', () => {
  let component: SolderCheckComponent;
  let fixture: ComponentFixture<SolderCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolderCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolderCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
