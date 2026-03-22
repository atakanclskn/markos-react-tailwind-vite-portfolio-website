/**
 * Google ile Firebase admin girişinde izin verilen e-postalar.
 * `NEXT_PUBLIC_ADMIN_EMAILS` virgül veya noktalı virgülle ayrılmış liste;
 * `NEXT_PUBLIC_ADMIN_EMAIL` tek ek adres (geriye dönük uyumluluk).
 * Tanımsızsa kod içi varsayılan liste kullanılır (yerel geliştirme kolaylığı).
 */
export function getGoogleAdminAllowedEmails(): string[] {
    const fromList = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
        .split(/[,;]/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    const single = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
    const fromEnv = [...fromList, ...(single ? [single] : [])];

    const legacyFallback = [
        'atakanclskn@outlook.com',
        'calskanatakan55@gmail.com',
        'atakadkfkf@gmail.com',
        'markosstudioss@gmail.com',
    ];

    if (fromEnv.length > 0) {
        return [...new Set([...fromEnv, ...legacyFallback])];
    }
    return [...new Set(legacyFallback)];
}
