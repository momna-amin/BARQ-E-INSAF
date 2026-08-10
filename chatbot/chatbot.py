import os
from dotenv import load_dotenv
from groq import Groq
import chromadb
from chromadb.utils import embedding_functions

load_dotenv()

# We retrieve the API key from environment
api_key = os.getenv("GROQ_API_KEY")
client = None
if api_key:
    client = Groq(api_key=api_key)

chroma_client = chromadb.PersistentClient(path="./chroma_db")
embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)
collection = chroma_client.get_or_create_collection(
    name="pakistan_law",
    embedding_function=embed_fn
)

def is_basic_greeting(question):
    q = question.lower().strip()
    greetings = ["hi", "hello", "hey", "salam", "assalam", "assalamualaikum", "good morning", "good evening", "how are you", "who are you", "what are you", "thanks", "thank you", "ok", "okay"]
    if len(q.split()) <= 4:
        for g in greetings:
            if q.startswith(g) or q == g:
                return True
    return False

def retrieve_relevant_law(question, n_results=5):
    """Queries ChromaDB and returns document chunks and their metadatas."""
    if is_basic_greeting(question):
        return [], []
        
    try:
        results = collection.query(query_texts=[question], n_results=n_results)
        
        # Check if we got any results
        if not results or not results.get("documents") or len(results["documents"][0]) == 0:
            return [], []
            
        chunks = results["documents"][0]
        metadatas = results["metadatas"][0]
        return chunks, metadatas
    except Exception as e:
        print(f"Error querying ChromaDB: {e}")
        return [], []

def ask_legal_question(question, model_name="llama-3.3-70b-versatile", temperature=0.3, n_results=5, language="Auto-Detect"):
    """
    Retrieves law chunks, queries the Groq API model, and returns a structured response.
    """
    global client
    if not client:
        # Retry initializing client if key was set late
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            client = Groq(api_key=api_key)
        else:
            return {
                "answer": "Error: GROQ_API_KEY is not set in your environment or .env file. Please configure it to use the chatbot.",
                "sources": []
            }

    chunks, metadatas = retrieve_relevant_law(question, n_results=n_results)

    # Format sources for prompt context and for return value
    formatted_sources = []
    context_parts = []
    
    for idx, (chunk, meta) in enumerate(zip(chunks, metadatas)):
        source_name = meta.get("source", "Unknown Document")
        page_num = meta.get("page", "N/A")
        
        # Format for LLM context
        context_parts.append(f"[Document: {source_name} | Page: {page_num}]\n{chunk}")
        
        # Format for UI display
        formatted_sources.append({
            "id": f"src_{idx}",
            "source": source_name,
            "page": page_num,
            "text": chunk
        })

    context = "\n\n---\n\n".join(context_parts) if context_parts else "No direct law chunks found in the database. Rely on general Pakistani property and family law."

    system_prompt = """You are "Barq-e-Insaf" - a legal information assistant specialized in Pakistan's 
Property and Family law (including marriage, divorce/talaq, khula, child custody, inheritance/virasat, 
land disputes, property transfer, possession/kabza cases) specifically tailored for Sindh, Pakistan.

Rules:
1. Answer primarily using the provided legal context below.
2. If the context doesn't fully cover the question, you may use general legal knowledge about 
   Pakistani law (especially Sindh-specific variations if applicable), but clearly state "based on general legal knowledge" when doing so.
3. Mention the relevant law/section/ordinance when possible (e.g. "under Section 7 of the Muslim Family Laws Ordinance 1961").
4. Always end with a standard disclaimer: "This is general legal information, not a substitute for consulting a licensed lawyer."
5. Keep language simple, structured, and easy to understand for citizens without a legal background. Use bullet points for steps where helpful.
6. Support ONLY these three languages:
   - English
   - Urdu (اردو)
   - Sindhi (سنڌي)
   Do NOT use Roman Urdu, Hindi, or any other language.
7. Ensure clean, natural legal terminology and correct vocabulary:
   - For URDU: Use pure, correct Urdu words. For example, use "والد" (walid) or "باپ" (baap) for father. NEVER use Hindi words like "پیتا" (pita). Use "معاہدہ" (muahida) for contract/agreement, "تنازعہ" (tanazia) for dispute, and "اطلاع/نوٹس" (itla/notice) for notice.
   - For SINDHI: You must respond in the correct Arabic-based Sindhi script using standard Sindhi alphabets (with letters like ٻ, ڀ, ٺ, ڇ, ڌ, ڊ, ڍ, ڙ, ڦ, etc.). Use correct Sindhi terms: use "پيُءُ" (piu) or "والد" (walid) for father, "معاهدو" (muahido) or "اقرارنامو" (iqrarnamo) for agreement, "تڪرار" (takrar) or "مسئلو" (maslo) for dispute, and "نوٽيس/اطلاع" (notice/itla) for notice.
8. Be empathetic - family and property disputes are emotionally difficult for people.
"""

    user_message = f"""Legal context from Pakistan laws:
{context}

Question: {question}
"""

    # Append strict language instruction if specified
    if language and language != "Auto-Detect":
        user_message += f"\n\n[Language Requirement: You must answer this question completely in {language}.]"
    else:
        user_message += "\n\n[Language Requirement: Answer in the same language the user used (either English, Urdu, or Sindhi).]"

    try:
        response = client.chat.completions.create(
            model=model_name,
            max_tokens=1200,
            temperature=temperature,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        answer = response.choices[0].message.content
        return {
            "answer": answer,
            "sources": formatted_sources
        }
    except Exception as e:
        print(f"Error querying Groq LLM: {e}")
        return {
            "answer": f"Error communicating with the AI service: {str(e)}",
            "sources": formatted_sources
        }

if __name__ == "__main__":
    print("=== Barq-e-Insaf Legal Chatbot (Refactored Test Mode) ===")
    while True:
        q = input("\nSawal puchen (ya 'exit' likhen): ")
        if q.lower() == "exit":
            break
        res = ask_legal_question(q)
        print("\n=== ANSWER ===")
        print(res["answer"])
        print("\n=== SOURCES CITED ===")
        for src in res["sources"]:
            print(f"- {src['source']} (Page {src['page']})")