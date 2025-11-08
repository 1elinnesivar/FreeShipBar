# Vercel Environment Variables Kurulum Rehberi

## Google Analytics Admin Panel için Gerekli Environment Variables

### 1. Vercel Dashboard'a Giriş
1. https://vercel.com adresine gidin
2. Projenizi seçin (FreeShipBar)
3. **Settings** → **Environment Variables** sekmesine gidin

### 2. Environment Variables Ekleme

#### GA4_PROPERTY_ID
1. **Key**: `GA4_PROPERTY_ID`
2. **Value**: Google Analytics Property ID'nizi girin
   - **ÖNEMLİ**: Tracking ID (`G-SMK4FPXNKY`) değil, Property ID olmalı
   - Property ID'yi bulmak için:
     - Google Analytics → Admin (⚙️) → Property Settings
     - Property ID genellikle sadece sayılardan oluşur (örn: `123456789`)
3. **Environment**: Tüm environment'ları seçin (Production, Preview, Development)

#### GA4_CREDENTIALS
1. **Key**: `GA4_CREDENTIALS`
2. **Value**: Service Account JSON dosyasının tam içeriği
   - JSON dosyasını açın (`freeshipbar-analytics-2fb72786ec9a.json`)
   - Tüm içeriği kopyalayın
   - Vercel'e yapıştırırken **tek satır** olarak yapıştırın
   - Örnek format:
   ```json
   {"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
   ```
3. **Environment**: Tüm environment'ları seçin (Production, Preview, Development)

### 3. Önemli Notlar

⚠️ **Environment Variables Eklendikten Sonra:**
- Yeni bir deployment yapmanız gerekir
- Vercel Dashboard → Deployments → En son deployment'ın yanındaki "..." → **Redeploy** yapın
- Veya yeni bir commit push edin

⚠️ **JSON Format Kontrolü:**
- JSON içinde çift tırnak (`"`) kullanılıyorsa, Vercel otomatik olarak escape eder
- Eğer hata alırsanız, JSON'u tek satıra çevirin
- Online JSON validator kullanarak formatı kontrol edin: https://jsonlint.com

⚠️ **Property ID vs Tracking ID:**
- **Tracking ID**: `G-SMK4FPXNKY` (gtag.js için kullanılır)
- **Property ID**: `123456789` (Data API için kullanılır - sadece sayılar)
- Property ID'yi Google Analytics Admin panelinden bulun

### 4. Kontrol ve Debug

Deployment sonrası:
1. Vercel Dashboard → Deployments → En son deployment'ı seçin
2. **Functions** sekmesine gidin
3. `/api/admin/analytics` fonksiyonunu seçin
4. **Logs** sekmesinde şu logları görmelisiniz:
   ```
   GA4_PROPERTY_ID exists: true
   GA4_PROPERTY_ID value: 12345...
   GA4_CREDENTIALS exists: true
   GA4_CREDENTIALS length: 2500
   All env vars starting with GA4: ['GA4_PROPERTY_ID', 'GA4_CREDENTIALS']
   ```

### 5. Yaygın Hatalar ve Çözümleri

**Hata**: `GA4_PROPERTY_ID exists: false`
- **Çözüm**: 
  - Environment variable'ın doğru isimle eklendiğinden emin olun (büyük/küçük harf duyarlı)
  - Tüm environment'lara eklendiğinden emin olun
  - Yeni bir deployment yapın

**Hata**: `GA4_CREDENTIALS exists: false`
- **Çözüm**:
  - JSON içeriğinin tam olarak kopyalandığından emin olun
  - JSON formatının geçerli olduğundan emin olun
  - Yeni bir deployment yapın

**Hata**: `Invalid GA4_CREDENTIALS format`
- **Çözüm**:
  - JSON'u tek satıra çevirin
  - JSON validator ile kontrol edin
  - Tüm tırnakların escape edildiğinden emin olun

**Hata**: `Permission denied` veya `403 Forbidden`
- **Çözüm**:
  - Service Account'a Google Analytics Data API izni verildiğinden emin olun
  - Google Cloud Console → IAM & Admin → Service Accounts
  - Service Account'u seçin → Permissions → Google Analytics Data API Viewer rolünü ekleyin

### 6. Service Account İzinleri

Service Account'un Google Analytics'e erişimi için:
1. Google Analytics → Admin → Property Access Management
2. Service Account email'ini ekleyin (JSON dosyasındaki `client_email`)
3. **Viewer** rolünü verin

### 7. Test

Environment variables eklendikten ve deployment yapıldıktan sonra:
1. `/admin/login` sayfasına gidin
2. Giriş yapın
3. Dashboard'da gerçek veriler görünmelidir
4. Eğer hala mock data görüyorsanız, Vercel Function Logs'u kontrol edin

