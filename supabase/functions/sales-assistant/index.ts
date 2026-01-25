import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

3. **Upselling ذكي**: اقترح خدمات إضافية مناسبة. مثلاً:
   - إذا طلب موقع ويب → اقترح SEO وإدارة محتوى
   - إذا طلب متجر إلكتروني → اقترح تسويق رقمي وهوية بصرية
   - إذا طلب تطبيق موبايل → اقترح موقع ويب وتسويق

4. **إنشاء عروض أسعار**: عند طلب العميل، أنشئ عرض سعر مفصل يتضمن:
   - تفاصيل الخدمات المطلوبة
   - السعر التقديري لكل خدمة
   - الجدول الزمني المتوقع
   - خصم خاص للباقات المتكاملة

5. **أسلوب التواصل**:
   - كن ودوداً ومحترفاً
   - استخدم اللغة العربية الفصحى البسيطة
   - أجب بإيجاز ووضوح
   - اختم كل رسالة بسؤال لمواصلة المحادثة

عند إنشاء عرض سعر، استخدم التنسيق التالي:

---
📋 **عرض سعر من BClick**

🎯 **الخدمات المطلوبة:**
[قائمة الخدمات]

💰 **التفاصيل المالية:**
[تفصيل الأسعار]

⏰ **الجدول الزمني:**
[المدة المتوقعة]

🎁 **عروض خاصة:**
[أي خصومات أو مزايا إضافية]

📞 للتأكيد والبدء، تواصل معنا الآن!
---`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing sales assistant request with", messages.length, "messages");

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد للاستمرار في استخدام المساعد الذكي." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "حدث خطأ في المعالجة، يرجى المحاولة مرة أخرى." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Streaming response back to client");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Sales assistant error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
