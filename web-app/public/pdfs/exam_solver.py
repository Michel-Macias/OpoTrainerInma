import re
import json
import os

# --- 1. Load Reference Texts ---
references = {}
files = {
    'CONSTITUCION': 'ref_consti.txt',
    'ADMIN_FORAL': 'ref_admin_foral.txt',
    'COCINA': 'ref_cocina.txt',
    'LORTAD': 'ref_lortad.txt' # If exists
}

print("Loading references...")
for key, filename in files.items():
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
            references[key] = f.read().lower()
            print(f"- Loaded {key}")

# --- 1b. Load Topics for Classification ---
topics = []
try:
    with open('../../src/data/topics.json', 'r') as f:
        topics = json.load(f)
        print(f"- Loaded {len(topics)} topics for classification")
except Exception as e:
    print(f"Warning: Could not load topics.json: {e}")

# ... (Previous parser code) ...

def classify_topic(question_text, topics_list):
    best_topic_id = 1 # Default to topic 1
    best_score = 0
    
    q_words = set(re.findall(r'\w+', question_text.lower()))
    ignored = {'el', 'la', 'los', 'las', 'de', 'del', 'en', 'y', 'o', 'que', 'se', 'a', 'un', 'una', 'es', 'son', 'segun', 'artículo'}
    q_keywords = q_words - ignored
    
    for topic in topics_list:
        score = 0
        topic_text = (topic['title'] + " " + topic['description']).lower()
        
        # Keyword matching
        for word in q_keywords:
            if word in topic_text:
                score += 1
                
        # Boost for explicit mentions ("Ley Foral 11/2019", "Constitución")
        if "constitución" in question_text.lower() and "constitución" in topic['title'].lower():
            score += 5
        if "11/2019" in question_text.lower() and "11/2019" in topic['title'].lower():
             score += 5
             
        if score > best_score:
            best_score = score
            best_topic_id = topic['id']
            
    return best_topic_id

def parse_exam(text):
    questions = []
    raw_blocks = re.split(r'\n(\d+)\.\s+', text)
    
    for i in range(1, len(raw_blocks), 2):
        q_num = raw_blocks[i]
        q_content = raw_blocks[i+1]
        
        options_split = re.split(r'\n[a-c]\)\s+', q_content)
        q_text = options_split[0].strip().replace('\n', ' ')
        
        matches = list(re.finditer(r'(?:\n|^)([a-c])\)\s+(.+?)(?=(?:\n[a-c]\))|(?:\n\d+\.)|$)', q_content, re.DOTALL))
        current_options = []
        for m in matches:
            current_options.append(m.group(2).strip().replace('\n', ' '))
            
        if len(current_options) >= 2:
             # AUTO-SOLVER logic
             analysis = analyze_answer(q_text, current_options, references)
             
             # TOPIC CLASSIFIER logic
             topic_id = classify_topic(q_text, topics)
             
             questions.append({
                 "id": int(q_num),
                 "topicId": topic_id,
                 "text": q_text,
                 "options": current_options,
                 "ai_analysis": analysis
             })
             
    return questions

def analyze_answer(question, options, refs):
    # Heuristic: Search for option text in references
    # Ideally we'd search for the question context + option text
    
    best_score = 0
    best_option_idx = -1
    rationale = "No match found"
    
    # Clean question keywords
    q_words = set(re.findall(r'\w+', question.lower()))
    ignored = {'el', 'la', 'los', 'las', 'de', 'del', 'en', 'y', 'o', 'que', 'se', 'a', 'un', 'una'}
    q_keywords = q_words - ignored

    for idx, opt in enumerate(options):
        score = 0
        opt_lower = opt.lower()
        
        # Determine context based on question keywords
        target_ref = ""
        # If question mentions "Constitución" -> search ref_consti
        # If question mentions "Ley Foral 11/2019" -> search ref_admin_foral
        # If question mentions "cocina", "alimentos" -> search ref_cocina
        
        search_space = ""
        if "constitución" in question.lower():
            search_space = refs.get('CONSTITUCION', '')
        elif "11/2019" in question.lower():
             search_space = refs.get('ADMIN_FORAL', '')
        elif any(w in question.lower() for w in ['cocina', 'alimento', 'higiene', 'temperatura']):
             search_space = refs.get('COCINA', '')
        else:
            search_space = " ".join(refs.values())
            
        if not search_space: continue
            
        # Check if option text appears in search space near question keywords?
        # Simple check: does the exact phrase of the option appear?
        if opt_lower in search_space:
            score += 10 # Exact match is strong indicator
            
        # Check frequency of option words in context of question
        # This is very basic.
        
        if score > best_score:
            best_score = score
            best_option_idx = idx
            rationale = f"Found precise text match in documents."
            
    return {
        "suggested_index": best_option_idx,
        "confidence": best_score,
        "rationale": rationale
    }

# --- 3. Execute ---
with open('temp_examen.txt', 'r', encoding='utf-8') as f:
    text = f.read()

parsed_data = parse_exam(text)
print(json.dumps(parsed_data, indent=2, ensure_ascii=False))
