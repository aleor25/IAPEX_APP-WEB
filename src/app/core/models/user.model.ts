export interface User {
  id?: number;
  name: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  position: string;
  institution: string;
  accountVerified?: boolean;
}