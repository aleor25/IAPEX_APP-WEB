import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteIndividualComponent } from './paciente-individual.component';

describe('PacienteIndividualComponent', () => {
  let component: PacienteIndividualComponent;
  let fixture: ComponentFixture<PacienteIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteIndividualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacienteIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
