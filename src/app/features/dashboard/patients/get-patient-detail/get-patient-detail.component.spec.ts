import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPatientDetailComponent } from './get-patient-detail.component';

describe('GetPatientDetailComponent', () => {
  let component: GetPatientDetailComponent;
  let fixture: ComponentFixture<GetPatientDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetPatientDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetPatientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
