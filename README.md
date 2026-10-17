# GymMovement

GymMovement'in Cloudflare Pages web sitesi. Bu klasoru GitHub'a baglayip Cloudflare Pages'e kaynak olarak kullanabilirsin.

## Dosyalar

- `index.html`: Ana sayfa ve danisan basvuru formu.
- `functions/api/submit.js`: Form basvurusunu e-posta ile ileten Pages Function.
- `gizlilik.html`: Gizlilik bilgilendirmesi.
- `gymmovement-hero.png` ve `gymmovement-monogram.jpeg`: Site gorselleri.

## Cloudflare e-posta ayarlari

Cloudflare Pages projesinde **Settings → Variables and Secrets** altinda Production icin su degerleri tanimla:

- `RESEND_API_KEY`: Resend API anahtari (Secret olarak kaydet).
- `EMAIL_FROM`: Resend'de dogrulanmis gonderici adresi.
- `EMAIL_TO`: Basvuru e-postalarinin gidecegi adres (Secret olarak kaydet).

Bu degerleri HTML veya GitHub dosyalarina ekleme. `.wrangler` onbellegi ve `.env` dosyalari GitHub'a yuklenmez.

## Visual Studio ile duzenleme

Visual Studio'da **File → Open → Folder** ile bu klasoru ac. GitHub'a baglandiktan sonra degisiklikleri **Git Changes** penceresinden commit edip push et; Cloudflare Pages Git baglantisi etkinse yeni commit otomatik yayinlanir.
