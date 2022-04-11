import Axios, { Method } from "axios";
import { AlbumResponse, VersionResponse, LoginResponse, UserResponse, FilesResponse, ChangePasswordResponse } from "./Constants";
import { ImagePickerResult } from "expo-image-picker";
import { decode as atob } from 'base-64';

export default class RequestManager {
    token: string;
    baseUrl: string;
    constructor(token: string, baseUrl: string) {
        this.token = token;
        this.baseUrl = baseUrl;
    }

    // copyright https://github.com/WeebDev/chibisafe-extension/blob/d148f4844c0ad743b83767a37d68cd51cd9a8d81/src/js/background.js#L63
    static versionCompare(a: string, b: string): boolean {
        const pa = a.split('.');
        const pb = b.split('.');
        for (let i = 0; i < 3; i++) {
            const na = Number(pa[i]);
            const nb = Number(pb[i]);
            if (na > nb) return true;
            if (nb > na) return false;
            if (!isNaN(na) && isNaN(nb)) return true;
            if (isNaN(na) && !isNaN(nb)) return false;
        }
        return true;
    }

    getVersion(): Promise<VersionResponse> {
        return this.request('GET', '/api/version').catch(_ => null);
    }

    async validate(baseUrl: string): Promise<boolean> {
        this.baseUrl = baseUrl
        const result = await this.getVersion().catch(_ => null);
        if (!result || !result.version || !RequestManager.versionCompare(result.version, '4.0.0')) return false;
        return true;
    }

    async checkValid(): Promise<boolean> {
        if (!this.token) return false;
        const result = await this.request('GET', '/api/verify');
        if (!result || !result.message || result.message !== "Successfully verified token" || !result.user) return false;

        return true;
    }

    async login(baseUrl: string, username: string, password: string): Promise<{ error: boolean, message: string, data: LoginResponse }> {
        this.baseUrl = baseUrl;
        const result = await this.request('POST', '/api/auth/login', { username, password }, { "accept": "application/vnd.chibisafe.json, application/vnd.chibisafe.json" });
        if (!result || !result.message || !result.user || !result.token) return { error: true, message: 'Invalid credentials.', data: {} };
        if (result.message !== "Successfully logged in.") return { error: true, message: result.message, data: {} };
        this.token = result.token;
        return { error: false, message: result.message, data: result };
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<{ error: boolean, data: ChangePasswordResponse }> {
        const result = await this.request('POST', '/api/user/password/change', { password: oldPassword, newPassword }).catch(_ => false);
        if (!result || result === null || !result.message || result.message !== "The password was changed successfully") return { error: true, data: { message: result.message ? result.message : "Unknown error." } };
        return { error: false, data: result };
    }

    async getUser(): Promise<{ error: boolean, message: string, data: UserResponse }> {
        const result = await this.request('GET', '/api/users/me');
        if (!result || !result.message || result.message !== "Successfully retrieved user" || !result.user) return { error: true, message: 'Invalid credentials.', data: {} };
        return { error: false, message: result.message, data: result };
    }

    static randomId(length: number = 10): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async uploadFile(file: ImagePickerResult, blob: Blob): Promise<{ error: boolean, message: string, data: any }> {
        if (file.cancelled) return { error: true, message: 'File upload cancelled.', data: {} };

        const formData = new FormData();
        // @ts-ignore
        formData.append('files[]', blob, `upload.png`);

        console.log(JSON.stringify(formData));
        // const formData = new FormData();
        // formData.append('file', JSON.parse(JSON.stringify({ uri: file.uri, type: `${file.type}/${file.uri.match(/\.[0-9a-z]+$/i)![0].replace(/./gi, "")}`, name: file.uri.split('/').pop() })));

        // return { error: true, message: 'File upload cancelled.', data: formData };

        const data = await fetch(this.baseUrl + "/api/upload", {
            method: 'POST',
            headers: {
                "content-type": "multipart/form-data",
            },
            body: formData
        }).then(x => x.json()).catch(_ => {
            return { error: true, message: 'File upload cancelled.', data: {} };
        });
        // const data = await this.request("POST", `/api/upload`, formData).catch(_ => { console.log(_.response); return _ });
        if (!data || !data.message || data.message !== "Successfully uploaded file") return { error: true, message: data.message ? data.message : "Unknown error.", data: {} };
        return { error: false, message: data.message, data };
    }

    async getFiles(all: boolean, limit?: number, page?: number): Promise<{ error: boolean, message: string, data: FilesResponse }> {
        const result = all ? await this.request('GET', '/api/files') : await this.request('GET', `/api/files?limit=${limit}&page=${page}`);
        if (!result || !result.message || result.message !== "Successfully retrieved files" || !result.files) return { error: true, message: 'Invalid credentials.', data: {} };
        return { error: false, message: result.message, data: result };
    }

    async getAlbums(): Promise<{ error: boolean, message: string, data: AlbumResponse }> {
        const result = await this.request("GET", '/api/albums/mini');
        if (!result || !result.message || result.message !== "Successfully retrieved albums" || !result.albums) return { error: true, message: 'Invalid credentials.', data: {} };
        return { error: false, message: result.message, data: result };
    }

    request(method: Method, url: string, data?: any, headers?: any): Promise<any> {
        console.log(method, this.baseUrl + url)
        return Axios({
            method,
            url: this.baseUrl + url,
            data,
            headers: headers ? headers : {
                'Content-Type': 'application/json',
                'accept': 'application/vnd.chibisafe.json, application/vnd.chibisafe.json',
                'Authorization': `Bearer ${this.token}`
            }
        }).then(response => { return response.data }).catch(error => {
            console.log(error.response);
            return error.response ? error.response.data : error;
        });
    }

    static b64toBlob(b64Data: string, contentType: string, sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
}

// request(method: string, url: string, params?: Object, headers?: HeadersInit): Promise<any> {
//     headers = headers ? headers : {
//         'Content-Type': 'application/json',
//         'accept': 'application/vnd.chibisafe.json, application/vnd.chibisafe.json',
//         'Authorization': `Bearer ${this.token}`
//     };

//     const options = {
//         method,
//         headers,
//         body: params ? JSON.stringify(params) : undefined
//     };

//     console.log(`${this.baseUrl}${url}`, options)
//     return fetch(`${this.baseUrl}${url}`, options)
//         .then(response => response.json());
// }
