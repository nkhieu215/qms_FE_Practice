import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingProcessComponent } from './setting-process.component';

describe('SettingProcessComponent', () => {
  let component: SettingProcessComponent;
  let fixture: ComponentFixture<SettingProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
