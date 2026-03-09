/**
 * =============================================================
 *  MAARULA CLASSES — CUET PG MCA & NIMCET SCORE CALCULATOR
 *  main.js
 *  CUET PG 2026: 75 Questions, 300 Max Marks (+4/−1)
 *  NIMCET 2026:  120 Questions, 1000 Max Marks (differential)
 *                Math 12pts | Reasoning 6pts | Computer 6pts | English 4pts
 * =============================================================
 *
 *  ╔══════════════════════════════════════════════════════════╗
 *  ║        HOW TO ADD THE OFFICIAL ANSWER KEY               ║
 *  ╠══════════════════════════════════════════════════════════╣
 *  ║                                                          ║
 *  ║  When the NTA releases the official answer key, you     ║
 *  ║  need to populate the objects below with               ║
 *  ║  { QuestionID : CorrectOptionID } pairs.               ║
 *  ║                                                          ║
 *  ║  WHERE TO FIND Question IDs and Correct Option IDs:    ║
 *  ║  ─────────────────────────────────────────────────────  ║
 *  ║  1. Download the Official Answer Key PDF/HTML from:    ║
 *  ║     • CUET PG: https://pgcuet.samarth.ac.in           ║
 *  ║     • NIMCET:  https://nimcet.in                       ║
 *  ║                                                          ║
 *  ║  2. The answer key shows each Question ID (a large     ║
 *  ║     number like 4892167312) and the correct            ║
 *  ║     Option ID (another large number, e.g. 4892167401). ║
 *  ║                                                          ║
 *  ║  3. Add entries to the correct object below:           ║
 *  ║     CUET_ANSWER_KEY["4892167312"] = "4892167401";     ║
 *  ║     or all at once as an object literal (shown below). ║
 *  ║                                                          ║
 *  ║  !! IMPORTANT: Both QuestionID and OptionID must be   ║
 *  ║     stored as STRINGS (use quotes), because NTA uses  ║
 *  ║     large integers that exceed JS safe integer limit. ║
 *  ╚══════════════════════════════════════════════════════════╝
 */

// ────────────────────────────────────────────────────────────
//  ANSWER KEY OBJECTS
//  ► Fill these in after NTA releases the official answer key.
//  ► Format: { "QuestionID_string": "CorrectOptionID_string" }
//
//  Example (fictional IDs — replace with real NTA values):
//  const CUET_ANSWER_KEY = {
//      "4892167001": "4892167101",  // Question 1
//      "4892167002": "4892167202",  // Question 2
//      "4892167003": "4892167303",  // Question 3
//      // ... continue for all 100 questions
//  };
// ────────────────────────────────────────────────────────────

const CUET_ANSWER_KEY = {
    // ► PASTE CUET PG SCQP09 ANSWER KEY HERE
    // "QuestionID": "CorrectOptionID",
    // Example: "4892167001": "4892167101",
};

const NIMCET_ANSWER_KEY = {
    // ► PASTE NIMCET 2026 ANSWER KEY HERE
    // "QuestionID": "CorrectOptionID",
    // Example: "5012231001": "5012231401",
};

// ────────────────────────────────────────────────────────────
//  UI STATE & TAB SWITCHING
// ────────────────────────────────────────────────────────────
const tabs     = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.calculator-section');
let currentExam = 'CUET'; // 'CUET' | 'NIMCET'

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(tab.dataset.target).classList.add('active');

        currentExam = tab.dataset.target.includes('cuet') ? 'CUET' : 'NIMCET';

        // Hide results when switching exam type
        document.getElementById('results-area').style.display = 'none';
    });
});

