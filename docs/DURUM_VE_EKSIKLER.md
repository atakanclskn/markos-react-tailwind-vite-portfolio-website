# Durum ve eksikler

Bu belge, “**ne kaldı?**”, “**nerede boşluk var?**” ve “**üstünde durulmayan konular**” sorularına odaklanır. [ROADMAP.md](./ROADMAP.md) öncelik listesidir; burada ise **tespit ve risk** özetlenir.

---

## 1. Dokümantasyon ve süreç

| Durum | Açıklama |
|-------|----------|
| Giderildi | Kök `README` create-next-app şablonundan çıkarıldı; `docs/` teknik dokümantasyon eklendi. |
| Kısmen | GitHub Actions ile `npm run typecheck` çalışıyor; ESLint pipeline’a eklenmedi (`eslint-config-next` ile ESLint 10 arasında kural yükleme hatası — `npm run lint` yerelde de başarısız olabilir). |
| Eksik | `package.json` içinde `test` script’i yok; otomatik test altyapısı kurulmamış. |
| Eklendi | `npm run knip` script’i; kök `.env.example`. |

**Yapılacaklar:** Üretim deploy adımlarını README veya ayrı bir “Deploy” bölümünde yazmak; test stratejisi seçildiğinde CHANGELOG’a işlemek.

---

## 2. Kimlik ve oturum (çift sistem)

- **Firebase Auth:** Admin paneli girişi ve `AuthGuard` bunun üzerinde.
- **NextAuth (Google):** `/api/analytics` NextAuth oturumu istiyor; galeri, founder, preloader gibi sayfalarda `signIn('google')` Drive / OAuth için kullanılıyor.

**İyileştirildi:** Analytics sayfasında 401 durumunda **NextAuth ile Google** girişi için buton ve oturum gelince otomatik yeniden istek.

**Kalan risk:** İki OAuth akışı (Firebase Google vs NextAuth Google) hâlâ ayrı; uzun vadede tek oturum modeli düşünülebilir.

---

## 3. Admin yetkilendirme (allowlist)

Google allowlist **`NEXT_PUBLIC_ADMIN_EMAILS`** (virgülle ayrılmış) ve **`NEXT_PUBLIC_ADMIN_EMAIL`** ile yönetilir; mantık `src/lib/adminAllowlist.ts` içinde. Bu değişkenler set edilmezse **kod içi varsayılan** dört adres kullanılır (yerel geliştirme).

**Risk:** Üretimde env verilmezse varsayılanlar hâlâ geçerli olur; sıkı kurulum için env zorunlu tutulmalı veya varsayılanlar kaldırılmalı.

**Yapılacaklar:** İsterseniz varsayılanları kaldırıp yalnızca env; veya Firestore `admins` koleksiyonu.

---

## 4. Sayfa ve içerik boşlukları

Rota taraması: `src/app/**/page.tsx` dosyaları tam sayfa bileşeni içeriyor; **boş route** yok.

| Alan | Durum |
|------|--------|
| Yasal sayfalar (`/privacy`, `/terms`, `/cookies`) | Firestore’da `settings/legal` yoksa kod içi **varsayılan** markdown kullanılır. **İçerik üretimi** admin tarafında tamamlanmalıdır. |
| SEO | `generateMetadata` Firestore `siteContent/seo` ile beslenir; yoksa `layout.tsx` içindeki varsayılan metinler kullanılır. |
| Galeri | Kategori/fotoğraf yoksa UI boş durum gösterir; veri girişi admin galeriden yapılmalıdır. |

**Yapılacaklar:** Canlıya almadan yasal metinlerin ve meta alanlarının kontrolü; galeri seed veya manuel yükleme.

---

## 5. Ortam ve entegrasyonlar

| Entegrasyon | Env | Eksik kalırsa |
|-------------|-----|----------------|
| Firebase | `NEXT_PUBLIC_FIREBASE_*` | Uygulama çalışmaz veya demo placeholder ile hatalı davranır. |
| Analytics | `GA_*` | `/api/analytics` 503 veya hata mesajı. |
| ImgBB | `IMGBB_API_KEY` | Sunucu yüklemesi başarısız. |
| NextAuth | `NEXTAUTH_*`, `GOOGLE_*` | Analytics ve OAuth gerektiren akışlar çalışmaz. |
| Google Picker | `NEXT_PUBLIC_GOOGLE_*` | Picker / ilgili özellikler devre dışı kalır. |

**Yapılacaklar:** Üretim `.env` kontrol listesi; her özellik için smoke test.

---

## 6. Güvenlik ve operasyon

- **Firestore Security Rules:** Kod deposunda tanımlı değil; Firebase konsolunda yapılandırılmalı (public yazma/okuma riskleri).
- **firebase-admin:** Kaldırıldı (kullanılmıyordu).
- **Yedekleme ve izleme:** Belgede politika yok; üretim için ayrıca tanımlanmalı.

---

## 7. Üstünde durulmayan / düşük öncelik

- `npm run knip` ile tarama yapılabilir; uyarı veren dosyalar (ör. `scripts/`, `test-categories.mjs`) için `knip` yapılandırması veya temizlik ayrı iş.
- `recharts` / analytics response tipleri bazı yerlerde `any` — tip sıkılaştırması yapılabilir.
- Çok satırlı `GA_PRIVATE_KEY` kaçışları farklı barındırıcılarda hata çıkarabilir; deploy dokümantasyonu netleştirilmeli.

---

## Özet: şu an ne kaldı?

1. **İçerik ve yapılandırma:** Yasal metinler, SEO, galeri verisi — canlıya uygunluk kontrolü.  
2. **Kimlik:** Firebase + NextAuth ikiliği ve analytics erişiminin net UX’i.  
3. **Güvenlik ve operasyon:** Allowlist yönetimi, Firestore kuralları, env doğrulama, yedek/izleme.  
4. **Kalite:** Otomatik test ve CI yok.  
5. **Teknik borç:** Kullanılmayan `firebase-admin` (veya kullanıma alma).

Bu maddeler [ROADMAP.md](./ROADMAP.md) ile birlikte takip edilmelidir.
