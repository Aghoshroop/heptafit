const fs = require('fs');
const path = require('path');

const coachDirs = [
  'training', 'sessions', 'wellness', 'injuries', 'messages', 'analytics'
];

const studentDirs = [
  'training', 'wellness', 'competitions', 'calendar', 'coach-notes', 'messages'
];

const createPage = (base, dir) => {
  const fullDir = path.join(process.cwd(), 'src', 'app', base, dir);
  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir, { recursive: true });
  }
  const filePath = path.join(fullDir, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    const title = dir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const content = `export default function Page() { return (<div className="p-6"><h1 className="text-2xl font-bold mb-4">${title}</h1><p className="text-muted-foreground">This page is under construction.</p></div>); }`;
    fs.writeFileSync(filePath, content);
    console.log('Created ' + filePath);
  }
};

coachDirs.forEach(dir => createPage('coach', dir));
studentDirs.forEach(dir => createPage('student', dir));
