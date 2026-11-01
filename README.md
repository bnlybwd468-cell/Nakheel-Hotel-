# تطبيق النخيل الفندقي — NEXORA

موقع ثابت (HTML + Firebase) يعمل على GitHub Pages. يبدأ **فارغًا تمامًا**: لا غرف ولا أسعار ولا بيانات تجريبية.

## الملفات
- `index.html` واجهة العملاء، `admin.html` لوحة الإدارة.
- `firebase-config.js` **الملف الوحيد** لربط Firebase. غيّره لتغيير المشروع.
- `firestore.rules` قواعد الحماية، `app.js` و`style.css` مشتركة.

## 1) إعداد Firebase
1. أنشئ مشروعًا في console.firebase.google.com ثم أضف تطبيق ويب وانسخ الإعدادات إلى `firebase-config.js`.
2. فعّل **Authentication ← Email/Password**، وأنشئ **Cloud Firestore**.
3. الصق محتوى `firestore.rules` في Firestore ← Rules ثم انشر (أو `firebase deploy --only firestore:rules`).
4. أنشئ مستخدمًا للمالك من Authentication ← Users.
5. أول مالك: سجّل الدخول من `admin.html` فتظهر رسالة فيها معرّفك (UID). في Firestore أنشئ مجموعة `admins` ووثيقة معرّفها هذا الـ UID بحقل `role` = `owner` (نص). بعدها أضف بقية الموظفين من تبويب «الموظفون».

## 2) النشر على GitHub
1. أنشئ مستودعًا وارفع محتويات هذا المجلد.
2. Settings ← Pages ← Source: `main` / root.
3. في Firebase ← Authentication ← Settings ← Authorized domains أضف `username.github.io`.
الإدارة على `/admin.html`.

## 3) نقل الملكية
- غيّر `firebase-config.js` ليشير لمشروع المالك الجديد، أو أضف المالك الجديد في Firebase ← Project settings ← Users and permissions بدور Owner، وانقل الفوترة، ثم اختبر دخوله قبل إزالة المطوّر.
- نقل البيانات: Firestore ← Export/Import عبر gcloud إلى bucket المشروع الجديد، وتحقق من الأعداد قبل إيقاف القديم.
- GitHub: انقل المستودع من Settings ← Transfer ownership.
- الخدمات الخارجية: Firebase (Auth, Firestore)، GitHub Pages، Google Fonts.

## حدود هذه النسخة (يلزم تطويرها لاحقًا)
- الصور بروابط (Firebase Storage غير مفعّل بعد).
- الواجهة عربية فقط؛ دعم الإنجليزية لم يُضف.
- القسم المالي مبسّط: المدفوع والمستحق فقط، بلا مصروفات أو استردادات أو خصومات.
- منع التعارض يتم في لوحة الإدارة عند التأكيد، لا في الخادم. فرضه بالكامل يحتاج Cloud Functions.
- لا يوجد سجل للعمليات الإدارية سوى سجل تعديل كل حجز، ولا إشعارات FCM.
