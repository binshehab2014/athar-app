# 🌱 أثر — Athar

> **خطواتك الصغيرة، إرثك الكبير**  
> تطبيق مرشد ذكي لتحويل أحلامك الكبيرة إلى خطوات يومية قابلة للتنفيذ

![Version](https://img.shields.io/badge/version-1.0.0-teal)
![License](https://img.shields.io/badge/license-MIT-green)
![AI](https://img.shields.io/badge/AI-Groq%20Llama%203.3-purple)
![Lang](https://img.shields.io/badge/language-Arabic%20%7C%20English-orange)

---

## 🎯 ما هو أثر؟

**أثر** هو تطبيق إنتاجية مدعوم بالذكاء الاصطناعي يعمل كـ"مرشد حكيم" يساعدك على:

- 🎯 تحويل حلمك الكبير إلى خطة **30 يوم** واقعية
- 📋 تحديد مهامك اليومية الأولوية بدون تشتت
- 🔥 بناء عادات الانضباط من خلال نظام الـ Streak
- 🧠 الحصول على نصائح سياقية من المرشد الذكي

---

## ✨ المميزات

| الميزة | الوصف |
|--------|-------|
| 🧪 **مختبر الأهداف** | 5 أسئلة ذكية لفهم حلمك وبناء خطتك |
| 🗓️ **خطة 30 يوم** | AI يبني جدولاً يومياً كاملاً مخصصاً لك |
| ✅ **مهام يومية** | Skip / تأجيل / إكمال مع تتبع الأسباب |
| 🧠 **المرشد الذكي** | 5 أزرار سياقية: تحفيز، تحليل، إعادة جدولة... |
| 📊 **سجل التقدم** | إحصائيات + تقويم ملوّن شهري |
| 🔥 **نظام Streak** | تتبع الأيام المتتالية لبناء الانضباط |

---

## 🚀 التشغيل السريع

### متطلبات
- مفتاح [Groq API](https://console.groq.com) (مجاني)
- [Deno](https://deno.land) لتشغيل الـ Backend

### الخطوات

```bash
# 1. استنسخ المشروع
git clone https://github.com/YOUR_USERNAME/athar-app.git
cd athar-app

# 2. أضف مفاتيح API
cp .env.example .env
# عدّل .env وأضف مفتاح Groq

# 3. شغّل الـ Backend
deno run --allow-net --allow-env functions/atharAI.ts

# 4. افتح index.html في المتصفح
# أو شغّل local server:
python -m http.server 8080
# ثم افتح: http://localhost:8080
```

---

## 🏗️ هيكل المشروع

```
athar-app/
├── index.html              # التطبيق الكامل (Single Page App)
├── functions/
│   └── atharAI.ts          # Backend AI (Deno + Groq)
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ متغيرات البيئة

```env
# Groq API Key — from https://console.groq.com
GROQ_API_KEY=gsk_...
```

---

## 🤖 AI Actions المتاحة

| Action | الوصف |
|--------|-------|
| `generatePlan` | يبني خطة 30 يوم كاملة من الحلم |
| `mentorAction` | ردود المرشد (تحفيز، تحليل، جدولة...) |
| `eveningReview` | رسالة مساء حسب إنجاز اليوم |

---

## 🎨 هوية التصميم

- **الألوان:** Navy Blue + Teal + Charcoal Gray
- **الخط:** Cairo (عربي)
- **الاتجاه:** RTL (عربي أولاً)
- **التصميم:** Mobile-First, Dark Theme, Zero-Distraction UI

---

## 🌐 النشر على Vercel / Netlify

1. ارفع المشروع على GitHub
2. اربطه بـ Vercel أو Netlify
3. أضف `GROQ_API_KEY` في متغيرات البيئة
4. انشر! 🎉

---

## 📄 الرخصة

MIT License — حر الاستخدام والتطوير
