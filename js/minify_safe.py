import os

def remove_comments_and_minify(content):
    # States
    STATE_CODE = 0
    STATE_SLASH = 1
    STATE_BLOCK_COMMENT = 2
    STATE_BLOCK_COMMENT_ENDING = 3
    STATE_LINE_COMMENT = 4
    STATE_STRING_SINGLE = 5
    STATE_STRING_DOUBLE = 6
    STATE_STRING_BACKTICK = 7
    
    output = []
    state = STATE_CODE
    i = 0
    length = len(content)
    
    def is_escaped(cnt, idx):
        bs = 0
        k = idx - 1
        while k >= 0 and cnt[k] == '\\':
            bs += 1
            k -= 1
        return bs % 2 == 1

    while i < length:
        char = content[i]
        
        if state == STATE_CODE:
            if char == '/':
                state = STATE_SLASH
            elif char == "'":
                state = STATE_STRING_SINGLE
                output.append(char)
            elif char == '"':
                state = STATE_STRING_DOUBLE
                output.append(char)
            elif char == '`':
                state = STATE_STRING_BACKTICK
                output.append(char)
            else:
                output.append(char)
        
        elif state == STATE_SLASH:
            if char == '*':
                state = STATE_BLOCK_COMMENT
            elif char == '/':
                state = STATE_LINE_COMMENT
            else:
                output.append('/')
                output.append(char)
                state = STATE_CODE
                if char == "'": state = STATE_STRING_SINGLE
                elif char == '"': state = STATE_STRING_DOUBLE
                elif char == '`': state = STATE_STRING_BACKTICK

        elif state == STATE_BLOCK_COMMENT:
            if char == '*':
                state = STATE_BLOCK_COMMENT_ENDING
        
        elif state == STATE_BLOCK_COMMENT_ENDING:
            if char == '/':
                state = STATE_CODE
                output.append(' ')
            elif char == '*':
                pass
            else:
                state = STATE_BLOCK_COMMENT
        
        elif state == STATE_LINE_COMMENT:
            if char == '\n':
                state = STATE_CODE
                output.append('\n')
        
        elif state == STATE_STRING_SINGLE:
            output.append(char)
            if char == "'" and not is_escaped(content, i):
                state = STATE_CODE

        elif state == STATE_STRING_DOUBLE:
            output.append(char)
            if char == '"' and not is_escaped(content, i):
                state = STATE_CODE

        elif state == STATE_STRING_BACKTICK:
            output.append(char)
            if char == '`' and not is_escaped(content, i):
                state = STATE_CODE

        i += 1
    
    if state == STATE_SLASH:
        output.append('/')
        
    clean_content = "".join(output)
    
    # Minify: split by lines, trim
    lines = clean_content.split('\n')
    final_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped:
            final_lines.append(stripped)

    # Smart join: Remove newlines where safe
    result_lines = []
    if final_lines:
        current_line = final_lines[0]
        for next_line in final_lines[1:]:
            last_char = current_line[-1]
            if last_char in ';{},:':
                current_line += ' ' + next_line
            else:
                result_lines.append(current_line)
                current_line = next_line
        result_lines.append(current_line)
            
    return '\n'.join(result_lines)

def process_files(src_dir, dist_dir):
    print(f"Source: {src_dir}")
    print(f"Dest  : {dist_dir}")
    
    for root, dirs, files in os.walk(src_dir):
        if 'dist' in dirs:
            dirs.remove('dist')
            
        for file in files:
            if file.lower().endswith('.js'):
                filename = file.lower()
                if filename.startswith('minify') or filename.endswith('.py'):
                    continue

                src_path = os.path.join(root, file)
                rel_path = os.path.relpath(src_path, src_dir)
                dest_path = os.path.join(dist_dir, rel_path)
                
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                
                try:
                    with open(src_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except UnicodeDecodeError:
                    try:
                        with open(src_path, 'r', encoding='cp932') as f:
                            content = f.read()
                    except Exception as e:
                        print(f"ERROR reading {rel_path}: {e}")
                        continue
                
                try:
                    minified = remove_comments_and_minify(content)
                    with open(dest_path, 'w', encoding='utf-8') as f:
                        f.write(minified)
                    print(f"Processed: {rel_path}")
                except Exception as e:
                    print(f"ERROR minifying {rel_path}: {e}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Assuming script is in 'js/' or 'workspace/web_bullcon/js'
    # Correct base_dir detection
    if os.path.basename(current_dir) == 'js':
         base_dir = os.path.dirname(current_dir) # parent of js -> web_bullcon
         js_src = current_dir
         js_dist = os.path.join(current_dir, "dist")
    else:
         # Fallback default
         base_dir = r"c:\Users\taku-\workspace\web_bullcon"
         js_src = os.path.join(base_dir, "js")
         js_dist = os.path.join(base_dir, "js", "dist")
    
    process_files(js_src, js_dist)
