export const LEAVE_TYPES = {
  annual: 'Annual Leave',
  sick: 'Sick Leave',
  emergency: 'Emergency Leave',
  unpaid: 'Unpaid Leave',
  maternity: 'Maternity Leave',
  paternity: 'Paternity Leave',
  pilgrimage: 'Pilgrimage Leave',
} as const;

export const LEAVE_STATUS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
} as const;

export const USER_ROLES = {
  employee: 'Employee',
  manager: 'Manager',
  hr: 'HR',
  admin: 'Administrator',
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
] as const;

