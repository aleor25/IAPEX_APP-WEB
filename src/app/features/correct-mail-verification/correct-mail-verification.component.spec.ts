import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectMailVerificationComponent } from './correct-mail-verification.component';

describe('CorrectMailVerificationComponent', () => {
  let component: CorrectMailVerificationComponent;
  let fixture: ComponentFixture<CorrectMailVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrectMailVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorrectMailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
