ACTIVE — Self-service gym website (Slovak + English)
====================================================

LANGUAGES
  Slovak is the default. Slovak pages are in the main folder,
  English pages are in the "en" folder. The SK / EN switch in the
  header opens the same page in the other language.

  Slovak (main folder)         English (en folder)
  index.html                   en/index.html          Home
  clenstvo.html                en/membership.html     Membership
  ako-sa-stat-clenom.html      en/how-to-join.html    How to get a membership
  aplikacia.html               en/app.html            App
  kontakt.html                 en/contact.html        Contact

  IMPORTANT: when you change text, change it in BOTH languages
  (e.g. clenstvo.html and en/membership.html).

OTHER FILES
  css/style.css       All styling (colors at the top under :root)
  js/main.js          Animations and interactive parts
  images/             Put your real photos here (shared by both languages)

HOW TO VIEW
  Double-click index.html to open it in your browser.

ADDING YOUR PHOTOS
  Save photos into the "images" folder with exactly these names.
  Until a photo is added, a grey box labelled with the file name is shown.

  hero.jpg                 Home, full-screen top photo (landscape, min 2000px wide)
  tile-gym.jpg             Home tile — weights area (portrait)
  tile-cardio.jpg          Home tile — cardio zone (portrait)
  tile-entry.jpg           Home tile — member scanning QR at the entrance (portrait)
  facilities.jpg           Home (portrait 4:5)
  app-in-hand.jpg          Home — phone with the app in someone's hand (portrait 4:5)
  hero-membership.jpg      Membership page top (landscape)
  membership-includes.jpg  Membership page (portrait 4:5)
  hero-join.jpg            How to join page top (landscape)
  gym-rules.jpg            How to join page (portrait 4:5)
  qr-reader.jpg            App page — the QR reader at the entrance (portrait 4:5)
  hero-contact.jpg         Contact page top (landscape)
  app-screen-1.png         App page — screenshot of the QR code screen (phone screenshot)
  app-screen-2.png         App page — screenshot of another app screen (phone screenshot)

  Tip: compress photos before uploading (e.g. squoosh.app), aim for under 400 KB each.

EDITING TEXT
  Everything in [square brackets] is placeholder text — replace it.
  The header and footer are repeated on every page, so change them in all 10 files.

PRICES
  In clenstvo.html and en/membership.html, look for class="amount".
  Replace [35], [95], [330] and the price-per-month notes under them.

APP STORE / GOOGLE PLAY LINKS
  Search for class="store-btn" and replace href="#" with your real app links
  (they appear on the Home, App pages and CTA, in both languages).
  Apple and Google also offer official download badges you can use instead:
  developer.apple.com/app-store/marketing/guidelines
  play.google.com/intl/en_us/badges

OPENING HOURS
  Daily 5:00 – 20:30. The "Open now / Closed now" badge uses Slovak time.
  If the hours change, edit OPEN_FROM / OPEN_TO in js/main.js and the
  hours text on the pages.

CONTACT FORM
  1. Create a free form at formspree.io
  2. In kontakt.html and en/contact.html replace YOUR_FORM_ID in action="..."
  3. Remove the word data-demo from the <form> tag

MAP
  In both contact pages replace "Bratislava,Slovakia" in the map URL with
  the gym's full address (spaces as +).

PUBLISHING
  Drag the whole "active-gym" folder onto app.netlify.com/drop
