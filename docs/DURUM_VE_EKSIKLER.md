# Durum ve eksikler

Bu belge, “**ne kaldı?**”, “**nerede boşluk var?**” ve “**üstünde durulmayan konular**” sorularına odaklanır. [ROADMAP.md](./ROADMAP.md) öncelik listesidir; burada ise **tespit ve risk** özetlenir.

---

## 1. Dokümantasyon ve süreç

| Durum | Açıklama |
|-------|----------|
| Giderildi | Kök `README` create-next-app şablonundan çıkarıldı; `docs/` teknik dokümantasyon eklendi. |
| Eksik | Otomatik CI/CD dokümantasyonu yok; depoda workflow dosyası yok. |
| Eksik | `package.json` içinde `test` script’i yok; otomatik test altyapısı kurulmamış. |

**Yapılacaklar:** Üretim deploy adımlarını README veya ayrı bir “Deploy” bölümünde yazmak; test stratejisi seçildiğinde CHANGELOG’a işlemek.

---

## 2. Kimlik ve oturum (çift sistem)

- **Firebase Auth:** Admin paneli girişi ve `AuthGuard` bunun üzerinde.
- **NextAuth (Google):** `/api/analytics` NextAuth oturumu istiyor; galeri, founder, preloader gibi sayfalarda `signIn('google')` Drive / OAuth için kullanılıyor.

**Risk:** Sadece Firebase ile giriş yapan bir kullanıcı, NextAuth oturumu olmadan **Analytics** API’sine 401 alabilir. İki OAuth akışının (Firebase Google vs NextAuth Google) kullanıcı deneyiminde netleştirilmesi gerekir.

**Yapılacaklar:** Analytics sayfasında oturum yoksa yönlendirme veya “Google ile bağlan” CTA’sı; veya mimari sadeleştirme (tek kimlik sağlayıcısı).

---

## 3. Admin yetkilendirme (kod içi allowlist)

`src/app/admin/login/page.tsx` içinde Google girişinde izin verilen e-postalar **kod içinde sabit** listeleniyor; `NEXT_PUBLIC_ADMIN_EMAIL` ile tek ek adres destekleniyor.

**Risk:** Yeni admin eklemek için deploy gerekebilir; e-postalar repoda görünür (gizli değil).

**Yapılacaklar:** Allowlist’i ortam değişkeni veya Firestore `admins` koleksiyonuna taşımak (tercih sizin).

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
- **firebase-admin:** `package.json`’da var; `src/` altında kullanılmıyor — gereksiz yüzey veya gelecek kullanım için not.
- **Yedekleme ve izleme:** Belgede politika yok; üretim için ayrıca tanımlanmalı.

---

## 7. Üstünde durulmayan / düşük öncelik

- `knip` projede var; npm script’e bağlı değil — düzenli kullanılmıyor olabilir.
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
