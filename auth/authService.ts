import type { User, UserRole } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

// This is a client-side simulation of an authentication service.
// In a real application, these functions would make API calls to a secure backend.

const USERS_KEY = 'users';
const SESSION_KEY = 'currentUser';
const VERIFICATION_CODE_KEY = 'verificationCode';

// A simple hash function simulation (DO NOT USE IN PRODUCTION)
const pseudoHash = (password: string): string => {
  return `hashed_${password}_${password.split('').reverse().join('')}`;
};

class AuthService {
  private users: User[] = [];
  private currentUser: User | null = null;
  private setUsers: (users: User[]) => void;

  constructor() {
    const storedUsers = localStorage.getItem(USERS_KEY);
    this.users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Create a default admin if none exists
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
  
  register(email: string, password: string): { success: boolean, message: string } {
    if (this.users.find(u => u.email === email)) {
      return { success: false, message: 'کاربری با این ایمیل قبلا ثبت نام کرده است.' };
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: pseudoHash(password),
      role: 'user',
      verified: false,
    };
    
    this.setUsers([...this.users, newUser]);
    
    // Simulate sending a verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`${VERIFICATION_CODE_KEY}_${email}`, code);
    console.log(`Verification code for ${email}: ${code}`); // Log to console for simulation
    
    return { success: true, message: 'ثبت نام موفقیت آمیز بود. لطفا کنسول خود را برای کد تایید بررسی کنید.' };
  }
  
  verify(email: string, code: string): { success: boolean, message: string } {
    const storedCode = localStorage.getItem(`${VERIFICATION_CODE_KEY}_${email}`);
    if (!storedCode || storedCode !== code) {
      return { success: false, message: 'کد تایید نامعتبر است.' };
    }

    const userIndex = this.users.findIndex(u => u.email === email);
    if (userIndex === -1) {
       return { success: false, message: 'کاربر یافت نشد.' };
    }

    const updatedUsers = [...this.users];
    updatedUsers[userIndex].verified = true;
    this.setUsers(updatedUsers);

    localStorage.removeItem(`${VERIFICATION_CODE_KEY}_${email}`);
    
    return { success: true, message: 'حساب کاربری با موفقیت تایید شد. اکنون می‌توانید وارد شوید.' };
  }

  login(email: string, password: string): { success: boolean, message: string, user: User | null } {
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: 'ایمیل یا رمز عبور نامعتبر است.', user: null };
    }
    
    if (!user.verified) {
        return { success: false, message: 'حساب کاربری تایید نشده است. لطفا کنسول خود را برای کد تایید بررسی کنید.', user: null };
    }
    
    if (user.passwordHash !== pseudoHash(password)) {
      return { success: false, message: 'ایمیل یا رمز عبور نامعتبر است.', user: null };
    }
    
    this.currentUser = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    
    return { success: true, message: 'ورود موفقیت آمیز بود.', user };
  }
  
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(SESSION_KEY);
  }
  
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  // Admin functions
  getAllUsers(): User[] {
    return this.users;
  }

  addUser(email: string, password: string, role: UserRole): { success: boolean, message: string } {
    if (this.users.find(u => u.email === email)) {
        return { success: false, message: 'کاربری با این ایمیل قبلا ثبت نام کرده است.' };
    }
     const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: pseudoHash(password),
      role,
      verified: true, // Admins create verified users
    };
    this.setUsers([...this.users, newUser]);
    return { success: true, message: 'کاربر با موفقیت اضافه شد.' };
  }

  updateUser(updatedUser: User): { success: boolean, message: string } {
      const userIndex = this.users.findIndex(u => u.id === updatedUser.id);
      if (userIndex === -1) {
          return { success: false, message: 'کاربر یافت نشد.' };
      }
      const updatedUsers = [...this.users];
      updatedUsers[userIndex] = updatedUser;
      this.setUsers(updatedUsers);
      return { success: true, message: 'کاربر به‌روزرسانی شد.' };
  }
  
  deleteUser(userId: string): { success: boolean, message: string } {
      const updatedUsers = this.users.filter(u => u.id !== userId);
      if (updatedUsers.length === this.users.length) {
           return { success: false, message: 'کاربر یافت نشد.' };
      }
      this.setUsers(updatedUsers);
      return { success: true, message: 'کاربر حذف شد.' };
  }
}

export const authService = new AuthService();
