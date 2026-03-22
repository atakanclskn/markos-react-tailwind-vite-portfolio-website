# Changelog

Bu dosya [Keep a Changelog](https://keepachangelog.com/tr/1.0.0/) ilkelerine uygun tutulur.

## [Unreleased]

### Eklenen

- Proje kökü ve `docs/` altında Türkçe teknik dokümantasyon (stack, mimari, ortam değişkenleri, admin, Firestore, yol haritası, durum/eksikler).
- Kök `.env.example`; `npm run typecheck` ve `npm run knip` script’leri; GitHub Actions ile `typecheck` CI.
- `NEXT_PUBLIC_ADMIN_EMAILS` ile Google admin allowlist (env doluysa yalnızca bu liste + `NEXT_PUBLIC_ADMIN_EMAIL`); `src/lib/adminAllowlist.ts`.
- Analytics sayfasında 401 için NextAuth ile giriş çağrısı (`useSession` ile oturum sonrası otomatik yenileme).

### Değişen

- Kullanılmayan `firebase-admin` bağımlılığı kaldırıldı.

---

## [0.1.0] — 2026-03-22

İlk dokümante edilen sürüm özeti (kod tabanına göre).

### Özellikler

- **Ziyaretçi sitesi:** Ana sayfa, galeri (`/gallery`, `/gallery/[category]`), gizlilik / şartlar / çerez sayfaları.
- **İletişim formu:** Mesajlar Firestore `messages` koleksiyonuna yazılır (REST ile).
- **Admin paneli:** Firebase Auth (e-posta/şifre veya Google, e-posta allowlist); galeri, mesajlar, bölüm metinleri (hero, founder, contact, footer, portfolio, preloader), SEO ve görünüm, yasal içerik, denetim günlükleri.
- **Analytics:** Google Analytics Data API ile admin dashboard (`/api/analytics`); NextAuth oturumu gerekir.
- **Yükleme:** ImgBB üzerinden sunucu tarafı yükleme; Google Drive / Picker ile ilgili admin akışları (NextAuth `signIn('google')` ile).
