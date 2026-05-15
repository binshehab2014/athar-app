import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') || '';

async function callGroq(messages: object[], jsonMode = false, maxTokens = 4096) {
  const body: any = {
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: 0.7,
    max_tokens: maxTokens,
  };
  if (jsonMode) body.response_format = { type: 'json_object' };

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action, ...params } = body;

    // ── GENERATE 30-DAY PLAN ─────────────────────────────────────────────────
    if (action === 'generatePlan') {
      const { dream, duration = 30, purpose, daily_time } = params;

      const systemPrompt = `أنت "المخطط الاستراتيجي لأثر" — مدرب حياة متمرس وخبير في إدارة المشاريع.
مهمتك: تحويل حلم المستخدم إلى خارطة طريق واقعية وقابلة للتنفيذ.

القواعد الصارمة:
1. أعد JSON صحيحاً فقط بالتنسيق المطلوب
2. جميع النصوص بالعربية الفصحى الحديثة
3. المهام يجب أن تكون قابلة للتنفيذ وتستغرق ${daily_time} أو أقل يومياً
4. المهام تتدرج وتبني على بعضها
5. النبرة: المرشد الحكيم — محفز، مهني، ومتفهم

التنسيق المطلوب:
{
  "goal_summary": "ملخص ملهم قصير للهدف",
  "milestones": [
    {"week": 1, "focus": "عنوان محور الأسبوع", "description": "وصف قصير"}
  ],
  "daily_tasks": [
    {
      "day": 1,
      "week": 1,
      "tasks": ["المهمة الأولى", "المهمة الثانية"],
      "mentor_note": "ملاحظة المرشد اليومية المحفزة"
    }
  ]
}`;

      const userPrompt = `الحلم: ${dream}
المدة: ${duration} يوماً
الهدف من الحلم: ${purpose}
الوقت اليومي المتاح: ${daily_time}

قم ببناء خطة ${duration} يوم كاملة مع مهام يومية.`;

      const text = await callGroq(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        true,
        8000
      );

      const plan = JSON.parse(text);
      return Response.json({ success: true, plan });
    }

    // ── MENTOR ACTIONS ───────────────────────────────────────────────────────
    if (action === 'mentorAction') {
      const { type, goalTitle, pendingTasks, completedToday, streak } = params;

      const prompts: Record<string, string> = {
        reschedule: `المستخدم لديه مهام معلقة: ${pendingTasks?.join('، ')}. اقترح جدولة ذكية لإعادة توزيعها على الأيام القادمة. كن محدداً وعملياً. الرد بالعربية.`,
        lighten: `المستخدم يشعر بالإرهاق من خطة "${goalTitle}". اقترح طريقة لتخفيف الحمل دون التخلي عن الهدف. الرد بالعربية بنبرة المرشد الحكيم.`,
        challenge: `المستخدم يريد رفع التحدي في رحلة "${goalTitle}". أكمل ${completedToday} مهام اليوم. اقترح تصعيداً مناسباً. الرد بالعربية.`,
        analyze_failure: `المستخدم يريد تحليل إخفاقاته. المهام المؤجلة: ${pendingTasks?.join('، ')}. حلل أسباب التأخير المحتملة واقترح حلولاً عملية. الرد بالعربية.`,
        motivate: `المستخدم يحتاج دفعة تحفيزية في رحلة "${goalTitle}". سلسلة النجاح الحالية: ${streak} أيام. اكتب رسالة تحفيزية قوية ومخصصة. الرد بالعربية.`,
      };

      const text = await callGroq([
        {
          role: 'system',
          content: 'أنت المرشد الذكي في تطبيق أثر. نبرتك: حكيم، محفز، مهني، وإنساني. ردودك موجزة ومؤثرة.',
        },
        { role: 'user', content: prompts[type] || prompts.motivate },
      ]);

      return Response.json({ success: true, message: text });
    }

    // ── EVENING REVIEW MESSAGE ───────────────────────────────────────────────
    if (action === 'eveningReview') {
      const { completed, total, goalTitle, streak } = params;
      const success = completed === total;
      const partial = completed > 0 && completed < total;

      let prompt = '';
      if (success) {
        prompt = `المستخدم أنجز جميع مهامه اليوم (${completed}/${total}) في رحلة "${goalTitle}". سلسلة النجاح: ${streak} أيام. اكتب رسالة مساء إيجابية ومحفزة للاستمرار.`;
      } else if (partial) {
        prompt = `المستخدم أنجز ${completed} من ${total} مهام في رحلة "${goalTitle}". اكتب رسالة مساء متفهمة ومحفزة لإنهاء المتبقي أو الالتزام غداً.`;
      } else {
        prompt = `المستخدم لم ينجز أي مهمة اليوم في رحلة "${goalTitle}". اكتب رسالة مساء إنسانية تدعوه للعودة بصدق دون إشعاره بالذنب المفرط.`;
      }

      const text = await callGroq([
        {
          role: 'system',
          content: 'أنت المرشد الذكي في تطبيق أثر. نبرتك: حكيم، إنساني، ومحفز. الرسائل المسائية قصيرة ومؤثرة.',
        },
        { role: 'user', content: prompt },
      ]);

      return Response.json({ success: true, message: text, status: success ? 'success' : partial ? 'partial' : 'failed' });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
