export interface AuthResponse {
    token: string;
    authorities: Array<{ authority: string }>;
}

export interface AuthUser {
    token: string;
    role: string;
    expiresAt: number;
}
