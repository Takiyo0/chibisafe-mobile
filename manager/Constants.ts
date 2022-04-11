export interface MiniFile {
    id: number;
    name: string;
    url: string;
    thumb: string;
    thumbSquare: string;
}

export interface Album {
    id: number;
    name: string;
    nsfw: boolean;
    createdAt: number;
    editedAt: number;
    fileCount: number;
    files: MiniFile[];
}

export interface AlbumResponse {
    message?: string;
    albums?: Album[];
}


export interface User {
    id: number;
    username: string;
    isAdmin: boolean;
    apiKey: string;
}

export interface File {
    id: number;
    userId: number;
    name: string;
    original: string;
    type: string;
    size: number;
    hash: string;
    ip: string;
    createdAt: number;
    editedAt: number;
    url: string;
    thumb: string;
    thumbSquare: string;
}

export interface UserResponse {
    message?: string;
    user?: User;
}

export interface FilesResponse {
    message?: string;
    files?: File[];
    count?: number;
}

export interface VersionResponse {
    version?: string;
}

export interface LoginResponse {
    message?: string,
    user?: User,
    token?: string,
    apiKey?: string
}

export interface ChangePasswordData {
    oldPassword: string;
    newPassword: string;
    giveError: Function;
}

export interface ChangePasswordResponse {
    message?: string
}