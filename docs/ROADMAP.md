# Yol haritası (öncelikli yapılacaklar)

Bu liste ürün ve teknik iyileştirmeler için çalışma sırası önerisidir. Detaylı boşluk analizi için **[DURUM_VE_EKSIKLER.md](./DURUM_VE_EKSIKLER.md)** dosyasına bakın.

## Kısa vade

1. **Üretim ortamı:** Tüm `docs/ENVIRONMENT.md` değişkenlerinin üretimde doğrulanması; `NEXTAUTH_URL` ve Firebase yapılandırması.
2. **Güvenlik:** Admin e-posta allowlist’inin env tabanlı yönetimi; Firestore kurallarının gözden geçirilmesi.
3. **Analytics akışı:** Firebase ile giriş yapan kullanıcının `/api/analytics` için NextAuth oturumunun nasıl sağlanacağının netleştirilmesi (gerekirse tek oturum modeli veya açık “Analytics için Google ile tekrar giriş” UX’i).

## Orta vade

4. **Test:** Kritik akışlar için en azından birim veya e2e test iskeleti (ör. iletişim formu, auth guard).
5. **CI:** Lint (ve varsa test) için GitHub Actions veya eşdeğeri pipeline.
6. **İçerik:** Yasal metinlerin ve SEO alanlarının admin üzerinden gerçek içerikle doldurulması; demo/varsayılan metinlerin kaldırılması.

## Uzun vade / isteğe bağlı

7. **Gözlemlenebilirlik:** Hata izleme (ör. Sentry) ve temel uptime kontrolü.
8. **Performans:** Görsel optimizasyonu (`next/image` kullanımı tutarlılığı), bundle analizi.
9. **Bağımlılık temizliği:** `firebase-admin` gibi kullanılmayan paketlerin kaldırılması veya kullanıma alınması (`knip` ile doğrulama).

## Açık sorular

- Hedef barındırma (Vercel, Firebase Hosting, başka) kesin mi?
- Yedekleme: Firestore ve Storage için otomatik yedek politikası var mı?
