# GitHub'a Yükleme Adımları

## 1. Git Repository Oluştur

```bash
# Proje dizininde
git init
git add .
git commit -m "Initial commit: FreeShipBar project"
```

## 2. GitHub'da Repository Oluştur

1. [GitHub](https://github.com) hesabına giriş yap
2. "New repository" butonuna tıkla
3. Repository adı: `freeshipbar`
4. Description: "Free shipping notification bar embed script for e-commerce sites"
5. Public veya Private seç
6. "Create repository" tıkla

## 3. Local Repository'yi GitHub'a Bağla

GitHub'dan gösterilen komutları kullan veya:

```bash
git remote add origin https://github.com/YOUR_USERNAME/freeshipbar.git
git branch -M main
git push -u origin main
```

## 4. package.json'da Repository URL'ini Güncelle

`package.json` dosyasındaki `repository.url` değerini kendi GitHub kullanıcı adınla güncelle:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR_USERNAME/freeshipbar.git"
}
```

## 5. README.md'de Repository URL'lerini Güncelle

`README.md` dosyasındaki `yourusername` kısımlarını kendi kullanıcı adınla değiştir.

## ✅ Hazır!

Artık projen GitHub'da ve herkes tarafından görülebilir!