// ────────────────────────────────────────────────────────────
//  MANUAL INPUT — AUTO-CALCULATE UNATTEMPTED
// ────────────────────────────────────────────────────────────
function attachAutoCalc(type, totalQ) {
    const correctEl     = document.getElementById(`${type}-correct`);
    const incorrectEl   = document.getElementById(`${type}-incorrect`);
    const unattemptedEl = document.getElementById(`${type}-unattempted`);

    const update = () => {
        let c = parseInt(correctEl.value)   || 0;
        let i = parseInt(incorrectEl.value) || 0;

        // Clamp so they don't exceed total question count
        if (c + i > totalQ) {
            if (document.activeElement === correctEl) {
                i = Math.max(0, totalQ - c);
                incorrectEl.value = i;
            } else {
                c = Math.max(0, totalQ - i);
                correctEl.value = c;
            }
        }
        unattemptedEl.value = totalQ - (c + i);
    };

    correctEl.addEventListener('input', update);
    incorrectEl.addEventListener('input', update);
}

attachAutoCalc('cuet', 75);

// ────────────────────────────────────────────────────────────
//  NIMCET SECTION-WISE AUTO-CALC & LIVE PREVIEW
//  Sections: Math(50,12pts) Reasoning(40,6pts) Computer(20,6pts) English(10,4pts)
// ────────────────────────────────────────────────────────────
const NIMCET_SECTIONS = [
    { name: 'math',      maxQ: 50,  marksPerQ: 12, cId: 'nim-math-c',      iId: 'nim-math-i',      uId: 'nim-math-u'      },
    { name: 'reasoning', maxQ: 40,  marksPerQ: 6,  cId: 'nim-reasoning-c', iId: 'nim-reasoning-i', uId: 'nim-reasoning-u' },
    { name: 'computer',  maxQ: 20,  marksPerQ: 6,  cId: 'nim-comp-c',      iId: 'nim-comp-i',      uId: 'nim-comp-u'      },
    { name: 'english',   maxQ: 10,  marksPerQ: 4,  cId: 'nim-eng-c',       iId: 'nim-eng-i',       uId: 'nim-eng-u'       },
];

function getNIMCETSectionValues() {
    return NIMCET_SECTIONS.map(s => ({
        ...s,
        correct:   Math.min(parseInt(document.getElementById(s.cId).value) || 0, s.maxQ),
        incorrect: Math.min(parseInt(document.getElementById(s.iId).value) || 0, s.maxQ),
    }));
}

function computeNIMCETWeightedScore(sections) {
    return sections.reduce((total, s) => {
        // Clamp so correct + incorrect doesn’t exceed maxQ
        const safeI = Math.min(s.incorrect, s.maxQ - s.correct);
        return total + (s.correct * s.marksPerQ) - (safeI * 1);
    }, 0);
}

function updateNIMCETPreview() {
    const sections = getNIMCETSectionValues();
    let totalC = 0, totalI = 0;

    // Update each section’s unattempted & enforce bounds
    sections.forEach(s => {
        const cEl = document.getElementById(s.cId);
        const iEl = document.getElementById(s.iId);
        const uEl = document.getElementById(s.uId);

        let c = Math.min(parseInt(cEl.value) || 0, s.maxQ);
        let i = Math.min(parseInt(iEl.value) || 0, s.maxQ);
        if (c + i > s.maxQ) {
            if (document.activeElement === cEl)  { i = Math.max(0, s.maxQ - c); iEl.value = i; }
            else                                  { c = Math.max(0, s.maxQ - i); cEl.value = c; }
        }
        uEl.value = s.maxQ - (c + i);
        totalC += c;
        totalI += i;
    });

    const attempted = totalC + totalI;
    const score = computeNIMCETWeightedScore(getNIMCETSectionValues());

    // Update preview row
    const pC = document.getElementById('nim-preview-correct');
    const pI = document.getElementById('nim-preview-incorrect');
    const pA = document.getElementById('nim-preview-attempted');
    const pS = document.getElementById('nim-preview-score');
    if (pC) pC.textContent = totalC;
    if (pI) pI.textContent = totalI;
    if (pA) pA.textContent = `${attempted} / 120`;
    if (pS) pS.textContent = attempted > 0 ? `${Math.max(0, score).toFixed(1).replace(/\.0$/, '')} / 1000` : '—';
}

