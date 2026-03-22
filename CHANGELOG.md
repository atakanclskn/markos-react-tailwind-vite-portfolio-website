# Changelog

Bu dosya [Keep a Changelog](https://keepachangelog.com/tr/1.0.0/) ilkelerine uygun tutulur.

## [Unreleased]

### Eklenen

- Proje kökü ve `docs/` altında Türkçe teknik dokümantasyon (stack, mimari, ortam değişkenleri, admin, Firestore, yol haritası, durum/eksikler).

---

## [0.1.0] — 2026-03-22

İlk dokümante edilen sürüm özeti (kod tabanına göre).

### Özellikler

- **Ziyaretçi sitesi:** Ana sayfa, galeri (`/gallery`, `/gallery/[category]`), gizlilik / şartlar / çerez sayfaları.
- **İletişim formu:** Mesajlar Firestore `messages` koleksiyonuna yazılır (REST ile).
- **Admin paneli:** Firebase Auth (e-posta/şifre veya Google, e-posta allowlist); galeri, mesajlar, bölüm metinleri (hero, founder, contact, footer, portfolio, preloader), SEO ve görünüm, yasal içerik, denetim günlükleri.
- **Analytics:** Google Analytics Data API ile admin dashboard (`/api/analytics`); NextAuth oturumu gerekir.
- **Yükleme:** ImgBB üzerinden sunucu tarafı yükleme; Google Drive / Picker ile ilgili admin akışları (NextAuth `signIn('google')` ile).
