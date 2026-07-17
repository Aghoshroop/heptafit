import os
import re

directory = r"c:\Users\aviroop\Desktop\athlete-management\src\components\coach\dreamy"

replacements = {
    # AthleteOverviewTable
    r'flex-1 flex flex-col min-h-0': 'flex flex-col',
    r'flex-1 overflow-y-auto no-scrollbar': 'mt-4',
    
    # DreamyAthleteList
    r'flex-1 flex flex-col h-full min-h-0': 'flex flex-col',
    r'flex-1 overflow-auto no-scrollbar relative min-h-0': 'relative',
    
    # TodaysScheduleTimeline
    r'flex-1 overflow-y-auto no-scrollbar relative pl-3': 'relative pl-3 mt-4',
    
    # RecentReportsList
    r'flex-1 overflow-y-auto no-scrollbar space-y-3': 'space-y-3 mt-4',
    
    # PendingInvitationsList
    r'flex-1 overflow-y-auto no-scrollbar p-5 space-y-4': 'p-5 space-y-4 mt-4',
    
    # DreamySystemPreferences
    r'flex-1 overflow-y-auto no-scrollbar space-y-5': 'space-y-5 mt-4',
    
    # AlertsAndNotificationsList
    r'flex-1 overflow-y-auto no-scrollbar space-y-4': 'space-y-4 mt-4',
    
    # Card outer wrappers that might be trapping height
    r'flex-1 flex flex-col h-\[250px\]': 'flex flex-col',
    r'flex flex-col h-\[150px\]': 'flex flex-col',
}

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

print("Done stripping scroll traps!")
