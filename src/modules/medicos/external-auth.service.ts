import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

interface AuthResponse {
  accessToken?: string;
  token?: string;
  expiresIn?: number;
}

@Injectable()
export class ExternalAuthService {
  private readonly logger = new Logger(ExternalAuthService.name);
  private readonly http: AxiosInstance;
  private readonly authUrl: string;
  private cachedToken: string | null = null;
  private tokenExpiryEpochMs: number | null = null;

  constructor(private readonly config: ConfigService) {
    this.authUrl = this.config.get<string>('EXTERNAL_AUTH_URL') ?? '';
    this.http = axios.create({ timeout: 10000 });
  }

  private isTokenValid(): boolean {
    if (!this.cachedToken || !this.tokenExpiryEpochMs) return false;
    return Date.now() < this.tokenExpiryEpochMs - 60_000; // refresh 1min antes
  }

  async getToken(): Promise<string> {
    if (this.isTokenValid()) return this.cachedToken as string;

    const username = this.config.get<string>('EXTERNAL_AUTH_USERNAME') ?? '';
    const password = this.config.get<string>('EXTERNAL_AUTH_PASSWORD') ?? '';

    // Muchos backends esperan x-www-form-urlencoded con campos capitalizados
    const form = new URLSearchParams();
    form.set('Username', username);
    form.set('Password', password);

    const response = await this.http.post<AuthResponse>(this.authUrl, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const body: {
      access_token?: string;
      accessToken?: string;
      token?: string;
      expires_in?: number;
      expiresIn?: number;
    } = response.data as unknown as {
      access_token?: string;
      accessToken?: string;
      token?: string;
      expires_in?: number;
      expiresIn?: number;
    };

    const token = body.access_token || body.accessToken || body.token;
    if (!token) {
      throw new Error('Respuesta de autenticación sin token');
    }
    this.cachedToken = token;
    const expiresInSec = body.expires_in ?? body.expiresIn ?? 3600;
    this.tokenExpiryEpochMs = Date.now() + expiresInSec * 1000;
    this.logger.log('Token externo obtenido y cacheado.');
    return token;
  }
}
