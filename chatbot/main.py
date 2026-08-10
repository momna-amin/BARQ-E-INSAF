import os
import sys
import glob
from flask import Flask, request, jsonify, send_from_directory
from chatbot import ask_legal_question, collection
from ingest import ingest_pdfs

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"Failed to initialize Supabase client: {e}")
    supabase = None

# Try importing flask_cors, add fallback if missing
try:
    from flask_cors import CORS
    has_cors = True
except ImportError:
    has_cors = False

app = Flask(__name__, static_folder='static', static_url_path='')

if has_cors:
    CORS(app)
else:
    # Manual CORS fallback to support React Native API calls
    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
        return response

# Serve static frontend
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    message = data.get('message', '')
    model = data.get('model', 'llama-3.3-70b-versatile')
    temperature = float(data.get('temperature', 0.3))
    n_results = int(data.get('n_results', 5))
    language = data.get('language', 'Auto-Detect')
    
    if not message.strip():
        return jsonify({"error": "Message is required"}), 400
        
    print(f"Chat request: '{message}' | Model: {model} | Temp: {temperature} | Lang: {language}")
    
    # 1. First, get the answer from the AI
    response = ask_legal_question(
        question=message,
        model_name=model,
        temperature=temperature,
        n_results=n_results,
        language=language
    )
    
    # 2. Then, save the conversation to Supabase
    if supabase:
        try:
            supabase.table("chat_history").insert({
                "user_message": message,
                "ai_response": response.get("answer", ""),
                "language": language
            }).execute()
            print("Successfully saved chat to Supabase!")
        except Exception as e:
            print(f"Error saving to Supabase: {e}")
            
    # 3. Finally, send the answer back to the frontend
    return jsonify(response)

@app.route('/api/status', methods=['GET'])
def status():
    # Scan raw_pdfs directory
    pdf_dir = "./data/raw_pdfs"
    pdf_files = glob.glob(os.path.join(pdf_dir, "*.pdf"))
    
    files_status = []
    total_chunks = 0
    
    try:
        total_chunks = collection.count()
    except Exception as e:
        print(f"Error counting collection: {e}")
        
    for pdf_path in pdf_files:
        filename = os.path.basename(pdf_path)
        size_mb = round(os.path.getsize(pdf_path) / (1024 * 1024), 2)
        
        # Check if this file is ingested by searching ChromaDB with a metadata filter
        try:
            res = collection.get(where={"source": filename}, limit=1)
            is_ingested = len(res.get("ids", [])) > 0
        except Exception as e:
            print(f"Error checking status for {filename}: {e}")
            is_ingested = False
            
        files_status.append({
            "name": filename,
            "size_mb": size_mb,
            "ingested": is_ingested
        })
        
    return jsonify({
        "document_count": total_chunks,
        "files": files_status,
        "api_key_set": os.getenv("GROQ_API_KEY") is not None
    })

@app.route('/api/ingest', methods=['POST'])
def run_ingest():
    print("Ingestion triggered via API...")
    try:
        ingest_pdfs()
        # Get updated status
        total_chunks = collection.count()
        return jsonify({
            "status": "success",
            "message": "Ingestion completed successfully",
            "document_count": total_chunks
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Ingestion failed: {str(e)}"
        }), 500

if __name__ == '__main__':
    print("Starting Barq-e-Insaf Chatbot API server on http://127.0.0.1:5000 ...")
    app.run(host='0.0.0.0', port=5000, debug=True)