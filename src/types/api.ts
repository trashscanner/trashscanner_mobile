// Auth Types
export interface AuthRequest {
    login?: string;
    password?: string;
}

export interface LoginUserRequest {
    login: string;
    name?: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        login: string;
    };
}

// User Types
export enum UserStatus {
    Newbie = 'newbie',
    EcoScout = 'eco_scout',
    GreenGuard = 'green_guard',
    EcoWarrior = 'eco_warrior',
    NatureHero = 'nature_hero',
    EarthDefender = 'earth_defender',
    EcoChampion = 'eco_champion',
    PlanetGuardian = 'planet_guardian',
    EcoLegend = 'eco_legend',
}

export interface Stat {
    id: string;
    files_scanned: number;
    last_scanned_at: string;
    rating: number;
    status: UserStatus;
    total_weight: number;
    trash_by_types: Record<string, number>;
    created_at: string;
    updated_at: string;
}

export interface UserResponse {
    id: string;
    login: string;
    name: string;
    avatar?: string;
    stat?: Stat;
    created_at: string;
    updated_at: string;
}

// Prediction Types
export enum PredictionStatus {
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed',
}

export type PredictionResult = Record<string, number>;

export interface PredictionResponse {
    id: string;
    user_id: string;
    scan_key: string;
    status: PredictionStatus;
    result?: PredictionResult;
    error?: string;
    created_at: string;
    updated_at: string;
}

// Error Types
export interface ApiError {
    message: string;
    system?: string;
    details?: Record<string, any>;
}
