

import type { User } from '../types';
import type { TranslationKeys } from '../contexts/I18nContext';

const SESSION_KEY = 'session';

export type AuthResult = { 
  success: boolean, 
  messageKey: TranslationKeys, 
  user?: User | null,
  verificationCode?: string 
};

type Session = {
    user: User;
    token: string;
}

const API_BASE_URL = '/api/auth';

class AuthService {
  private session: Session | null = null;

  constructor() {
    const storedSession = localStorage.getItem(SESSION_KEY);
    this.session = storedSession ? JSON.parse(storedSession) : null;
  }
  
  async register(email: string, password: string): Promise<Omit<AuthResult, 'user'>> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, messageKey: data.messageKey || 'server.error.generic' };
      }
      return { success: true, messageKey: data.messageKey, verificationCode: data.verificationCode };
    } catch (error) {
      return { success: false, messageKey: 'server.error.network' };
    }
  }
  
  async verify(email: string, code: string): Promise<Omit<AuthResult, 'user'>> {
    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
       if (!response.ok) {
        return { success: false, messageKey: data.messageKey || 'server.error.generic' };
      }
      return { success: true, messageKey: 'auth.success.verify' };
    } catch (error) {
       return { success: false, messageKey: 'server.error.network' };
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, messageKey: data.messageKey || 'server.error.generic' };
      }
      
      const { user, token } = data;
      this.session = { user, token };
      localStorage.setItem(SESSION_KEY, JSON.stringify(this.session));
      
      return { success: true, messageKey: 'auth.success.login', user };
    } catch (error) {
      return { success: false, messageKey: 'server.error.network' };
    }
  }
  
  logout(): void {
    this.session = null;
    localStorage.removeItem(SESSION_KEY);
  }
  
  getCurrentUser(): User | null {
    return this.session?.user || null;
  }

  getAuthHeaders(): Record<string, string> {
      if (this.session?.token) {
          return { 'Authorization': `Bearer ${this.session.token}` };
      }
      return {};
  }
}

export const authService = new AuthService();
