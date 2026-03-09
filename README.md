# CUET PG MCA Score Calculator & NIMCET Rank Predictor

**By Maarula Classes** — India's trusted MCA entrance exam coaching institute.

A free, privacy-first web tool that helps students calculate their **CUET PG SCQP09** and **NIMCET 2026** scores, predict their rank, and explore MCA college admission chances — all computed locally on the user's device.

---

## Live Demo

> [https://maarulaclasses.com/cuet-pg-mca-score-calculator](https://maarulaclasses.com/cuet-pg-mca-score-calculator)

---

## Features

- **Dual exam support** — CUET PG SCQP09 (100Q / 400 marks) and NIMCET (120Q / 480 marks)
- **NTA Response Sheet parser** — Upload the HTML or PDF file directly from the NTA website; score is computed automatically
- **Official Answer Key integration** — Add the NTA answer key IDs to `main.js` for 100% accurate auto-scoring
- **Manual entry mode** — Enter correct/incorrect counts directly; unattempted auto-calculated
- **Rank predictor** — Estimated rank band for NIMCET; percentile band for CUET PG (based on 2022–2024 historical data)
- **MCA College Predictor** — Grouped by category (General / OBC-NCL / SC / ST / EWS) with admission chance indicator
- **Accuracy percentage** — Shows accuracy % alongside score
- **Visitor counter** — Shows how many results have been calculated (localStorage-based, no server)
- **Privacy-first** — Zero server calls; all processing runs on the user's browser
- **SEO optimised** — Schema.org markup, Open Graph, Twitter Card, canonical URL, FAQ structured data
- **Fully responsive** — Mobile-first design with sticky mobile CTA

---

## Project Structure

```
RankPredictor/
├── index.html               # Main HTML page (SEO, layout, hero)
├── assets/
│   ├── css/
│   │   └── style.css        # Full premium CSS (glassmorphism, gradients, animations)
│   ├── js/
│   │   └── main.js          # All logic — parsing, scoring, charts, college predictor
│   └── images/
│       └── maarulalogo.png  # Maarula Classes logo
└── README.md
```

---

## How to Add the Official Answer Key

After NTA releases the answer key you must add the **Question ID → Correct Option ID** mapping.

### Step 1 — Get the IDs

1. Download the **Official Answer Key** from:
   - CUET PG: [pgcuet.samarth.ac.in](https://pgcuet.samarth.ac.in)
   - NIMCET:  [nimcet.in](https://nimcet.in)
2. Open the answer key file. You will see entries like:

| Question ID  | Correct Option ID |
|-------------|-----------------|
| 4892167001  | 4892167101      |
| 4892167002  | 4892167203      |
| 4892167003  | 4892167304      |
| ...         | ...             |

> **Note:** NTA uses large numeric IDs (8–14 digits). Both the Question ID and the Option IDs are unique large numbers printed on both the response sheet and the answer key.

### Step 2 — Open `assets/js/main.js`

Locate the two answer key objects near the **top of the file** (around line 40–70):

```javascript
const CUET_ANSWER_KEY = {
    // ► PASTE CUET PG SCQP09 ANSWER KEY HERE
    // "QuestionID": "CorrectOptionID",
};

const NIMCET_ANSWER_KEY = {
    // ► PASTE NIMCET 2026 ANSWER KEY HERE
    // "QuestionID": "CorrectOptionID",
};
```

### Step 3 — Add entries

Add one entry per question, formatted as a string key–value pair:

```javascript
const CUET_ANSWER_KEY = {
    "4892167001": "4892167101",   // Q1
    "4892167002": "4892167203",   // Q2
    "4892167003": "4892167304",   // Q3
    // ... continue for all 100 CUET PG questions
};

const NIMCET_ANSWER_KEY = {
    "5012231001": "5012231201",   // Q1
    "5012231002": "5012231402",   // Q2
    // ... continue for all 120 NIMCET questions
};
```

> **Important:** Both keys and values must be **quoted strings**, not numbers. NTA's IDs are larger than JavaScript's safe integer limit (`Number.MAX_SAFE_INTEGER`), so treating them as numbers causes matching errors.

### How the Tool Uses the Answer Key

| Answer Key in `main.js` | Correct Option ID in Response Sheet | Behaviour |
|------------------------|-------------------------------------|-----------|
| Populated              | Present (ignored)                   | Uses your answer key — most accurate |
| Empty (default)        | Present                             | Uses the ID embedded in the response sheet — works for HTML sheets that include correct options |
| Empty                  | Absent                              | Cannot auto-score; shows parse error and asks user to use manual entry |

---

## Marking Scheme Reference

### CUET PG SCQP09 (MCA) — 2026 Updated

| Particulars | Details |
|---|---|
| Total Questions | **75 MCQs** (updated from 100 in 2025) |
| Maximum Marks | **300** |
| Correct Answer | +4 marks |
| Incorrect Answer | −1 mark |
| Unattempted | 0 marks |
| Formula | Score = (Correct × 4) − (Incorrect × 1) |

### NIMCET 2026 — Differential Marking (1000 Marks)

| Section | Questions | Marks/Q | Total |
|---|---|---|---|
| Mathematics | 50 | 12 | 600 |
| Analytical Ability & Logical Reasoning | 40 | 6 | 240 |
| Computer Awareness | 20 | 6 | 120 |
| General English | 10 | 4 | 40 |
| **TOTAL** | **120** | | **1000** |

> **Note:** NITs do NOT accept CUET PG scores for MCA. All NIT admissions go through NIMCET exclusively.

---

## Local Setup

No build step required — it is a plain HTML/CSS/JS project.

1. Clone or download the repository.
2. Open `index.html` in any modern browser.
3. Or serve with a simple local server:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

---

## Dependencies (CDN — no install needed)

| Library       | Version  | Purpose                          |
|---------------|----------|----------------------------------|
| PDF.js        | 3.11.174 | Parse NTA PDF response sheets    |
| Chart.js      | Latest   | Score distribution doughnut chart|
| Google Fonts  | —        | DM Sans + Sora typefaces         |

---

## Customisation

### Update Contact Links
Replace `91XXXXXXXXXX` in all WhatsApp links in `index.html` with the actual phone number.

### Update Canonical URL
Change `https://maarulaclasses.com/cuet-pg-mca-score-calculator` in:
- `<link rel="canonical">` (index.html, line ~13)
- Schema.org JSON-LD block (index.html)

### Update College Cutoff Data
Edit the `collegeData` array in `assets/js/main.js` after each year's official cutoffs are published.

### Update Rank Estimator
Update `estimateNIMCETRank()` and `estimateCUETRank()` functions in `main.js` once official merit lists are published.

---

## SEO Notes

The page includes:
- `<title>` and `<meta name="description">` optimised for "CUET PG MCA score calculator 2026" and "NIMCET rank predictor"
- **Schema.org** `WebApplication` and `FAQPage` JSON-LD structured data
- **Open Graph** and **Twitter Card** meta tags for social sharing
- `<link rel="canonical">` to avoid duplicate content
- Semantic HTML5 with ARIA roles for accessibility

---

## Privacy

All file parsing and score calculations happen **entirely in the browser using JavaScript**. No response sheet data, scores, or personal information is ever transmitted to any server.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/answer-key-2026`)
3. Commit your changes
4. Open a Pull Request

---

## License

MIT License — free to use, modify, and distribute with attribution.

---

## Contact

**Maarula Classes**
- Website: [maarulaclasses.com](https://maarulaclasses.com)
- WhatsApp: [Chat with us](https://wa.me/91XXXXXXXXXX)

> For MCA entrance coaching — CUET PG, NIMCET, and more.
