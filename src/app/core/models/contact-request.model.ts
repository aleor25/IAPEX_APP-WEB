export interface ContactRequest {
    id?: number;
    interestedPersonName: string;
    attendingUser?: string;
    missingPersonName: string;
    patient: number;
    phoneNumber: string;
    email: string;
    relationship: string;
    requestDateTime: Date;
    message: string;
    status: string;
}