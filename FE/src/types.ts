export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface User {
    email: string;
    role: "admin" | "hotel_manager" | "receptionist" | "guest"
    user_id: string
    hotel_id: string | null
}