import os
import re

directories = [
    r"c:\Users\aviroop\Desktop\athlete-management\src\components\coach",
    r"c:\Users\aviroop\Desktop\athlete-management\src\components\athlete",
    r"c:\Users\aviroop\Desktop\athlete-management\src\components\admin",
    r"c:\Users\aviroop\Desktop\athlete-management\src\components\layout",
]

replacements = {
    r'hover:bg-\[\#1F2937\]/30': 'hover:bg-accent',
    r'hover:bg-\[\#1F2937\]/50': 'hover:bg-accent',
    r'hover:bg-\[\#1F2937\]/80': 'hover:bg-accent',
    r'hover:bg-\[\#1F2937\]': 'hover:bg-accent',
    r'hover:bg-\[\#374151\]/50': 'hover:bg-accent',
    r'hover:bg-\[\#374151\]': 'hover:bg-accent',
    
    r'bg-\[\#1F2937\]/30': 'bg-muted/50',
    r'bg-\[\#1F2937\]/50': 'bg-muted',
    r'bg-\[\#1F2937\]/60': 'bg-muted',
    r'bg-\[\#1F2937\]/80': 'bg-muted',
    r'bg-\[\#1F2937\]': 'bg-secondary',
    r'bg-\[\#374151\]/50': 'bg-muted',
    r'bg-\[\#374151\]': 'bg-accent',
    
    r'border-\[\#11141A\]': 'border-background',
    r'text-\[\#E5E7EB\]': 'text-foreground',
    
    r'background=1F2937': 'background=random',
    
    r'stroke="#1F2937"': 'stroke="currentColor" className="opacity-10"',
    r'stroke="#9CA3AF"': 'stroke="currentColor" className="opacity-50"'
}

for directory in directories:
    if os.path.exists(directory):
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith(".tsx"):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    for pattern, replacement in replacements.items():
                        new_content = re.sub(pattern, replacement, new_content)
                        
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated {file}")

print("Done replacing secondary colors!")
