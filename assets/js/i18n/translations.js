/**
 * Tripmux i18n dictionary (MVP: English + Turkish).
 * Keys are used in data-i18n attributes and in JS references.
 */
export const translations = {
    en: {
        // Search form labels
        from: "From",
        to: "To",
        originPlaceholder: "Origin (City or Airport)",
        destinationPlaceholder: "Destination (City or Airport)",
        day: "Day",
        month: "Month",
        year: "Year",
        passengers: "Passengers",
        search: "Search",
        loading: "Loading...",

        // Hero
        heroHeadline: "Find the cheapest total route.",
        heroSubtext: "Compare flights now. Trains & buses coming soon.",

        // Hints
        yearModeHint: "Year mode returns the cheapest option for each month from the current month until year-end.",

        // Results
        noResults: "No results.",
        paxInfo: (n) => `Prices shown for ${n} passenger${n > 1 ? "s" : ""}`,
        openPartner: "Book",
        partnerNote: "Purchase is completed on the partner's website.",
        min: "min",
        direct: "Direct",
        stop: "stop",
        stops: "stops",
        bestPrice: "BEST PRICE",
        currencyMismatchWarning: "Prices returned in {currency} (provider limitation).",

        // Validation errors
        fillAll: "Please fill all fields.",
        iataError: "Origin and destination must be exactly 3 letters (A-Z).",
        sameRoute: "Origin and destination cannot be the same.",

        // Trust signal & sections
        trustSignal: "Tripmux compares prices from trusted travel partners.",
        howTitle: "How it works",
        howP1: "We search flights and compare prices from trusted travel partners.",
        howP2: "Soon we'll combine trains and buses to find even cheaper multi-modal routes.",
        howRedirect: "When you choose a route, Tripmux redirects you to the partner's official website to complete your booking.",
        howNote: "Rail & bus routes are coming soon.",
        partnersTitle: "Partners",
        partnersP1: "We compare prices from trusted travel partners.",
        partnersList: "We work with trusted travel partners through affiliate networks. Partner availability may vary by route and region.",

        // Navbar
        navHow: "How it works",
        navPartners: "Partners",
        navAbout: "About",
        navContact: "Contact",
        navCta: "Find cheapest route",

        // Footer
        footerTagline: "Tripmux compares prices from trusted travel partners.",
        footerCopyright: "© 2026 Tripmux. All rights reserved.",

        // Static pages
        aboutTitle: "About Tripmux",
        aboutP1: "Tripmux is a multi-modal travel comparison engine focused on the lowest total cost — not the shortest route.",
        aboutP2: "We search flights today and will soon combine trains and buses to unlock cheaper alternatives via nearby hubs.",
        aboutP3: "Tripmux redirects you to partner websites to complete bookings.",
        aboutP4: "Some outbound links on Tripmux are affiliate links. When you click and book on a partner website, we may earn a commission at no additional cost to you.",
        
        contactTitle: "Contact",
        contactP1: "For support, feedback, or partnerships, reach us at",
        contactEmail: "hello@tripmux.com",
        contactP2: "We usually respond within 48 hours.",
        
        privacyTitle: "Privacy Policy",
        privacyP1: "Tripmux respects your privacy.",
        privacyP2: "We do not collect personal data directly. We use cookies and third-party analytics tools to understand how users interact with our website and improve our service. We may use affiliate tracking technologies (e.g., referral parameters and cookies) to measure referrals to partner websites.",
        privacyP3: "Some outbound links on Tripmux are affiliate links. When users click these links and make a purchase on a partner website, we may earn a commission at no additional cost to the user.",
        privacyP4: "Tripmux does not sell personal data.",
        privacyP5: "By using this website, you agree to the use of cookies and analytics technologies as described above.",
        
        termsTitle: "Terms of Service",
        termsP1: "Tripmux is a travel search and comparison platform. We do not sell tickets directly. Tripmux is not the travel provider, does not issue tickets, and is not responsible for changes, cancellations, or service issues on partner websites.",
        termsP2: "All prices, schedules, and travel information are provided by third-party partners. Tripmux is not responsible for changes, cancellations, or booking issues on partner websites.",
        termsP3: "Users are redirected to external partner platforms to complete bookings.",
        termsP4: "By using Tripmux, you agree that Tripmux is not liable for travel disruptions, pricing errors, or third-party service issues.",
        
        footerAbout: "About",
        footerContact: "Contact",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms of Service",
        footerDisclosure1: "Some outbound links on Tripmux are affiliate links. When you click and book on a partner website, we may earn a commission at no additional cost to you.",
        footerDisclosure2: "Tripmux is an independent travel comparison platform and does not operate transportation services.",

        // Locale selector
        language: "Language",
        currency: "Currency",

        // Affiliate section (More options)
        affiliateSectionTitle: "More options",
        affiliateSectionSubtitle: "Book via trusted partners (affiliate links).",
        affiliateKiwiTitle: "Kiwi.com",
        affiliateKiwiDesc: "Flights and connections worldwide.",
        affiliate12GoTitle: "12Go",
        affiliate12GoDesc: "Buses, trains & ferries in Asia.",
        affiliateCta: "Open",
        affiliateDisclosureShort: "Some links are affiliate links; you pay the same.",
    },
    tr: {
        // Search form labels
        from: "Nereden",
        to: "Nereye",
        originPlaceholder: "Kalkış (Şehir veya Havalimanı)",
        destinationPlaceholder: "Varış (Şehir veya Havalimanı)",
        day: "Gün",
        month: "Ay",
        year: "Yıl",
        passengers: "Yolcu",
        search: "Ara",
        loading: "Yükleniyor...",

        // Hero
        heroHeadline: "En ucuz toplam rotayı bul.",
        heroSubtext: "Uçuşları şimdi karşılaştır. Tren ve otobüs yakında.",

        // Hints
        yearModeHint: "Yıl modu, mevcut aydan yıl sonuna kadar her ay için en ucuz seçeneği döndürür.",

        // Results
        noResults: "Sonuç bulunamadı.",
        paxInfo: (n) => `Fiyatlar ${n} yolcu için gösteriliyor`,
        openPartner: "Rezerve Et",
        partnerNote: "Satın alma, partner web sitesinde tamamlanır.",
        min: "dk",
        direct: "Direkt",
        stop: "aktarma",
        stops: "aktarma",
        bestPrice: "EN İYİ FİYAT",
        currencyMismatchWarning: "Fiyatlar {currency} olarak döndürüldü (sağlayıcı kısıtlaması).",

        // Validation errors
        fillAll: "Lütfen tüm alanları doldurun.",
        iataError: "Kalkış ve varış tam 3 harf (A-Z) olmalıdır.",
        sameRoute: "Kalkış ve varış aynı olamaz.",

        // Trust signal & sections
        trustSignal: "Tripmux, güvenilir seyahat ortaklarından fiyat karşılaştırır.",
        howTitle: "Nasıl çalışır",
        howP1: "Güvenilir seyahat ortaklarından uçuş arıyor ve fiyatları karşılaştırıyoruz.",
        howP2: "Yakında tren ve otobüsü de ekleyerek daha ucuz çok modlu rotalar bulacağız.",
        howRedirect: "Bir rota seçtiğinizde, Tripmux sizi rezervasyonunuzu tamamlamak için partner'in resmi web sitesine yönlendirir.",
        howNote: "Tren ve otobüs rotaları yakında.",
        partnersTitle: "Ortaklar",
        partnersP1: "Güvenilir seyahat ortaklarından fiyat karşılaştırıyoruz.",
        partnersList: "Affiliate ağlar aracılığıyla güvenilir seyahat ortaklarıyla çalışıyoruz. Partner kullanılabilirliği rota ve bölgeye göre değişebilir.",

        // Navbar
        navHow: "Nasıl çalışır",
        navPartners: "Ortaklar",
        navAbout: "Hakkımızda",
        navContact: "İletişim",
        navCta: "En ucuz rotayı bul",

        // Footer
        footerTagline: "Tripmux, güvenilir seyahat ortaklarından fiyat karşılaştırır.",
        footerCopyright: "© 2026 Tripmux. Tüm hakları saklıdır.",

        // Static pages
        aboutTitle: "Tripmux Hakkında",
        aboutP1: "Tripmux, en kısa rota değil, en düşük toplam maliyete odaklanan çok modlu bir seyahat karşılaştırma motorudur.",
        aboutP2: "Bugün uçuşları arıyoruz ve yakında tren ve otobüsleri de ekleyerek yakındaki merkezler üzerinden daha ucuz alternatifler bulacağız.",
        aboutP3: "Tripmux sizi rezervasyonları tamamlamak için partner web sitelerine yönlendirir.",
        aboutP4: "Tripmux'taki bazı dış bağlantılar affiliate bağlantılardır. Bir partner web sitesinde tıklayıp rezervasyon yaptığınızda, size ek bir maliyet olmadan komisyon kazanabiliriz.",
        
        contactTitle: "İletişim",
        contactP1: "Destek, geri bildirim veya ortaklıklar için bize ulaşın",
        contactEmail: "hello@tripmux.com",
        contactP2: "Genellikle 48 saat içinde yanıt veriyoruz.",
        
        privacyTitle: "Gizlilik Politikası",
        privacyP1: "Tripmux gizliliğinize saygı duyar.",
        privacyP2: "Kişisel verileri doğrudan toplamıyoruz. Kullanıcıların web sitemizle nasıl etkileşimde bulunduğunu anlamak ve hizmetimizi iyileştirmek için çerezler ve üçüncü taraf analitik araçlar kullanıyoruz. Partner web sitelerine yönlendirmeleri ölçmek için affiliate takip teknolojileri (ör. referans parametreleri ve çerezler) kullanabiliriz.",
        privacyP3: "Tripmux'taki bazı dış bağlantılar affiliate bağlantılardır. Kullanıcılar bu bağlantılara tıkladığında ve bir partner web sitesinde satın alma yaptığında, kullanıcıya ek bir maliyet olmadan komisyon kazanabiliriz.",
        privacyP4: "Tripmux kişisel veri satmaz.",
        privacyP5: "Bu web sitesini kullanarak, yukarıda açıklandığı şekilde çerezlerin ve analitik teknolojilerin kullanılmasını kabul etmiş olursunuz.",
        
        termsTitle: "Hizmet Şartları",
        termsP1: "Tripmux bir seyahat arama ve karşılaştırma platformudur. Biletleri doğrudan satmıyoruz. Tripmux seyahat sağlayıcısı değildir, bilet çıkarmaz ve partner web sitelerindeki değişikliklerden, iptallerden veya hizmet sorunlarından sorumlu değildir.",
        termsP2: "Tüm fiyatlar, programlar ve seyahat bilgileri üçüncü taraf ortaklar tarafından sağlanmaktadır. Tripmux, partner web sitelerindeki değişikliklerden, iptallerden veya rezervasyon sorunlarından sorumlu değildir.",
        termsP3: "Kullanıcılar rezervasyonları tamamlamak için harici partner platformlarına yönlendirilir.",
        termsP4: "Tripmux'u kullanarak, Tripmux'un seyahat kesintilerinden, fiyatlandırma hatalarından veya üçüncü taraf hizmet sorunlarından sorumlu olmadığını kabul etmiş olursunuz.",
        
        footerAbout: "Hakkımızda",
        footerContact: "İletişim",
        footerPrivacy: "Gizlilik Politikası",
        footerTerms: "Hizmet Şartları",
        footerDisclosure1: "Tripmux'taki bazı dış bağlantılar affiliate bağlantılardır. Bir partner web sitesinde tıklayıp rezervasyon yaptığınızda, size ek bir maliyet olmadan komisyon kazanabiliriz.",
        footerDisclosure2: "Tripmux bağımsız bir seyahat karşılaştırma platformudur ve ulaştırma hizmetleri işletmez.",

        // Locale selector
        language: "Dil",
        currency: "Para Birimi",

        // Affiliate section (More options)
        affiliateSectionTitle: "Ek seçenekler",
        affiliateSectionSubtitle: "Güvenilir partnerler üzerinden rezervasyon (affiliate link).",
        affiliateKiwiTitle: "Kiwi.com",
        affiliateKiwiDesc: "Dünya genelinde uçuş ve bağlantılar.",
        affiliate12GoTitle: "12Go",
        affiliate12GoDesc: "Asya'da otobüs, tren ve feribot.",
        affiliateCta: "Aç",
        affiliateDisclosureShort: "Bazı linkler affiliate'dir; fiyat değişmez.",
    },
};
