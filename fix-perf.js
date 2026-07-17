const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'src', 'components', 'home'),
  path.join(__dirname, 'src', 'components', '3d')
];

for (const dir of dirsToProcess) {
  if (!fs.existsSync(dir)) continue;
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove mix-blend-screen
    content = content.replace(/mix-blend-screen/g, '');
    
    // Remove heavy blurs
    content = content.replace(/blur-\[200px\]/g, '');
    content = content.replace(/blur-\[80px\]/g, '');
    content = content.replace(/blur-\[100px\]/g, '');
    content = content.replace(/blur-\[40px\]/g, '');
    content = content.replace(/blur-3xl/g, '');
    content = content.replace(/blur-2xl/g, '');
    content = content.replace(/blur-xl/g, '');
    
    // Downgrade backdrop-blur
    content = content.replace(/backdrop-blur-xl/g, '');
    content = content.replace(/backdrop-blur-lg/g, '');
    content = content.replace(/backdrop-blur-md/g, '');
    content = content.replace(/backdrop-blur-sm/g, '');
    content = content.replace(/backdrop-blur/g, '');

    // Remove heavy shadow filters
    content = content.replace(/drop-shadow-\[.*?\]/g, '');
    content = content.replace(/shadow-\[.*?\]/g, '');
    content = content.replace(/drop-shadow-lg/g, '');
    content = content.replace(/drop-shadow-md/g, '');
    content = content.replace(/drop-shadow-sm/g, '');

    fs.writeFileSync(filePath, content);
    console.log(`Processed ${file}`);
  }
}
