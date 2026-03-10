import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://bclickagency.lovable.app",
  "https://id-preview--d468ffd3-3f4a-4ef5-be5d-9cb1eb3acf31.lovable.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

// Simple in-memory rate limiter (per-IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 15; // max requests per window
const RATE_WINDOW_MS = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `أنت مساعد مبيعات ذكي لوكالة BClick المتخصصة في الخدمات الرقمية. مهمتك هي:

1. **فهم احتياجات العميل**: اطرح أسئلة ذكية لفهم طبيعة مشروع العميل وميزانيته والجدول الزمني المطلوب.

2. **اقتراح الخدمات المناسبة**: بناءً على احتياجات العميل، اقترح الخدمات الأنسب من قائمة خدماتنا:
   - تصميم موقع ويب (من 5,000 إلى 25,000 جنيه)
   - تطوير تطبيق موبايل (من 15,000 إلى 50,000 جنيه)
   - تصميم هوية بصرية (من 3,000 إلى 15,000 جنيه)
   - تسويق رقمي (من 2,000 إلى 10,000 جنيه شهرياً)
   - تحسين محركات البحث SEO (من 2,500 إلى 8,000 جنيه شهرياً)
   - متجر إلكتروني (من 8,000 إلى 35,000 جنيه)
   - إدارة محتوى (من 3,000 إلى 12,000 جنيه شهرياً)

3. **Upselling ذكي**: اقترح خدمات إضافية مناسبة.

4. **إنشاء عروض أسعار**: عند طلب العميل، أنشئ عرض سعر مفصل.

5. **أسلوب التواصل**:
   - كن ودوداً ومحترفاً
   - استخدم اللغة العربية الفصحى البسيطة
   - أجب بإيجاز ووضوح
   - اختم كل رسالة بسؤال لمواصلة المحادثة`;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               req.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { messages } = body;

    // Input validation
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "طلب غير صالح" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Cap messages count
    const trimmedMessages = messages.slice(-MAX_MESSAGES);

    // Validate and sanitize each message
    for (const msg of trimmedMessages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return new Response(
          JSON.stringify({ error: "طلب غير صالح" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        msg.content = msg.content.slice(0, MAX_MESSAGE_LENGTH);
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "حدث خطأ في النظام. يرجى المحاولة لاحقاً." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...trimmedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد للاستمرار في استخدام المساعد الذكي." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "حدث خطأ في المعالجة، يرجى المحاولة مرة أخرى." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "حدث خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