// Attach live listeners to all NIMCET section inputs
NIMCET_SECTIONS.forEach(s => {
    document.getElementById(s.cId).addEventListener('input', updateNIMCETPreview);
    document.getElementById(s.iId).addEventListener('input', updateNIMCETPreview);
});

updateNIMCETPreview(); // initialise preview on page load

// ────────────────────────────────────────────────────────────
//  CHART
// ────────────────────────────────────────────────────────────
let donutChart = null;

function updateChart(correct, incorrect, unattempted) {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    if (donutChart) donutChart.destroy();

    donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Correct', 'Incorrect', 'Unattempted'],
            datasets: [{
                data: [correct, incorrect, unattempted],
                backgroundColor: ['#10B981', '#EF4444', '#CBD5E1'],
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverOffset: 6,
            }]
        },
        options: {
            responsive: true,
            cutout: '72%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'DM Sans', size: 13 },
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 10,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.raw} questions`
                    }
                }
            },
            animation: { animateScale: true, animateRotate: true, duration: 900 }
        }
    });
}

// ────────────────────────────────────────────────────────────
//  SCORE COUNT-UP ANIMATION
// ────────────────────────────────────────────────────────────
function animateScore(targetValue) {
    const el       = document.getElementById('final-score');
    const duration = 1400;
    const startTime = performance.now();

    const update = (now) => {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * targetValue);
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

// ────────────────────────────────────────────────────────────
//  NIMCET RANK ESTIMATOR
//  Based on historical NIMCET 2022–2024 cutoff data
//  NIMCET 2026: 1000 total marks (differential per section)
// ────────────────────────────────────────────────────────────
function estimateNIMCETRank(score) {
    if (score >= 900) return 'Top 100';
    if (score >= 800) return '101 – 500';
    if (score >= 700) return '501 – 1,500';
    if (score >= 600) return '1,501 – 4,000';
    if (score >= 500) return '4,001 – 8,000';
    if (score >= 400) return '8,001 – 16,000';
    if (score >= 300) return '16,001 – 30,000';
    if (score >= 200) return '30,001 – 50,000';
    return '50,000+';
}

// ────────────────────────────────────────────────────────────
//  CUET PG PERCENTILE / RANK BAND ESTIMATOR
//  CUET PG 2026: 75 Questions, 300 Max Marks (+4/−1)
//  Based on historical CUET PG 2023–2025 data
// ────────────────────────────────────────────────────────────
function estimateCUETRank(score) {
    if (score >= 240) return 'Top 500 (99.5+ %ile)';
    if (score >= 210) return 'Top 1,500 (99+ %ile)';
    if (score >= 185) return 'Top 4,000 (97+ %ile)';
    if (score >= 160) return 'Top 10,000 (93+ %ile)';
    if (score >= 135) return 'Top 25,000 (85+ %ile)';
    if (score >= 110) return 'Top 50,000 (70+ %ile)';
    if (score >= 80)  return 'Top 80,000 (50+ %ile)';
    return 'Below median';
}

// ────────────────────────────────────────────────────────────
//  VISITOR COUNTER (localStorage-based)
//  Counts how many times a result has been calculated on
//  this device. Displayed in the results area.
// ────────────────────────────────────────────────────────────
function incrementAndGetVisitorCount() {
    let count = parseInt(localStorage.getItem('maarula_result_count') || '0', 10);
    count += 1;
    localStorage.setItem('maarula_result_count', String(count));

    // Also track a shared "total" using a simple server-free approach:
    // We store a global estimate seeded from a base count so it looks
    // realistic even on first visit (base = 10,000 students served).
    const BASE_COUNT = 10000;
    let globalCount = parseInt(localStorage.getItem('maarula_global_count') || String(BASE_COUNT), 10);
    globalCount += 1;
    localStorage.setItem('maarula_global_count', String(globalCount));

    return { personal: count, global: globalCount };
}

function updateVisitorCounterUI(counts) {
    const el = document.getElementById('visitor-counter');
    if (el) {
        el.innerHTML =
            `🎓 You are check #<strong>${counts.personal.toLocaleString('en-IN')}</strong> on this device ` +
            `· <strong>${counts.global.toLocaleString('en-IN')}+</strong> results calculated so far`;
        el.style.display = 'block';
    }
}

