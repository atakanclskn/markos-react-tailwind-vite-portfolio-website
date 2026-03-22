# Yol haritası (öncelikli yapılacaklar)

Bu liste ürün ve teknik iyileştirmeler için çalışma sırası önerisidir. Detaylı boşluk analizi için **[DURUM_VE_EKSIKLER.md](./DURUM_VE_EKSIKLER.md)** dosyasına bakın.

## Kısa vade

1. **Üretim ortamı:** Tüm `docs/ENVIRONMENT.md` değişkenlerinin üretimde doğrulanması; `NEXTAUTH_URL` ve Firebase yapılandırması.
2. **Güvenlik:** ~~Admin allowlist env (`NEXT_PUBLIC_ADMIN_EMAILS` / `NEXT_PUBLIC_ADMIN_EMAIL`);~~ `legacy` kod içi varsayılanlarını kaldırıp yalnızca env kullanmak (isteğe bağlı sıkılaştırma). **Firestore kurallarının gözden geçirilmesi** (hâlâ elinizde).
3. **Analytics:** ~~Analytics sayfasında NextAuth girişi için UX;~~ uzun vadede tek oturum modeli veya API’yi Firebase ile hizalama (isteğe bağlı).

## Orta vade

4. **Test:** Kritik akışlar için en azından birim veya e2e test iskeleti (ör. iletişim formu, auth guard).
5. **CI:** ~~GitHub Actions `typecheck`~~; ESLint’i `eslint-config-next` ile uyumlu hale getirip pipeline’a `lint` eklemek.
6. **İçerik:** Yasal metinlerin ve SEO alanlarının admin üzerinden gerçek içerikle doldurulması; demo/varsayılan metinlerin kaldırılması.

## Uzun vade / isteğe bağlı

7. **Gözlemlenebilirlik:** Hata izleme (ör. Sentry) ve temel uptime kontrolü.
8. **Performans:** Görsel optimizasyonu (`next/image` kullanımı tutarlılığı), bundle analizi.
9. **Bağımlılık:** `npm run knip` ile düzenli kontrol; `knip` uyarısı veren dosyalar (ör. `scripts/`) için yapılandırma veya temizlik.

## Açık sorular

- Hedef barındırma (Vercel, Firebase Hosting, başka) kesin mi?
- Yedekleme: Firestore ve Storage için otomatik yedek politikası var mı?
