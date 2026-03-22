/**
 * Google ile Firebase admin girişinde izin verilen e-postalar.
 *
 * - `NEXT_PUBLIC_ADMIN_EMAILS`: virgül veya noktalı virgülle ayrılmış liste.
 * - `NEXT_PUBLIC_ADMIN_EMAIL`: tek ek adres (geriye dönük uyumluluk).
 *
 * Bu iki değişkenden en az biri doluysa **yalnızca** bu adresler kullanılır.
 * Hiçbiri yoksa yerel geliştirme için kod içi varsayılan liste devreye girer.
 */
export function getGoogleAdminAllowedEmails(): string[] {
    const fromList = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
        .split(/[,;]/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    const single = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
    const explicit = [...fromList, ...(single ? [single] : [])];

    const legacyFallback = [
        'atakanclskn@outlook.com',
        'calskanatakan55@gmail.com',
        'atakadkfkf@gmail.com',
        'markosstudioss@gmail.com',
    ];

    if (explicit.length > 0) {
        return [...new Set(explicit)];
    }
    return [...new Set(legacyFallback)];
}
