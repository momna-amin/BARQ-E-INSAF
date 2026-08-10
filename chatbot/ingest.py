import os
import glob
import uuid
import sys
import chromadb
from chromadb.utils import embedding_functions

# Try importing pypdf, suggest installation if missing
try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf is not installed. Attempting to install it...")
    import subprocess
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
        from pypdf import PdfReader
        print("pypdf successfully installed!")
    except Exception as e:
        print(f"Failed to auto-install pypdf: {e}")
        print("Please run: pip install pypdf")
        sys.exit(1)

CHROMA_PATH = "./chroma_db"
PDF_DIR = "./data/raw_pdfs"
COLLECTION_NAME = "pakistan_law"

def chunk_text(text, chunk_size=800, chunk_overlap=150):
    """Splits text into chunks of chunk_size with chunk_overlap."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        # Try to find a space or newline to split cleanly
        if end < len(text):
            # Look for last space/newline in the last 100 characters of the chunk
            search_area = text[end-100:end]
            last_space = max(search_area.rfind(' '), search_area.rfind('\n'))
            if last_space != -1:
                end = end - 100 + last_space + 1
        
        chunks.append(text[start:end].strip())
        start = end - chunk_overlap
    return chunks

def ingest_pdfs():
    print(f"Initializing ChromaDB Client at {CHROMA_PATH}...")
    chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
    
    # Configure embedding function (SentenceTransformers all-MiniLM-L6-v2)
    print("Loading embedding function...")
    embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    
    collection = chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embed_fn
    )
    
    # Find all PDFs
    pdf_files = glob.glob(os.path.join(PDF_DIR, "*.pdf"))
    if not pdf_files:
        print(f"No PDF files found in {PDF_DIR}!")
        return
        
    print(f"Found {len(pdf_files)} PDF file(s) for ingestion.")
    
    for pdf_path in pdf_files:
        filename = os.path.basename(pdf_path)
        print(f"\nProcessing: {filename}...")
        
        try:
            reader = PdfReader(pdf_path)
            total_pages = len(reader.pages)
            print(f"Total pages: {total_pages}")
            
            documents = []
            metadatas = []
            ids = []
            
            for page_num in range(total_pages):
                page = reader.pages[page_num]
                text = page.extract_text()
                
                if not text or not text.strip():
                    continue
                
                # Split page text into overlapping chunks
                chunks = chunk_text(text)
                
                for idx, chunk in enumerate(chunks):
                    # Create a unique ID for this chunk
                    chunk_id = f"{filename}_p{page_num+1}_c{idx}"
                    
                    documents.append(chunk)
                    metadatas.append({
                        "source": filename,
                        "page": page_num + 1,
                        "chunk_index": idx
                    })
                    ids.append(chunk_id)
            
            if documents:
                print(f"Adding {len(documents)} chunks to ChromaDB...")
                # Add in batches to avoid API limits if file is massive
                batch_size = 100
                for i in range(0, len(documents), batch_size):
                    collection.upsert(
                        documents=documents[i:i+batch_size],
                        metadatas=metadatas[i:i+batch_size],
                        ids=ids[i:i+batch_size]
                    )
                print(f"Successfully ingested {filename}!")
            else:
                print(f"No text extracted from {filename}.")
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            
    print("\nIngestion complete! All files processed.")

if __name__ == "__main__":
    ingest_pdfs()
