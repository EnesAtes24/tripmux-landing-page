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

        // Locale selector
        language: "Language",
        currency: "Currency",
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

        // Locale selector
        language: "Dil",
        currency: "Para Birimi",
    },
};
