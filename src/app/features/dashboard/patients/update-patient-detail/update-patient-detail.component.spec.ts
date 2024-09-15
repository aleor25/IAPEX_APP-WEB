import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePatientDetailComponent } from './update-patient-detail.component';

describe('UpdatePatientDetailComponent', () => {
  let component: UpdatePatientDetailComponent;
  let fixture: ComponentFixture<UpdatePatientDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePatientDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePatientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
