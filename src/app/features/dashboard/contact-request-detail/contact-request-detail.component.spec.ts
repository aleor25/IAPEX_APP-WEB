import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRequestDetailComponent } from './contact-request-detail.component';

describe('ContactRequestDetailComponent', () => {
  let component: ContactRequestDetailComponent;
  let fixture: ComponentFixture<ContactRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactRequestDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
