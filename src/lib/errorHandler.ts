/**
 * Sanitizes database/API error messages to prevent information disclosure.
 * Maps technical error codes to user-friendly Arabic messages.
 */

const ERROR_MAP: Record<string, string> = {
  // PostgreSQL error codes
  '23505': 'هذا العنصر موجود بالفعل',
  '23503': 'لا يمكن حذف هذا العنصر لأنه مرتبط بعناصر أخرى',
  '23502': 'يرجى ملء جميع الحقول المطلوبة',
  '42501': 'ليس لديك صلاحية لهذا الإجراء',
  '42P01': 'حدث خطأ في النظام. يرجى المحاولة لاحقاً',
  'PGRST301': 'ليس لديك صلاحية لهذا الإجراء',
  // Auth errors
  'invalid_credentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  'email_not_confirmed': 'يرجى تأكيد بريدك الإلكتروني أولاً',
  'user_already_exists': 'هذا البريد الإلكتروني مسجل بالفعل',
  'weak_password': 'كلمة المرور ضعيفة، يرجى استخدام كلمة مرور أقوى',
  'over_request_rate_limit': 'تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً',
  'signup_disabled': 'التسجيل غير متاح حالياً',
};

const ERROR_PATTERNS: Array<[RegExp, string]> = [
  [/row-level security/i, 'ليس لديك صلاحية لهذا الإجراء'],
  [/duplicate key/i, 'هذا العنصر موجود بالفعل'],
  [/foreign key/i, 'لا يمكن إتمام هذا الإجراء بسبب ارتباطات موجودة'],
  [/not found/i, 'العنصر المطلوب غير موجود'],
  [/invalid.*email/i, 'يرجى إدخال بريد إلكتروني صحيح'],
  [/invalid.*password/i, 'البريد الإلكتروني أو كلمة المرور غير صحيحة'],
  [/rate limit/i, 'تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً'],
  [/network|fetch|timeout|abort/i, 'حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت'],
];

export function getSafeErrorMessage(error: unknown): string {
  const fallback = 'حدث خطأ في النظام. يرجى المحاولة لاحقاً';

  if (!error) return fallback;

  // Supabase error object with code
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, any>;
    const code = err.code || err.error_code || err.status;
    if (code && ERROR_MAP[String(code)]) {
      return ERROR_MAP[String(code)];
    }

    // Check message against patterns
    const msg = err.message || err.error_description || err.msg || '';
    if (typeof msg === 'string') {
      for (const [pattern, userMsg] of ERROR_PATTERNS) {
        if (pattern.test(msg)) return userMsg;
      }
    }
  }

  // Plain string error
  if (typeof error === 'string') {
    for (const [pattern, userMsg] of ERROR_PATTERNS) {
      if (pattern.test(error)) return userMsg;
    }
  }

  // Error instance
  if (error instanceof Error) {
    for (const [pattern, userMsg] of ERROR_PATTERNS) {
      if (pattern.test(error.message)) return userMsg;
    }
  }

  return fallback;
}