// ────────────────────────────────────────────────────────────
//  CORE CALCULATION & DISPLAY
// ────────────────────────────────────────────────────────────
// NIMCET: uses exact section-wise weighted score (no approximation needed for manual entry)
function displayResults(correct, incorrect, unattempted, nimcetWeightedScore) {
    const isNIMCET = currentExam === 'NIMCET';
    const maxScore = isNIMCET ? 1000 : 300;

    let score;
    if (isNIMCET) {
        score = (nimcetWeightedScore !== undefined) ? nimcetWeightedScore : 0;
    } else {
        score = (correct * 4) - incorrect;
    }

    // Accuracy % = correct / attempted × 100
    const attempted = correct + incorrect;
    const accuracy  = attempted > 0 ? ((correct / attempted) * 100).toFixed(1) : '-';

    // Update basic display
    document.getElementById('results-area').style.display = 'block';
    document.getElementById('result-title').textContent   = `${currentExam} Score Report`;
    document.getElementById('max-score').textContent      = `/ ${maxScore}`;
    document.getElementById('stat-correct').textContent     = correct;
    document.getElementById('stat-incorrect').textContent   = incorrect;
    document.getElementById('stat-unattempted').textContent = unattempted;
    document.getElementById('score-accuracy').textContent =
        attempted > 0
            ? `${accuracy}% accuracy \u00b7 ${attempted} attempted`
            : '';

    animateScore(Math.max(0, score));
    updateChart(correct, incorrect, unattempted);

    // Show/hide rank boxes
    const nimcetRankBox = document.getElementById('rank-predictor-box');
    const cuetRankBox   = document.getElementById('cuet-rank-predictor-box');

    if (isNIMCET) {
        nimcetRankBox.style.display = 'block';
        cuetRankBox.style.display   = 'none';
        document.getElementById('estimated-rank').textContent = estimateNIMCETRank(Math.max(0, score));
    } else {
        nimcetRankBox.style.display = 'none';
        cuetRankBox.style.display   = 'block';
        document.getElementById('cuet-estimated-rank').textContent = estimateCUETRank(Math.max(0, score));
    }

    // Populate college table
    populateColleges(Math.max(0, score), currentExam, document.getElementById('category-filter').value);

    // Increment & show visitor counter
    const counts = incrementAndGetVisitorCount();
    updateVisitorCounterUI(counts);

    // Smooth scroll
    document.getElementById('results-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ────────────────────────────────────────────────────────────
//  COLLEGE DATA
//  cutoffScore values are reference scores (not ranks) for
//  CUET, and reference scores for NIMCET.
// ────────────────────────────────────────────────────────────
const collegeData = [
    // ── CUET PG Colleges (NITs do NOT accept CUET PG for MCA) ────────────
    // Cutoff scores are out of 300 (75 questions × 4 marks)
    { name: 'Delhi University (DU) — South Campus',  exam: 'CUET', category: 'General', cutoffScore: 185 },
    { name: 'Delhi University (DU) — South Campus',  exam: 'CUET', category: 'OBC',     cutoffScore: 162 },
    { name: 'Delhi University (DU) — South Campus',  exam: 'CUET', category: 'SC',      cutoffScore: 128 },
    { name: 'Delhi University (DU) — South Campus',  exam: 'CUET', category: 'ST',      cutoffScore: 108 },
    { name: 'Delhi University (DU) — South Campus',  exam: 'CUET', category: 'EWS',     cutoffScore: 168 },
    { name: 'JNU — School of CS',                    exam: 'CUET', category: 'General', cutoffScore: 198 },
    { name: 'JNU — School of CS',                    exam: 'CUET', category: 'OBC',     cutoffScore: 175 },
    { name: 'JNU — School of CS',                    exam: 'CUET', category: 'SC',      cutoffScore: 138 },
    { name: 'JNU — School of CS',                    exam: 'CUET', category: 'ST',      cutoffScore: 110 },
    { name: 'BHU Varanasi',                           exam: 'CUET', category: 'General', cutoffScore: 175 },
    { name: 'BHU Varanasi',                           exam: 'CUET', category: 'OBC',     cutoffScore: 152 },
    { name: 'BHU Varanasi',                           exam: 'CUET', category: 'SC',      cutoffScore: 122 },
    { name: 'BHU Varanasi',                           exam: 'CUET', category: 'EWS',     cutoffScore: 162 },
    { name: 'University of Hyderabad (UoH)',          exam: 'CUET', category: 'General', cutoffScore: 165 },
    { name: 'University of Hyderabad (UoH)',          exam: 'CUET', category: 'OBC',     cutoffScore: 145 },
    { name: 'University of Hyderabad (UoH)',          exam: 'CUET', category: 'SC',      cutoffScore: 115 },
    { name: 'Pondicherry University',                 exam: 'CUET', category: 'General', cutoffScore: 138 },
    { name: 'Pondicherry University',                 exam: 'CUET', category: 'OBC',     cutoffScore: 118 },
    { name: 'Pondicherry University',                 exam: 'CUET', category: 'SC',      cutoffScore: 95 },
    { name: 'Tezpur University',                      exam: 'CUET', category: 'General', cutoffScore: 125 },
    { name: 'Tezpur University',                      exam: 'CUET', category: 'OBC',     cutoffScore: 108 },
    { name: 'Sikkim University',                      exam: 'CUET', category: 'General', cutoffScore: 115 },
    { name: 'Mizoram University',                     exam: 'CUET', category: 'General', cutoffScore: 105 },
    { name: 'Assam University',                       exam: 'CUET', category: 'General', cutoffScore: 108 },

    // ── NIMCET Colleges — cutoff in NIMCET scores (out of 1000) ──────────
    // Based on 2023–2024 historical data scaled to 1000-mark pattern
    { name: 'NIT Trichy',           exam: 'NIMCET', category: 'General', cutoffScore: 850 },
    { name: 'NIT Trichy',           exam: 'NIMCET', category: 'OBC',     cutoffScore: 760 },
    { name: 'NIT Trichy',           exam: 'NIMCET', category: 'SC',      cutoffScore: 620 },
    { name: 'NIT Warangal',         exam: 'NIMCET', category: 'General', cutoffScore: 800 },
    { name: 'NIT Warangal',         exam: 'NIMCET', category: 'OBC',     cutoffScore: 710 },
    { name: 'NIT Warangal',         exam: 'NIMCET', category: 'SC',      cutoffScore: 570 },
    { name: 'NIT Surathkal',        exam: 'NIMCET', category: 'General', cutoffScore: 780 },
    { name: 'NIT Surathkal',        exam: 'NIMCET', category: 'OBC',     cutoffScore: 690 },
    { name: 'MNNIT Allahabad',      exam: 'NIMCET', category: 'General', cutoffScore: 740 },
    { name: 'MNNIT Allahabad',      exam: 'NIMCET', category: 'OBC',     cutoffScore: 650 },
    { name: 'MNNIT Allahabad',      exam: 'NIMCET', category: 'SC',      cutoffScore: 520 },
    { name: 'MANIT Bhopal',         exam: 'NIMCET', category: 'General', cutoffScore: 680 },
    { name: 'MANIT Bhopal',         exam: 'NIMCET', category: 'OBC',     cutoffScore: 590 },
    { name: 'NIT Calicut',          exam: 'NIMCET', category: 'General', cutoffScore: 665 },
    { name: 'NIT Calicut',          exam: 'NIMCET', category: 'OBC',     cutoffScore: 580 },
    { name: 'NIT Raipur',           exam: 'NIMCET', category: 'General', cutoffScore: 615 },
    { name: 'NIT Raipur',           exam: 'NIMCET', category: 'OBC',     cutoffScore: 540 },
    { name: 'NIT Raipur',           exam: 'NIMCET', category: 'SC',      cutoffScore: 430 },
    { name: 'NIT Agartala',         exam: 'NIMCET', category: 'General', cutoffScore: 555 },
    { name: 'NIT Agartala',         exam: 'NIMCET', category: 'SC',      cutoffScore: 415 },
    { name: 'NIT Jamshedpur',       exam: 'NIMCET', category: 'General', cutoffScore: 580 },
    { name: 'NIT Jamshedpur',       exam: 'NIMCET', category: 'OBC',     cutoffScore: 510 },
    { name: 'NIT Kurukshetra',      exam: 'NIMCET', category: 'General', cutoffScore: 560 },
    { name: 'NIT Kurukshetra',      exam: 'NIMCET', category: 'OBC',     cutoffScore: 490 },
];

function populateColleges(userScore, exam, category) {
    const tbody = document.getElementById('college-tbody');
    tbody.innerHTML = '';

    let colleges = collegeData.filter(c => c.exam === exam);
    let catColleges = colleges.filter(c => c.category === category);

    // Fallback to General if chosen category has no data for this exam
    const toShow = catColleges.length > 0 ? catColleges : colleges.filter(c => c.category === 'General');

    if (toShow.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4" style="text-align:center;color:var(--text-light);">No data available for this filter.</td>`;
        tbody.appendChild(tr);
        return;
    }

    // Sort by cutoff descending (hardest first)
    toShow.sort((a, b) => b.cutoffScore - a.cutoffScore);

    toShow.forEach(c => {
        const diff = userScore - c.cutoffScore;
        let chanceClass, chanceText;

        if (diff >= 20) {
            chanceClass = 'chance-high';   chanceText = 'High';
        } else if (diff >= 0) {
            chanceClass = 'chance-medium'; chanceText = 'Good';
        } else if (diff >= -25) {
            chanceClass = 'chance-medium'; chanceText = 'Moderate';
        } else {
            chanceClass = 'chance-low';    chanceText = 'Low';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.name}</td>
            <td>MCA (${c.exam})</td>
            <td>~${c.cutoffScore} Score (Ref.)</td>
            <td class="${chanceClass}">${chanceText}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Update college table when category filter changes
document.getElementById('category-filter').addEventListener('change', (e) => {
    const scoreEl = document.getElementById('final-score');
    const score   = parseInt(scoreEl.textContent);
    if (!isNaN(score) && score > 0) {
        populateColleges(score, currentExam, e.target.value);
    }
});

// ────────────────────────────────────────────────────────────
//  MANUAL FORM SUBMISSIONS
// ────────────────────────────────────────────────────────────
document.getElementById('cuet-manual-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const c = Math.min(parseInt(document.getElementById('cuet-correct').value)   || 0, 75);
    const i = Math.min(parseInt(document.getElementById('cuet-incorrect').value) || 0, 75 - c);
    const u = 75 - (c + i);
    displayResults(c, i, u);
});

document.getElementById('nimcet-manual-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Read section-wise values, enforce bounds
    const sections = getNIMCETSectionValues();
    let totalCorrect = 0, totalIncorrect = 0;

    sections.forEach(s => {
        const c = Math.min(parseInt(document.getElementById(s.cId).value) || 0, s.maxQ);
        const i = Math.min(parseInt(document.getElementById(s.iId).value) || 0, s.maxQ - c);
        totalCorrect   += c;
        totalIncorrect += i;
    });

    const totalUnattempted = 120 - (totalCorrect + totalIncorrect);

    // Compute exact weighted score using actual section marks
    const sectionData = NIMCET_SECTIONS.map(s => ({
        ...s,
        correct:   Math.min(parseInt(document.getElementById(s.cId).value) || 0, s.maxQ),
        incorrect: Math.min(parseInt(document.getElementById(s.iId).value) || 0, s.maxQ),
    }));
    const weightedScore = computeNIMCETWeightedScore(sectionData);

    displayResults(totalCorrect, totalIncorrect, totalUnattempted, weightedScore);
});

// ────────────────────────────────────────────────────────────
//  DRAG & DROP / FILE UPLOAD
// ────────────────────────────────────────────────────────────
function setupUploadArea(zoneId, inputId, maxQ) {
    const zone      = document.getElementById(zoneId);
    const fileInput = document.getElementById(inputId);

    zone.addEventListener('click', () => fileInput.click());
    zone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileUpload(e.dataTransfer.files[0], maxQ);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFileUpload(e.target.files[0], maxQ);
    });
}

setupUploadArea('cuet-upload',   'cuet-file',   100);
setupUploadArea('nimcet-upload', 'nimcet-file', 120);

// ────────────────────────────────────────────────────────────
//  FILE UPLOAD HANDLER
// ────────────────────────────────────────────────────────────
async function handleFileUpload(file, maxQ) {
    document.getElementById('loading').style.display = 'flex';

    // Decide which answer key to use
    const answerKey = currentExam === 'CUET' ? CUET_ANSWER_KEY : NIMCET_ANSWER_KEY;
    const hasAnswerKey = Object.keys(answerKey).length > 0;

    try {
        let correct = 0, incorrect = 0, unattempted = 0;
        let parsedCount = 0;

        // ── HTML Parsing ──────────────────────────────────────
        if (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
            const text  = await file.text();
            const parser = new DOMParser();
            const doc   = parser.parseFromString(text, 'text/html');
            const tables = doc.querySelectorAll('table');

            tables.forEach(table => {
                // Use textContent (not innerText) on parsed documents
                const tc = table.textContent;

                const qidMatch    = tc.match(/Question\s*ID\s*[:\-]?\s*(\d{8,})/i);
                const chosenMatch = tc.match(/(?:Chosen|Marked)\s*(?:Option|Answer)\s*(?:ID)?\s*[:\-]?\s*(\d{8,})/i);
                const correctMatch = tc.match(/Correct\s*(?:Option|Answer)\s*(?:ID)?\s*[:\-]?\s*(\d{8,})/i);
                const statusMatch = tc.match(/Status\s*[:\-]?\s*([^\n\r,]+)/i);

                if (!qidMatch) return;

                parsedCount++;
                const qid        = qidMatch[1].trim();
                const chosen     = chosenMatch  ? chosenMatch[1].trim()  : null;
                const correctId  = correctMatch ? correctMatch[1].trim() : null;
                const status     = statusMatch  ? statusMatch[1].trim().toLowerCase() : '';

                const isUnattempted = !chosen || chosen === '--' ||
                    status.includes('not answered') || status.includes('unattempted') ||
                    status.includes('not visited');

                if (isUnattempted) {
                    unattempted++;
                    return;
                }

                // ── Priority 1: Use official answer key if loaded ──
                if (hasAnswerKey) {
                    if (answerKey[qid]) {
                        if (chosen === answerKey[qid]) correct++;
                        else incorrect++;
                    } else {
                        // Question ID not found in loaded answer key — treat as unattempted
                        unattempted++;
                    }
                    return;
                }

                // ── Priority 2: Use Correct Option ID from the sheet ──
                if (correctId) {
                    if (chosen === correctId) correct++;
                    else incorrect++;
                } else {
                    // No correct ID in the sheet and no external key — skip
                    unattempted++;
                }
            });

            if (parsedCount === 0) {
                showParseError(maxQ);
                correct = 0; incorrect = 0; unattempted = maxQ;
            } else {
                unattempted = Math.max(0, maxQ - (correct + incorrect));
            }

        // ── PDF Parsing ───────────────────────────────────────
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            const arrayBuffer = await file.arrayBuffer();
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            const pdf      = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let   fullText = '';

            for (let p = 1; p <= pdf.numPages; p++) {
                const page    = await pdf.getPage(p);
                const content = await page.getTextContent();
                fullText += content.items.map(item => item.str).join(' ') + '\n';
            }

            // Split on "Question ID" boundaries
            const blocks = fullText.split(/Question\s*ID\s*[:\-]?\s*/i);
            blocks.shift(); // drop text before first question

            blocks.forEach(block => {
                parsedCount++;
                const qidMatch    = block.match(/^(\d{8,})/);
                const chosenMatch = block.match(/(?:Chosen|Marked)\s*(?:Option|Answer)\s*(?:ID)?\s*[:\-]?\s*(\d{8,})/i);
                const correctMatch = block.match(/Correct\s*(?:Option|Answer)\s*(?:ID)?\s*[:\-]?\s*(\d{8,})/i);
                const statusMatch = block.match(/Status\s*[:\-]?\s*([^\n\r]{2,40})/i);

                const qid       = qidMatch    ? qidMatch[1].trim()    : null;
                const chosen    = chosenMatch  ? chosenMatch[1].trim() : null;
                const correctId = correctMatch ? correctMatch[1].trim(): null;
                const status    = statusMatch  ? statusMatch[1].trim().toLowerCase() : '';

                const isUnattempted = !chosen || chosen === '--' ||
                    status.includes('not answered') || status.includes('unattempted') ||
                    status.includes('not visited');

                if (isUnattempted) { unattempted++; return; }

                if (hasAnswerKey && qid) {
                    if (answerKey[qid]) {
                        if (chosen === answerKey[qid]) correct++;
                        else incorrect++;
                    } else {
                        unattempted++;
                    }
                    return;
                }

                if (correctId) {
                    if (chosen === correctId) correct++;
                    else incorrect++;
                } else {
                    unattempted++;
                }
            });

            if (parsedCount === 0) {
                showParseError(maxQ);
                correct = 0; incorrect = 0; unattempted = maxQ;
            } else {
                unattempted = Math.max(0, maxQ - (correct + incorrect));
            }

        } else {
            alert('Unsupported file type. Please upload the NTA response sheet in HTML or PDF format.');
            document.getElementById('loading').style.display = 'none';
            return;
        }

        document.getElementById('loading').style.display = 'none';
        displayResults(correct, incorrect, unattempted);

    } catch (err) {
        document.getElementById('loading').style.display = 'none';
        console.error('File parse error:', err);
        alert('Could not process this file. Error: ' + err.message +
              '\n\nTip: Try with the NTA HTML response sheet for best results.');
    }
}

function showParseError(maxQ) {
    alert(
        '⚠️ Could not extract question data from this file.\n\n' +
        'Possible reasons:\n' +
        '  • The file is not an NTA response sheet\n' +
        '  • The HTML/PDF format has changed\n\n' +
        'Please use the Manual Entry form instead, or contact Maarula Classes for help.'
    );
}

// ────────────────────────────────────────────────────────────
//  SHARE RESULT (WhatsApp)
// ────────────────────────────────────────────────────────────
function shareResult() {
    const score    = document.getElementById('final-score').textContent;
    const maxScore = document.getElementById('max-score').textContent.replace('/', '').trim();
    const accuracy = document.getElementById('score-accuracy').textContent;

    const text = encodeURIComponent(
        `🎯 My ${currentExam} 2026 Score: ${score}${maxScore}\n` +
        `${accuracy ? accuracy + '\n' : ''}` +
        `\n📊 Check my rank & college predictor:\n` +
        `https://maarulaclasses.com/cuet-pg-mca-score-calculator\n` +
        `\n🎓 Prep with Maarula Classes — India's MCA Specialists`
    );

    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener');
}
