import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestorePassword2Component } from './restore-password-2.component';

describe('RestorePassword2Component', () => {
  let component: RestorePassword2Component;
  let fixture: ComponentFixture<RestorePassword2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestorePassword2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestorePassword2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
