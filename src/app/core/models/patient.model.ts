export interface Patient {
    id: number;
    name: string;
    lastName: string;
    secondLastName: string;
    gender: string;
    approximateAge: number;
    registrationDateTime: string;
    registeringUser: number;
    active: boolean;
    skinColor: string;
    hair: string;
    complexion: string;
    eyeColor: string;
    approximateHeight: number;
    medicalConditions?: string;
    distinctiveFeatures?: string;
    institution: string;
    images: Image[];
    additionalNotes?: string;
}

export interface Institution {
    id: number;
    name: string;
}

export interface Image {
    id: number;
    image: string;
    imageUrl: string;
}