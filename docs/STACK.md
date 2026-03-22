# Teknoloji yığını (stack)

Aşağıdaki liste [`package.json`](../package.json) ile uyumludur.

## Çatı

| Teknoloji | Sürüm (yaklaşık) | Rol |
|-----------|------------------|-----|
| **Next.js** | 16.x | App Router, sayfa ve API route’ları, `generateMetadata` ile SEO. |
| **React** | 19.x | UI. |
| **TypeScript** | 5.x | Tip güvenliği. |
| **Tailwind CSS** | 4.x | Stil; `@tailwindcss/postcss`, `@tailwindcss/typography` (yasal sayfalarda markdown). |

## Veri ve kimlik

| Paket | Rol |
|-------|-----|
| **firebase** | İstemci: Firestore, Storage, Auth (admin girişi). |
| **next-auth** | OAuth oturumu; özellikle **Google Analytics Data API** için sunucu tarafında `getServerSession` ile korunan `/api/analytics`. |

## UI ve etkileşim

| Paket | Rol |
|-------|-----|
| **framer-motion** | Animasyonlar. |
| **lucide-react** | İkonlar. |
| **recharts** | Admin analytics grafikleri. |
| **@hello-pangea/dnd** | Sürükle-bırak (ör. galeri / preloader düzeni). |
| **react-markdown** | Yasal metinler ve markdown içerik gösterimi. |
| **web-haptics** | Mobil dokunsal geri bildirim (ör. admin giriş hataları). |

## Durum yönetimi

| Paket | Rol |
|-------|-----|
| **zustand** | `adminStore`: admin paneli global durumu (mesajlar, kategoriler, içerik önbelleği vb.). |

## Analitik ve harici API

| Paket | Rol |
|-------|-----|
| **@google-analytics/data** | GA4 Data API ile admin dashboard istatistikleri (`/api/analytics`). |

## Geliştirme araçları

| Paket | Rol |
|-------|-----|
| **eslint** + **eslint-config-next** | Lint. |
| **knip** | Kullanılmayan export/dependency taraması (manuel çalıştırılır). |
| **tsx** | TypeScript script çalıştırma (ör. `scripts/`). |
| **dotenv** | Ortam değişkenlerini script’lerde yükleme. |

Fontlar **next/font/google** ile (`Outfit`, `Monoton`) — bkz. `src/app/layout.tsx`.
