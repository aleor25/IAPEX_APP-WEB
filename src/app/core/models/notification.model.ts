import { Institution } from './institution.model';
import { ContactRequest } from './contact-request.model';
import { User } from './user.model';

// export interface Notification {
//   id: number;
//   subject: string;
//   body: string;
//   sendDate: string;
//   attendDateTime?: string;
//   attended: boolean;
//   attendedBy?: User;
//   contactRequest: ContactRequest;
//   institution: Institution;
// }

export interface Notification {
    id: number;
    contactRequestId: number;
    subject: string;
    body: string;
    sendDate: string;
    attendDateTime?: string;
    attendingUser?: string;
  }  