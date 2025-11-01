# FreeShipBar

A free shipping notification bar embed script for e-commerce sites. Show your customers how much they need to spend for free shipping.

## 🚀 Features

- ⚡ Easy integration with a single script tag
- 🎨 Customizable colors, position, and language settings
- 📱 Responsive and mobile-friendly
- 🚀 Lightweight and performant (< 10KB)
- 🔄 Dynamic update API (`window.FREESHIPBAR_UPDATE`)
- 🌍 TR/EN language support
- 🎭 Multiple themes (Pro): Minimal, Gradient, Glass, Stripe
- 🎯 Two modes (Pro): Bar with progress, or Announce only

## 🆓 Free vs Pro

### Free Mode
- Works without license key
- Watermark displayed
- Single theme (Minimal)
- Top position only
- Always sticky
- Bar mode only

### Pro Mode
- No watermark
- 4 themes: Minimal, Gradient, Glass, Stripe
- Top or Bottom position
- Customizable sticky behavior
- Bar or Announce mode
- Full color customization

## 📦 Installation

### Requirements

- Node.js 18+
- npm or yarn

### Steps

1. Clone the repository:

```bash
git clone https://github.com/1elinnesivar/FreeShipBar.git
cd FreeShipBar
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your values:

```env
GUMROAD_PRODUCT_PERMALINK=freeshipbar-pro
GUMROAD_API_KEY=your-gumroad-api-key-here
```

### Gumroad Setup

#### 1. Create Product and Settings

1. Log in to your [Gumroad](https://gumroad.com) account
2. Product: [FreeShipBar Pro License](https://zekayiozdemir.gumroad.com/l/freeshipbar-pro)
3. On the product page, copy the **Permalink**
   - Permalink: `freeshipbar-pro`
   - Product URL: `https://zekayiozdemir.gumroad.com/l/freeshipbar-pro`
4. In product settings, enable **License Keys**
   - This setting ensures customers receive a license key after purchase

#### 2. Create Access Token

1. In your Gumroad account, go to [Settings > Advanced](https://gumroad.com/settings/advanced)
2. Under **Personal Access Tokens**, create a new token
3. Copy the token and add it to your `.env` file:

```env
GUMROAD_PRODUCT_PERMALINK=freeshipbar-pro
GUMROAD_API_KEY=your-personal-access-token-here
```

#### 3. Customer Usage

- After purchase, customers receive a **license key** via email
- Users enter this license key in the builder form
- When the license key is verified, the watermark is removed and Pro plan features are activated

## 🛠️ Development

### Development Server

```bash
npm run dev
```

The application will run at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## 📝 Usage

### Embed Script Integration

1. Use the **Code Builder** section on the homepage to configure your settings
2. Click **Copy Code**
3. Paste the copied script tag inside your website's `<body>` tag

### Script Parameters

You can customize the bar's behavior by adding `data-` attributes to the `<script>` tag:

| Parameter      | Type      | Default | Description                           |
| -------------- | --------- | ------- | ------------------------------------- |
| `data-threshold` | number  | **Required** | Free shipping threshold amount        |
| `data-total`   | number  | `0`     | Current cart total                    |
| `data-currency` | string | `USD`   | Currency code (USD, EUR, TRY, etc.)   |
| `data-locale`  | string | `en`    | Language (`en` or `tr`)               |
| `data-theme`   | string | `minimal` | Theme (Pro): `minimal`, `gradient`, `glass`, `stripe` |
| `data-position` | string | `top`   | Position (Pro): `top` or `bottom`    |
| `data-sticky`  | string | `true`  | Sticky behavior (Pro): `true` or `false` |
| `data-mode`    | string | `bar`   | Mode (Pro): `bar` or `announce`       |
| `data-colors`  | JSON   | `null`  | Custom colors (Pro): `{"bg":"#111827","fg":"#ffffff","bar":"#10b981"}` |
| `data-license` | string | `null`  | Pro license key                       |

### Example

```html
<script 
  src="https://yourdomain.com/embed.js"
  data-threshold="750"
  data-total="350"
  data-currency="USD"
  data-locale="en"
  data-theme="gradient"
  data-position="top"
  data-sticky="true"
  data-mode="bar"
  data-colors='{"bg":"#1e293b","fg":"#ffffff","bar":"#10b981"}'
  data-license="XXXX-XXXX-XXXX"
></script>
```

### Dynamic Update

Update the cart total programmatically:

```javascript
// Update the cart total
window.FREESHIPBAR_UPDATE(450)
```

## 🚢 Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `GUMROAD_PRODUCT_PERMALINK`
   - `GUMROAD_API_KEY`
4. Deploy!

The project is already configured for Vercel with `vercel.json`.

## 📄 License

One-time license purchase required for Pro features. See [Gumroad](https://zekayiozdemir.gumroad.com/l/freeshipbar-pro) for details.

## 🔗 Links

- [Product Page](https://zekayiozdemir.gumroad.com/l/freeshipbar-pro)
- [Documentation](#usage)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, visit the [Gumroad product page](https://zekayiozdemir.gumroad.com/l/freeshipbar-pro).

---

Made with ❤️ for e-commerce stores
