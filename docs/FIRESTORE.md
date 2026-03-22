# Firestore veri modeli

Aşağıdaki yapı `src/lib/firestore.ts` ve `src/types/index.ts` ile uyumludur.

## Koleksiyonlar

| Koleksiyon | Açıklama |
|------------|----------|
| `categories` | Galeri kategorileri: `name`, `slug`, `order`, `createdAt`. Sıralama `order` ile. |
| `photos` | Fotoğraflar: `categoryId`, `storageUrl`, `thumbnailUrl`, `order`, `createdAt`, isteğe bağlı `description`, Google alanları, boyutlar. |
| `messages` | İletişim formu: `name`, `email`, `phone`, `subject`, `message`, `read`, `starred`, `archived`, `createdAt`. |
| `audit_logs` | Denetim: `type`, `action`, `details`, `user`, `timestamp`. |

## `siteContent` — tek doküman kimlikleri

Firestore’da `siteContent` koleksiyonu altında **belge ID’si** sabit stringlerdir:

| Belge ID | TypeScript tipi | İçerik |
|----------|-----------------|--------|
| `hero` | `HeroContent` | `title`, `subtitle`, `buttonText` |
| `contact` | `ContactInfo` | başlık, açıklama, iletişim bilgileri, durum metni |
| `founder` | `FounderInfo` | isim, unvan, bio, foto URL, istatistikler |
| `footer` | `FooterContent` | telif, sosyal linkler |
| `seo` | `SEOSettings` | site adı, meta başlık/açıklama, anahtar kelimeler |
| `bentoGrid` | `BentoGridSettings` | animasyon aralığı (saniye) |
| `appearance` | `AppearanceSettings` | `brandColor` |
| `preloader` | `PreloaderSettings` | `images[]` |

## `settings` koleksiyonu

| Belge | Tip | Açıklama |
|-------|-----|----------|
| `legal` | `LegalContent` | `privacy`, `terms`, `cookies` — markdown stringler |

Yasal sayfalar (`/privacy`, `/terms`, `/cookies`) bu dokümanı veya kod içi varsayılan metinleri kullanır.

## İndeks notları

- `photos` için `categoryId` eşitliği + istemci tarafı `order` sıralaması kullanılır (bileşik indeks gereksinimini azaltmak için).
- `getAllPhotos` `createdAt` ile sıralar; gerekirse Firestore’da indeks tanımlanmalıdır.

## İzinler

Üretimde **Firestore Security Rules** bu koleksiyonlara göre kısıtlanmalıdır (ör. `messages` yazma herkese açık olabilir, admin yazma okuma ayrı). Kurallar bu repoda otomatik dağıtılmaz; Firebase konsolunda yönetilir.
