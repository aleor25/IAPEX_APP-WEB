// src/app/models/user-web-dto.ts
export interface UserWebDTO {
    id?: number;
    name: string;
    lastName: string;
    secondLastName?: string;
    email: string;
    position: string;
    institution: string;
    accountVerified?: boolean;
  }
  