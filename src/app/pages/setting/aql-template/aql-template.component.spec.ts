import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AqlTemplateComponent } from './aql-template.component';

describe('AqlTemplateComponent', () => {
  let component: AqlTemplateComponent;
  let fixture: ComponentFixture<AqlTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AqlTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AqlTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
