// Application State
let currentSources = [];
let isSubmitting = false;

// DOM Elements
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const modelSelect = document.getElementById("model-select");
const langSelect = document.getElementById("lang-select");
const tempSlider = document.getElementById("temp-slider");
const tempValue = document.getElementById("temp-value");
const fileList = document.getElementById("file-list");
const chunkCount = document.getElementById("chunk-count");
const reingestBtn = document.getElementById("reingest-btn");
const inspectorPane = document.getElementById("inspector-pane");
const inspectorBody = document.getElementById("inspector-body");
const closeInspectorBtn = document.getElementById("close-inspector-btn");
const toast = document.getElementById("toast");

// Check if admin mode is enabled via URL parameters
const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get('admin') === 'true';

// Setup Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    if (isAdmin) {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'block';
        });
        fetchStatus();
    }
    
    // Slider value update
    tempSlider.addEventListener("input", (e) => {
        tempValue.textContent = e.target.value;
    });

    // Auto-grow textarea
    chatInput.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight - 16) + "px";
    });

    // Handle Enter to submit, Shift+Enter for newline
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event("submit"));
        }
    });

    // Chat form submit
    chatForm.addEventListener("submit", handleChatSubmit);

    // Re-ingest button click
    reingestBtn.addEventListener("click", handleReingest);

    // Inspector close button
    closeInspectorBtn.addEventListener("click", closeInspector);

    // Dynamic prompt chips click handler
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("prompt-chip")) {
            const question = e.target.getAttribute("data-question");
            chatInput.value = question;
            chatInput.dispatchEvent(new Event("input")); // trigger auto-grow
            chatInput.focus();
        }
    });
});

// Toast notification helper
function showToast(message, type = "success") {
    toast.className = `toast ${type} show`;
    toast.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
        <span>${message}</span>
    `;
    lucide.createIcons();
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}

// Check if string contains RTL (Urdu/Sindhi) script
function isRtlText(text) {
    const rtlPattern = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlPattern.test(text);
}

// Simple Markdown to HTML Formatter
function parseMarkdown(text) {
    if (!text) return "";
    let html = text;
    
    // Escaping html characters
    html = html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
        
    // Format bold text (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Split text into lines to process lists
    const lines = html.split('\n');
    let inList = false;
    let listType = null; // 'ul' or 'ol'
    let newLines = [];
    
    for (let line of lines) {
        let trimmed = line.trim();
        
        // Bullet list
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            if (!inList || listType !== 'ul') {
                if (inList) newLines.push(`</${listType}>`);
                newLines.push('<ul>');
                inList = true;
                listType = 'ul';
            }
            newLines.push(`<li>${trimmed.substring(2)}</li>`);
        } 
        // Numbered list (e.g. 1. text)
        else if (/^\d+\.\s/.test(trimmed)) {
            if (!inList || listType !== 'ol') {
                if (inList) newLines.push(`</${listType}>`);
                newLines.push('<ol>');
                inList = true;
                listType = 'ol';
            }
            const content = trimmed.replace(/^\d+\.\s/, '');
            newLines.push(`<li>${content}</li>`);
        } 
        // Normal paragraph/text line
        else {
            if (inList) {
                newLines.push(`</${listType}>`);
                inList = false;
                listType = null;
            }
            newLines.push(line);
        }
    }
    
    if (inList) {
        newLines.push(`</${listType}>`);
    }
    
    html = newLines.join('\n');
    
    // Replace newline with br (except around structural tags)
    html = html.replace(/\n/g, '<br>');
    html = html.replace(/<br><ul>/g, '<ul>');
    html = html.replace(/<\/ul><br>/g, '</ul>');
    html = html.replace(/<br><ol>/g, '<ol>');
    html = html.replace(/<\/ol><br>/g, '</ol>');
    html = html.replace(/<li>(.*?)<\/li><br>/g, '<li>$1</li>');
    
    return html;
}

// Fetch DB status & PDF files
async function fetchStatus() {
    try {
        const res = await fetch("/api/status");
        const data = await res.json();
        
        chunkCount.textContent = data.document_count || 0;
        
        // Render file list in sidebar
        fileList.innerHTML = "";
        
        if (!data.files || data.files.length === 0) {
            fileList.innerHTML = `<li class="loading-files">No PDFs in data/raw_pdfs</li>`;
            return;
        }
        
        data.files.forEach(file => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="file-info">
                    <div class="file-name" title="${file.name}">${file.name}</div>
                    <div class="file-meta">${file.size_mb} MB</div>
                </div>
                <span class="status-badge ${file.ingested ? 'ingested' : 'pending'}">
                    ${file.ingested ? 'Ingested' : 'Pending'}
                </span>
            `;
            fileList.appendChild(li);
        });
        
        if (!data.api_key_set) {
            showToast("Warning: Groq API Key is not set in backend .env file!", "error");
        }
    } catch (err) {
        console.error("Error fetching server status:", err);
        fileList.innerHTML = `<li class="loading-files" style="color: #ef4444;">API server offline</li>`;
    }
}

