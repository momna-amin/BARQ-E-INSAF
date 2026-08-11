const handleChat = async (req, res) => {
  try {
    const { message, model, temperature } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const query = message.trim();
    const queryLower = query.toLowerCase();

    // 1. Check if GROQ_API_KEY is available for LLM inference
    if (process.env.GROQ_API_KEY) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: model || 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: 'You are Barq-e-Insaf AI Legal Assistant, an expert AI on Pakistan Legal Law, Pakistan Penal Code (PPC), Code of Civil Procedure (CPC), Code of Criminal Procedure (CrPC), Sindh High Court Rules, and Family Laws. Answer legal questions accurately in Urdu, Sindhi, or English.'
              },
              { role: 'user', content: query }
            ],
            temperature: temperature || 0.3,
            max_tokens: 1000
          })
        });

        const groqData = await groqRes.json();
        if (groqData.choices && groqData.choices[0]?.message?.content) {
          return res.json({
            answer: groqData.choices[0].message.content,
            response: groqData.choices[0].message.content,
            sources: [{ source: 'Pakistan Legal Code & Constitution', page: 'Statutes' }]
          });
        }
      } catch (llmErr) {
        console.warn('Groq LLM call failed, switching to legal knowledge engine:', llmErr.message);
      }
    }

    // 2. Intelligent Legal Knowledge Engine (Pakistan & Sindh Legal System)
    let reply = '';
    let sources = [];

    if (queryLower.includes('khula') || queryLower.includes('divorce') || queryLower.includes('طلاق') || queryLower.includes('خلع')) {
      reply = `**Family Law / Khula (خلع):**\n` +
        `• Under the Dissolution of Muslim Marriages Act 1939 and Muslim Family Laws Ordinance 1961, a woman can file for Khula in the Family Court.\n` +
        `• **Procedure:** File a suit in the Family Court of your district. Court attempts reconciliation. If reconciliation fails, Khula decree is granted upon relinquishing dower (Meher).\n` +
        `• **Relevant Law:** Family Courts Act 1964.\n` +
        `You can connect with verified family advocates (like Miss Nadia Memon) on Barq-e-Insaf for legal representation.`;
      sources = [{ source: 'Muslim Family Laws Ordinance 1961', page: 'Section 7-9' }, { source: 'Family Courts Act 1964', page: 'Schedule 1' }];
    }
    else if (queryLower.includes('check') || queryLower.includes('489-f') || queryLower.includes('cheque') || queryLower.includes('چیک')) {
      reply = `**PPC Section 489-F (Dishonest Issuance of Cheque):**\n` +
        `• Dishonestly issuing a cheque that bounces carries punishment up to 3 years imprisonment or fine or both.\n` +
        `• **Requirements:** Dishonest intention, cheque issued towards payment of loan/obligation, cheque returned unpaid by bank.\n` +
        `• **Remedy:** Register FIR at police station or file private complaint under CrPC 200 in magistrate court.`;
      sources = [{ source: 'Pakistan Penal Code (PPC 1860)', page: 'Section 489-F' }];
    }
    else if (queryLower.includes('property') || queryLower.includes('land') || queryLower.includes('جائیداد') || queryLower.includes('قبضہ') || queryLower.includes('plot')) {
      reply = `**Property & Land Dispute Laws in Sindh:**\n` +
        `• **Illegal Dispossession Act 2005:** Provides quick relief against land grabbers/illegal occupants before Sessions Court.\n` +
        `• **Specific Relief Act 1877 (Section 8 & 9):** For recovery of possession of immovable property.\n` +
        `• **Sindh Land Revenue Act 1967:** Governs mutation (Intiqal), partition (Takseem), and revenue records.\n` +
        `You can consult verified High Court Advocates on Barq-e-Insaf (e.g. Miss Aysha Begum) for title verification & court stays.`;
      sources = [{ source: 'Illegal Dispossession Act 2005', page: 'Section 3-5' }, { source: 'Specific Relief Act 1877', page: 'Section 8-9' }];
    }
    else if (queryLower.includes('bail') || queryLower.includes('ضمانت') || queryLower.includes('fir')) {
      reply = `**Bail Law in Pakistan (CrPC):**\n` +
        `• **Pre-Arrest Bail (CrPC Section 498):** Granted by Sessions Court or High Court to prevent unlawful arrest.\n` +
        `• **Post-Arrest Bail (CrPC Section 497):** Applied after arrest. Non-bailable offences with punishment less than 10 years are generally granted bail under statutory right.\n` +
        `• **Protective Bail:** High Court grants protective bail to allow accused to surrender before relevant trial court.`;
      sources = [{ source: 'Code of Criminal Procedure (CrPC 1898)', page: 'Section 497 & 498' }];
    }
    else if (queryLower.includes('lawyer') || queryLower.includes('advocate') || queryLower.includes('sbc') || queryLower.includes('وکالت') || queryLower.includes('وکیل')) {
      reply = `**Lawyer & SBC Verification on Barq-e-Insaf:**\n` +
        `• All lawyers on Barq-e-Insaf are cross-verified against Sindh Bar Council (SBC) registration numbers.\n` +
        `• High Court Advocates (e.g. Miss Aysha Begum - SBC 20345, Mr. Nasrullah - SBC 475) can represent clients in Sindh High Court & District Courts.\n` +
        `• You can view verified advocate profiles, license numbers, experience, and book consultations directly through the portal.`;
      sources = [{ source: 'Legal Practitioners & Bar Councils Act 1973', page: 'Section 22-28' }];
    }
    else if (queryLower.includes('urdu') || queryLower.includes('اردو') || queryLower.includes('سلام') || queryLower.includes('السلام')) {
      reply = `وعلیکم السلام! برقِ انصاف اے آئی اسسٹنٹ میں خوش آمدید۔\n` +
        `آپ پاکستان کے قوانین (فوجداری، دیوانی، خاندانی قوانین، اور جائیداد کے امور) کے بارے میں سوال پوچھ سکتے ہیں۔\n` +
        `اگر آپ کو عدالت کے لیے وکالت کی ضرورت ہے تو برقِ انصاف پر موجود سندھ بار کونسل سے تصدیق شدہ وکلاء سے رابطہ کریں۔`;
      sources = [{ source: 'قانونِِ پاکستان آئین 1973', page: 'دفعات' }];
    }
    else {
      reply = `**Barq-e-Insaf Legal Guidance:**\n` +
        `Thank you for reaching out to Barq-e-Insaf AI Assistant.\n` +
        `• For questions on Pakistan Penal Code (PPC), Family Law, Property Disputes, or Constitutional Rights under the Constitution of Pakistan 1973, ask your query in English, Urdu, or Sindhi.\n` +
        `• For formal representation before Sindh High Court or District Courts, browse verified advocates on the Barq-e-Insaf platform.`;
      sources = [{ source: 'Constitution of Pakistan 1973', page: 'Articles 4 & 10A' }];
    }

    return res.json({
      answer: reply,
      response: reply,
      sources: sources
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { handleChat };
