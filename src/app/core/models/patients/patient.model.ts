// models/patient.model.ts
export interface Patient {
    name: string;
    lastName: string;
    secondLastName: string;
    gender: string;
    approximateAge: number;
    registrationDateTime: Date;
    active: boolean;
    skinColor: string;
    hair: string;
    complexion: string;
    eyeColor: string;
    approximateHeight: string;
    medicalConditions: string;
    distinctiveFeatures: string;
    institution: string;
    imageFile: File;
    additionalNotes: string;
}
