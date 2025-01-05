export interface Role {
    role: RoleName;
  }
  
  export enum RoleName {
    USER_WEB = 'USER_WEB',
    USER_MOBILE = 'USER_MOBILE',
    SUPER_ADMIN = 'SUPER_ADMIN',
  }