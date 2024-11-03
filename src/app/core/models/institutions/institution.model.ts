export interface Institution {
    id: number;
    name: string;
    type: string;
    direction: {
      state: string;
      city: string;
      postalCode: string;
      neighborhood: string;
      street: string;
      number: string;
    };
    openingHours: string;
    emails: string;        
    phoneNumbers: string;  
    websites: string;      
    registrationDateTime: Date;
    image: string;
    imageUrl: string;
    mapUrl: string;
    verificationKey: string;
    active: boolean;
  }

  