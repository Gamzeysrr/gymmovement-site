const FIELDS = {
  name: 'Ad soyad', email: 'E-posta', phone: 'Telefon', city: 'Şehir',
  age: 'Yaş', sex: 'Cinsiyet', height: 'Boy (cm)', weight: 'Kilo (kg)',
  activity: 'Aktivite katsayısı', training: 'Antrenman sıklığı', goal: 'Hedef',
  experience: 'Antrenman deneyimi', sleep: 'Uyku', bmi: 'VKİ', tdee: 'Tahmini TDEE (kcal)',
  health: 'Sağlık/kısıt notu', notes: 'Ek notlar'
};
const clean = (value, limit = 1500) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.EMAIL_TO) {
    return json({ error: 'E-posta gönderimi henüz yapılandırılmamış.' }, 503);
  }

  let input;
  try { input = await request.json(); }
  catch { return json({ error: 'Form verileri okunamadı.' }, 400); }

  const data = Object.fromEntries(Object.keys(FIELDS).map(key => [
    key, clean(input?.[key], key === 'health' || key === 'notes' ? 2000 : 200)
  ]));
  if (!data.name || !data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
      !data.phone || !data.age || !data.height || !data.weight || !data.goal ||
      input?.privacy !== 'on' || input?.contactConsent !== 'on') {
    return json({ error: 'Zorunlu alanlar veya onaylar eksik. Bilgileri kontrol edip tekrar deneyin.' }, 400);
  }

  const text = Object.entries(FIELDS).map(([key, label]) => `${label}: ${data[key] || '—'}`).join('\n');
  try {
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [env.EMAIL_TO],
        reply_to: data.email,
        subject: `Yeni danışan başvurusu — ${data.name}`,
        text
      })
    });
    if (!sent.ok) return json({ error: 'E-posta şu anda gönderilemedi. Lütfen tekrar deneyin.' }, 502);
    return json({ ok: true });
  } catch {
    return json({ error: 'E-posta servisine ulaşılamadı. Lütfen tekrar deneyin.' }, 502);
  }
}
