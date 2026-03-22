# Ortam değişkenleri

Tüm değerler **gerçek anahtarlar olmadan** burada açıklanır. Üretimde `.env.local` veya barındırıcı paneli kullanın; bu dosyayı repoya **gizli bilgi** ile commit etmeyin.

## Firebase (genel site + istemci SDK)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Evet | Web API anahtarı. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Evet | Auth domain. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Evet | Proje; Firestore REST URL’lerinde de kullanılır. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Evet | Storage bucket. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Evet | Firebase yapılandırması. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Evet | Uygulama kimliği. |

`src/lib/firebase.ts` bu değişkenleri okur; eksikse demo placeholder’lar kullanılır (geliştirme için uyarı verir, üretimde doğru ayarlanmalıdır).

## Admin e-posta (isteğe bağlı genişletme)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXT_PUBLIC_ADMIN_EMAIL` | Hayır | Google ile girişte izin verilen ek e-posta adresi (login sayfasındaki allowlist ile birlikte). |

## NextAuth (Analytics API ve Google oturumu)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXTAUTH_SECRET` | Üretimde evet | Oturum şifreleme. |
| `GOOGLE_CLIENT_ID` | Analytics kullanılacaksa | Google OAuth istemci kimliği. |
| `GOOGLE_CLIENT_SECRET` | Analytics kullanılacaksa | Google OAuth gizli anahtarı. |

NextAuth URL’leri genelde `NEXTAUTH_URL` ile barındırıcıya göre ayarlanır (Vercel vb. dokümantasyonuna bakın).

## Google Analytics Data API (admin dashboard)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `GA_PROPERTY_ID` | Analytics sayfası için | GA4 property ID (sayısal). |
| `GA_CLIENT_EMAIL` | Analytics sayfası için | Servis hesabı e-postası. |
| `GA_PRIVATE_KEY` | Analytics sayfası için | Servis hesabı özel anahtarı; çok satırlı anahtarlar için `\n` kaçışı kullanılabilir. |

Eksikse `/api/analytics` yapılandırma hatası döner (503).

## ImgBB (sunucu tarafı yükleme)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `IMGBB_API_KEY` | ImgBB kullanılacaksa | `/api/admin/upload` ve Drive upload akışında. |

## Google Picker / Drive (istemci)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXT_PUBLIC_GOOGLE_API_KEY` | Picker/entegrasyon için | Google API istemci anahtarı. |
| `NEXT_PUBLIC_GOOGLE_APP_ID` | İlgili entegrasyon için | Google Cloud proje kimliği. |

---

### Şablon (kopyala-yapıştır — değerleri doldurun)

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_ADMIN_EMAIL=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Google Analytics Data API
GA_PROPERTY_ID=
GA_CLIENT_EMAIL=
GA_PRIVATE_KEY=

# ImgBB
IMGBB_API_KEY=

# Google Picker (public)
NEXT_PUBLIC_GOOGLE_API_KEY=
NEXT_PUBLIC_GOOGLE_APP_ID=
```
