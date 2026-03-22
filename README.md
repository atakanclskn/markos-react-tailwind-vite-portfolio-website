# Markos Studio

Fotoğraf stüdyosu için **Next.js** tabanlı tanıtım sitesi ve **Firebase** ile yönetilen içerik: galeri, iletişim formu, yasal metinler, SEO ve admin paneli.

## Gereksinimler

- Node.js 20+ (Next.js 16 ile uyumlu sürüm önerilir)
- npm

## Kurulum

```bash
npm install
```

## Ortam değişkenleri

[Kök dizindeki `.env.example`](.env.example) dosyasını `.env.local` olarak kopyalayıp doldurun. Açıklamalar için **[docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)** dosyasına bakın.

## Geliştirme

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde açılır. Admin paneli: `/admin`.

## Üretim

```bash
npm run build
npm start
```

## Dokümantasyon

| Dosya | İçerik |
|-------|--------|
| [docs/README.md](docs/README.md) | Dokümantasyon dizini ve okuma sırası |
| [docs/STACK.md](docs/STACK.md) | Kullanılan kütüphaneler |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Mimari özet |
| [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) | Ortam değişkenleri |
| [docs/ADMIN.md](docs/ADMIN.md) | Admin paneli |
| [docs/FIRESTORE.md](docs/FIRESTORE.md) | Veri modeli |
| [CHANGELOG.md](CHANGELOG.md) | Sürüm notları |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Yapılacaklar |
| [docs/DURUM_VE_EKSIKLER.md](docs/DURUM_VE_EKSIKLER.md) | Eksikler ve risk özeti |

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm run start` | Üretim sunucusu |
| `npm run typecheck` | `tsc --noEmit` (tip kontrolü; CI ile aynı) |
| `npm run lint` | ESLint (şu an ESLint 10 ile `eslint-config-next` uyumsuzluğu olabilir) |
| `npm run knip` | Kullanılmayan export/bağımlılık taraması |

GitHub Actions: push/PR’de `typecheck` çalışır (`.github/workflows/ci.yml`).