// Handle trigger pdf ingestion
async function handleReingest() {
    reingestBtn.classList.add("spinning");
    reingestBtn.disabled = true;
    showToast("Starting PDF Ingestion... please wait.", "success");
    
    try {
        const res = await fetch("/api/ingest", {
            method: "POST"
        });
        const data = await res.json();
        
        if (data.status === "success") {
            showToast("All PDFs successfully ingested and embedded!", "success");
        } else {
            showToast(`Ingestion failed: ${data.message}`, "error");
        }
    } catch (err) {
        showToast("Error communicating with ingestion server.", "error");
    } finally {
        reingestBtn.classList.remove("spinning");
        reingestBtn.disabled = false;
        fetchStatus();
    }
}

// Handle Chat Form Submit
async function handleChatSubmit(e) {
    e.preventDefault();
    
    const messageText = chatInput.value.trim();
    if (!messageText || isSubmitting) return;
    
    isSubmitting = true;
    
    // Add User Message to UI
    appendMessage(messageText, "user");
    
    // Reset inputs
    chatInput.value = "";
    chatInput.style.height = "auto";
    
    // Add typing indicator
    const typingIndicator = appendTypingIndicator();
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Read state parameters
    const model = modelSelect.value;
    const temperature = tempSlider.value;
    const language = langSelect.value;
    
    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: messageText,
                model: model,
                temperature: temperature,
                language: language
            })
        });
        
        const data = await res.json();
        
        // Remove typing indicator
        typingIndicator.remove();
        
        if (data.error) {
            appendMessage(`Error: ${data.error}`, "bot", [], true);
        } else {
            appendMessage(data.answer, "bot", data.sources);
        }
    } catch (err) {
        typingIndicator.remove();
        appendMessage("Error communicating with legal API. Make sure the server is running.", "bot", [], true);
    } finally {
        isSubmitting = false;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Append Chat Message to DOM
function appendMessage(text, sender, sources = [], isError = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-msg`);
    
    // Detect RTL script (Urdu/Sindhi) for right-to-left formatting
    const isRtl = isRtlText(text);
    if (isRtl) {
        messageDiv.classList.add("urdu-text");
    }
    if (isError) {
        messageDiv.style.borderColor = "#ef4444";
    }

    const icon = sender === "user" ? "👤" : "⚖️";
    
    const parsedContent = parseMarkdown(text);
    
    let citationsHTML = "";
    if (sources && sources.length > 0) {
        citationsHTML = `
            <div class="citations-container">
                ${sources.map((src, i) => `
                    <button class="citation-tag" onclick="inspectSource(${i})">
                        <i data-lucide="file-text" style="width: 10px; height: 10px;"></i>
                        Reference ${i+1}: ${src.source} (p. ${src.page})
                    </button>
                `).join('')}
            </div>
        `;
        // Cache the latest query's sources globally
        currentSources = sources;
    }
    
    messageDiv.innerHTML = `
        <div class="msg-icon">${icon}</div>
        <div class="msg-content">
            <div class="msg-text">${parsedContent}</div>
            ${citationsHTML}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    lucide.createIcons();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Append Typing Indicator
function appendTypingIndicator() {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "bot-msg");
    messageDiv.innerHTML = `
        <div class="msg-icon">⚖️</div>
        <div class="msg-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    return messageDiv;
}

// Inspect Source Citation (Open right-hand inspector)
window.inspectSource = function(index) {
    const source = currentSources[index];
    if (!source) return;
    
    // Open Inspector panel
    inspectorPane.classList.add("active");
    
    inspectorBody.innerHTML = `
        <div class="source-detail-card">
            <div class="source-detail-header">
                <span>📄 ${source.source}</span>
                <span>Page: ${source.page}</span>
            </div>
            <div class="source-detail-text">${source.text}</div>
        </div>
    `;
};

// Close Inspector Pane
function closeInspector() {
    inspectorPane.classList.remove("active");
}
