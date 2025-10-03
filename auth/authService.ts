import type { User, UserRole, SmtpConfig } from '../types';
// FIX: Import TranslationKeys to provide type safety for auth result messages.
import type { TranslationKeys } from '../contexts/I18nContext';

const USERS_KEY = 'users';
const SESSION_KEY = 'currentUser';
const VERIFICATION_CODE_KEY = 'verificationCode';
const SMTP_CONFIG_KEY = 'smtpConfig';

const pseudoHash = (password: string): string => {
  return `hashed_${password}_${password.split('').reverse().join('')}`;
};

// FIX: Update messageKey to use TranslationKeys type and export AuthResult for use in other components.
export type AuthResult = { 
  success: boolean, 
  messageKey: TranslationKeys, 
  user?: User | null,
  verificationCode?: string 
};

class AuthService {
  private users: User[] = [];
  private currentUser: User | null = null;
  private setUsers: (users: User[]) => void;

  constructor() {
    const storedUsers = localStorage.getItem(USERS_KEY);
    this.users = storedUsers ? JSON.parse(storedUsers) : [];
    
    if (this.users.length === 0) {
        const adminUser: User = {
            id: crypto.randomUUID(),
            email: 'admin@pol.designer',
            passwordHash: pseudoHash('admin123'),
            role: 'admin',
            verified: true,
        };
        this.users.push(adminUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
    }
    
    this.setUsers = (newUsers) => {
        this.users = newUsers;
        localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
    };

    const storedSession = localStorage.getItem(SESSION_KEY);
    this.currentUser = storedSession ? JSON.parse(storedSession) : null;
  }
  
  register(email: string, password: string): Omit<AuthResult, 'user'> {
    if (this.users.find(u => u.email === email)) {
      return { success: false, messageKey: 'auth.error.emailExists' };
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: pseudoHash(password),
      role: 'user',
      verified: false,
    };
    
    this.setUsers([...this.users, newUser]);
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`${VERIFICATION_CODE_KEY}_${email}`, code);

    const smtpConfig = localStorage.getItem(SMTP_CONFIG_KEY);
    if (smtpConfig) {
      // Simulate sending email
      return { success: true, messageKey: 'auth.success.registerSmtp', verificationCode: code };
    } else {
      // Fallback to console log
      console.log(`Verification code for ${email}: ${code}`);
      return { success: true, messageKey: 'auth.success.register' };
    }
  }
  
  verify(email: string, code: string): Omit<AuthResult, 'user'> {
    const storedCode = localStorage.getItem(`${VERIFICATION_CODE_KEY}_${email}`);
    if (!storedCode || storedCode !== code) {
      return { success: false, messageKey: 'auth.error.invalidCode' };
    }

    const userIndex = this.users.findIndex(u => u.email === email);
    if (userIndex === -1) {
       return { success: false, messageKey: 'auth.error.userNotFound' };
    }

    const updatedUsers = [...this.users];
    updatedUsers[userIndex].verified = true;
    this.setUsers(updatedUsers);

    localStorage.removeItem(`${VERIFICATION_CODE_KEY}_${email}`);
    
    return { success: true, messageKey: 'auth.success.verify' };
  }

  login(email: string, password: string): AuthResult {
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, messageKey: 'auth.error.invalidCredentials', user: null };
    }
    
    if (!user.verified) {
        return { success: false, messageKey: 'auth.error.notVerified', user: null };
    }
    
    if (user.passwordHash !== pseudoHash(password)) {
      return { success: false, messageKey: 'auth.error.invalidCredentials', user: null };
    }
    
    this.currentUser = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    
    return { success: true, messageKey: 'auth.success.login', user };
  }
  
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(SESSION_KEY);
  }
  
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  getAllUsers(): User[] {
    return this.users;
  }

  addUser(email: string, password: string, role: UserRole): Omit<AuthResult, 'user'> {
    if (this.users.find(u => u.email === email)) {
        return { success: false, messageKey: 'auth.error.emailExists' };
    }
     const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: pseudoHash(password),
      role,
      verified: true,
    };
    this.setUsers([...this.users, newUser]);
    return { success: true, messageKey: 'auth.success.userAdded' };
  }

  updateUser(updatedUser: User): Omit<AuthResult, 'user'> {
      const userIndex = this.users.findIndex(u => u.id === updatedUser.id);
      if (userIndex === -1) {
          return { success: false, messageKey: 'auth.error.userNotFound' };
      }
      const updatedUsers = [...this.users];
      updatedUsers[userIndex] = updatedUser;
      this.setUsers(updatedUsers);
      return { success: true, messageKey: 'auth.success.userUpdated' };
  }
  
  deleteUser(userId: string): Omit<AuthResult, 'user'> {
      const updatedUsers = this.users.filter(u => u.id !== userId);
      if (updatedUsers.length === this.users.length) {
           return { success: false, messageKey: 'auth.error.userNotFound' };
      }
      this.setUsers(updatedUsers);
      return { success: true, messageKey: 'auth.success.userDeleted' };
  }
}

export const authService = new AuthService();