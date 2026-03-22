# Yönetim paneli (admin)

## Giriş

- **URL:** `/admin/login`
- **Yöntemler:**
  - **E-posta + şifre** — Firebase `signInWithEmailAndPassword`.
  - **Google** — Firebase `signInWithPopup`; yalnızca izin verilen e-posta adresleri kabul edilir (kod içinde sabit liste + `NEXT_PUBLIC_ADMIN_EMAIL`).

Başarılı girişte denetim günlüğüne (`audit_logs`) kayıt yazılır.

## Koruma

- `AuthGuard` (`src/components/admin/AuthGuard.tsx`): Firebase `onAuthStateChanged` ile oturum yoksa `/admin/login`’e yönlendirir.
- Dashboard layout bu guard ile sarılır.

## NextAuth

- Kök layout’ta `SessionProvider` vardır; **admin sayfalarının çoğu Firebase ile korunur**.
- **Analytics** sayfası veriyi `/api/analytics` üzerinden alır; bu API **NextAuth oturumu** (Google OAuth) ister. Oturum yoksa API 401 döner.
- **Galeri, founder, preloader** gibi sayfalarda Google Drive / Picker için **`signIn('google')`** (NextAuth) butonları vardır; bu, Firebase Google girişinden bağımsız ikinci bir OAuth oturumudur.
- **Portfolio, contact, footer, legal** sayfalarında `useSession` yalnızca oturum bilgisini okumak için kullanılabilir — davranış için ilgili `page.tsx` dosyasına bakın.

Ayrıntılar: `src/app/api/analytics/route.ts`, `src/app/admin/(dashboard)/analytics/page.tsx`.

## Dashboard rotaları (`/admin` altında)

| Rota | İçerik |
|------|--------|
| `/admin` | Özet / ana dashboard. |
| `/admin/messages` | İletişim formu mesajları (okundu, yıldız, arşiv). |
| `/admin/gallery` | Kategoriler ve fotoğraflar; yükleme, sıralama, ImgBB/Google entegrasyonları. |
| `/admin/analytics` | GA4 grafikleri (env ve NextAuth gerekli). |
| `/admin/audit-logs` | Sistem denetim kayıtları. |
| `/admin/settings` | SEO, görünüm (marka rengi), site adı vb. |
| `/admin/legal` | Gizlilik, şartlar, çerez metinleri (`settings/legal`). |
| `/admin/sections/hero` | Hero metinleri. |
| `/admin/sections/founder` | Kurucu bölümü. |
| `/admin/sections/contact` | İletişim bölümü metinleri. |
| `/admin/sections/footer` | Footer ve sosyal linkler. |
| `/admin/sections/portfolio` | Portfolio bölümü ayarları. |
| `/admin/sections/preloader` | Preloader görselleri ve düzeni. |

Dosya yolları: `src/app/admin/(dashboard)/`.
