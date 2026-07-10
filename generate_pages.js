const fs = require('fs');
const path = require('path');

const rootHtmlPath = path.join(__dirname, 'index.html');
const templateHtml = fs.readFileSync(rootHtmlPath, 'utf8');

const guests = [
  { folder: 'rajkumar-meena', greeting: 'Rajkumar Meena Ji & Arita Meena Ji' },
  { folder: 'ramavatar-ji', greeting: 'Ramavatar Ji & Family' },
  { folder: 'tikka-ram-ji', greeting: 'Tikka Ram Ji & Family' },
  { folder: 'pappu-ji', greeting: 'Pappu Ji & Family' },
  { folder: 'surat-singh-ji', greeting: 'Surat Singh Ji & Family' },
  { folder: 'sumer-singh-ji', greeting: 'Sumer Singh Ji' },
  { folder: 'mukesh-meena-ji', greeting: 'Mukesh Meena Ji' }
];

guests.forEach(({ folder, greeting }) => {
  const dirPath = path.join(__dirname, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  let html = templateHtml;

  // 1. Adjust relative asset paths for subfolder deployment
  html = html.replace(/content="assets\/kl_meena_portrait\.png"/g, 'content="../assets/kl_meena_portrait.png"');
  html = html.replace(/href="index\.css"/g, 'href="../index.css"');
  html = html.replace(/src="assets\/kl_meena_portrait\.png"/g, 'src="../assets/kl_meena_portrait.png"');
  html = html.replace(/src="script\.js"/g, 'src="../script.js"');

  // 2. Replace personalized greeting in the 3 exact locations:
  // (A) Loading Overlay (#intro-guest-name)
  html = html.replace(
    /<h1 id="intro-guest-name" class="intro-guest-name">[^<]+<\/h1>/g,
    `<h1 id="intro-guest-name" class="intro-guest-name">✨ ${greeting} ✨</h1>`
  );

  // (B) Letter Greeting (.dynamic-guest-display inside #invitation-letter)
  html = html.replace(
    /<span class="dynamic-guest-display">[^<]+<\/span>/g,
    `<span class="dynamic-guest-display">${greeting}</span>`
  );

  // (C) Confirmation Message (#confirmed-guest-name inside #rsvp-confirmation)
  html = html.replace(
    /<strong id="confirmed-guest-name">[^<]+<\/strong>/g,
    `<strong id="confirmed-guest-name">${greeting}</strong>`
  );

  fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
  console.log(`Generated personalized page: ${folder}/index.html with greeting "${greeting}"`);
});
