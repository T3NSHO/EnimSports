export interface User {
  id: string; // Required by NextAuth
  full_name: string;
  email: string;
  role: string; // User's role
  team?: string;
  school?: string;
  phone_number?: string;
  status: 'active' | 'inactive';
}
