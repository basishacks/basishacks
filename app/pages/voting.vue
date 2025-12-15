<template base="1">
    <div class="voting-page" :class="{ 'is-dark': isDark }">
        <header class="project-nav">
            <div class="nav-center">
                <button class="nav-prev" @click="prevProject" :disabled="currentIndex === 0">← Prev</button>
                <h2 class="proj-title">{{ currentProject.title }}</h2>
                <button class="nav-next" @click="nextProject" :disabled="currentIndex === projects.length - 1">Next →</button>
            </div>
        </header>
        <aside class="left-pane">
            <section class="readme-only">
                <h3 class="readme-header">README</h3>
                <div class="readme-container">
                    <template v-if="readmeLoading">Loading README…</template>
                    <template v-else-if="readmeError">{{ readmeError }}</template>
                    <template v-else>
                        <article
                            class="readme markdown-body"
                            v-if="readmeHtml"
                            v-html="readmeHtml"
                        ></article>
                        <pre class="readme" v-else v-text="readmeContent || 'No README available for this project.'"></pre>
                    </template>
                </div>
            </section>
        </aside>

        <main class="right-pane">
            <section class="project-info-right">
                <h3>Team / Project</h3>
                <p class="meta">Team: <strong>{{ currentProject.team }}</strong></p>
                <p class="meta">Category: <strong>{{ currentProject.category }}</strong></p>

                <h4>Abstract</h4>
                <p class="abstract">{{ currentProject.abstract }}</p>

                <h4>Members</h4>
                <ul>
                    <li v-for="m in currentProject.members" :key="m">{{ m }}</li>
                </ul>

                <footer class="left-footer">
                    <small>Project ID: {{ currentProject.id }}</small>
                </footer>
            </section>

            <section class="instructions">
                <details open>
                    <summary>Instructions</summary>
                    <ol>
                        <li>Read the project README on the left.</li>
                        <li>Use the rubric table below and click the cell that matches the criterion (4 = Outstanding → 0 = Missing).</li>
                        <li>Final score is the sum of points and shown as total points and a normalized percent.</li>
                        <li>Provide short comments for overall feedback.</li>
                    </ol>
                </details>
            </section>

            <section class="rubrics">
                <div class="score-summary" style="margin-bottom:.5rem;">
                    <div>Total points: <strong>{{ totalPoints }} pts</strong></div>
                    <div>Normalized: <strong>{{ normalizedPercent }}%</strong></div>
                </div>
                <h3>Rubric</h3>
                <table class="rubric-table">
                    <thead>
                        <tr>
                            <th>Criterion</th>
                            <th colspan="5">Score</th>
                        </tr>
                        <tr class="subheaders">
                            <th></th>
                            <th class="score-col">Outstanding<br/><small>(4)</small></th>
                            <th class="score-col">Very Good<br/><small>(3)</small></th>
                            <th class="score-col">Satisfactory<br/><small>(2)</small></th>
                            <th class="score-col">Needs Improvement<br/><small>(1)</small></th>
                            <th class="score-col">Missing<br/><small>(0)</small></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(r, idx) in rubrics" :key="r.id">
                            <td class="criterion-cell">
                                <div class="crit-title">
                                    <strong>{{ idx + 1 }}. <span class="crit-abbr">{{ r.abbr }}</span></strong>
                                    <span class="help-icon-container" tabindex="0" aria-label="Show description">
                                        <span class="help-icon" aria-hidden="true">?</span>
                                        <div class="tooltip" role="tooltip">
                                            <div class="tooltip-title"><strong>{{ r.title }}</strong></div>
                                            <div class="tooltip-desc">{{ r.description }}</div>
                                            <div class="tooltip-weight"><small>Weight: {{ r.weight }}%</small></div>
                                        </div>
                                    </span>
                                </div>
                            </td>
                            <td class="score-cell" :class="{ selected: r.score === 4 }" @click="setScore(r, 4)">4</td>
                            <td class="score-cell" :class="{ selected: r.score === 3 }" @click="setScore(r, 3)">3</td>
                            <td class="score-cell" :class="{ selected: r.score === 2 }" @click="setScore(r, 2)">2</td>
                            <td class="score-cell" :class="{ selected: r.score === 1 }" @click="setScore(r, 1)">1</td>
                            <td class="score-cell" :class="{ selected: r.score === 0 }" @click="setScore(r, 0)" @keydown.enter.prevent="setScore(r,0)" @keydown.space.prevent="setScore(r,0)" tabindex="0">0</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="comments">
                <h3>Judge Comments</h3>
                <textarea v-model="comments" rows="5" placeholder="Strengths, weaknesses, suggestions..."></textarea>
            </section>

            <section class="actions">
                <button class="btn-save" @click="saveReview" :disabled="!judgeName">Save Review</button>
                <button @click="clearScores">Clear</button>
                <button @click="autoFillSample">Auto-fill (demo)</button>
                <div class="last-saved" v-if="lastSaved">
                    <small>Last saved: {{ lastSaved }}</small>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const projects = reactive([
    {
        id: 'P-001',
        title: 'OpenHealth',
        team: 'Team Aces',
        category: 'Healthcare',
        abstract: 'An open platform for connecting patients and volunteers.',
        members: ['Alice', 'Bob', 'Carlos'],
        // example raw README URL (replace with the project's raw README URL)
        readmeRawUrl: 'https://raw.githubusercontent.com/basishacks/basishacks/refs/heads/main/README.md'
    },
    {
        id: 'P-002',
        title: 'GreenRoute',
        team: 'EcoHackers',
        category: 'Sustainability',
        abstract: 'Find routes that minimize carbon footprint using multi-modal transport.',
        members: ['Dana', 'Eve'],
        readmeRawUrl: ''
    },
    {
        id: 'P-003',
        title: 'StudyBuddy',
        team: 'LearnersUnited',
        category: 'Education',
        abstract: 'A collaborative study planner with reminders and group challenges.',
        members: ['Frank', 'Grace', 'Heidi'],
        readmeRawUrl: ''
    },
])

const currentIndex = ref(0)
const currentProject = computed(() => projects[currentIndex.value])

function nextProject() {
    if (currentIndex.value < projects.length - 1) currentIndex.value++
    loadForProject(currentProject.value.id)
}
function prevProject() {
    if (currentIndex.value > 0) currentIndex.value--
    loadForProject(currentProject.value.id)
}

/* Rubric setup */
const defaultRubrics = [
    { id: 'r1', abbr: 'INO', title: 'Innovation & Originality', description: 'Novelty of idea and approach.', weight: 30, score: 0 },
    { id: 'r2', abbr: 'TEC', title: 'Technical Complexity', description: 'Depth and quality of technical implementation.', weight: 30, score: 0 },
    { id: 'r3', abbr: 'IMP', title: 'Impact & Usefulness', description: 'Potential to solve real problems or benefit users.', weight: 20, score: 0 },
    { id: 'r4', abbr: 'DES', title: 'Presentation & Design', description: 'Clarity, polish, and design of demo.', weight: 20, score: 0 },
]

const rubrics = reactive(defaultRubrics.map(r => ({ ...r })))

const judgeName = ref('')
const comments = ref('')
const lastSaved = ref('')

// README state
const readmeContent = ref('')
const readmeLoading = ref(false)
const readmeError = ref('')
// rendered & sanitized HTML (client-side)
const readmeHtml = ref('')

// Rubric scoring scale (max points per criterion)
const RUBRIC_MAX = 4

// Compute weighted score per rubric and totals
function weighted(r) {
    return (r.score / RUBRIC_MAX) * r.weight
}

// Totals: simple integer sum of rubric points and normalized percent
const totalPoints = computed(() => rubrics.reduce((s, r) => s + (Number(r.score) || 0), 0))
const maxPoints = computed(() => rubrics.length * RUBRIC_MAX)
const normalizedPercent = computed(() => {
    const pct = maxPoints.value > 0 ? (totalPoints.value / maxPoints.value) * 100 : 0
    return Math.round(pct)
})

const twoDecimals = (n) => (Math.round(n * 100) / 100).toFixed(2)

// In-memory store used instead of localStorage
const memoryStore = new Map()

function storageKeyFor(projectId) {
    return `hackathon_review_${projectId}`
}

function saveReview() {
    const payload = {
        judge: judgeName.value,
        comments: comments.value,
        rubrics: rubrics.map(r => ({ id: r.id, score: r.score })),
        timestamp: new Date().toISOString(),
    }
    memoryStore.set(storageKeyFor(currentProject.value.id), payload)
    lastSaved.value = new Date().toLocaleString()
}

async function fetchReadme(url) {
    readmeContent.value = ''
    readmeHtml.value = ''
    readmeError.value = ''
    if (!url) {
        readmeContent.value = ''
        return
    }
    readmeLoading.value = true
    try {
        const res = await fetch(url, { mode: 'cors' })
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
        }
        const txt = await res.text()
        readmeContent.value = txt

        // Only attempt client-side markdown rendering in the browser (avoid SSR/runtime errors)
        if (typeof window === 'undefined') {
            // server-side: don't try to use browser-only libs
            return
        }

        try {
            // dynamic imports so the app can still run if deps aren't installed during build/dev
            const MarkdownIt = (await import('markdown-it')).default
            const createDOMPurify = (await import('dompurify')).default
            const Prism = (await import('prismjs')).default || (await import('prismjs'))

            const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
            const rawHtml = md.render(txt)

            // DOMPurify expects a window; create it and sanitize
            const DOMPurify = createDOMPurify(window)
            readmeHtml.value = DOMPurify.sanitize(rawHtml)

            // run highlighting (non-blocking)
            // load common languages if needed (optional)
            setTimeout(() => {
                try { Prism.highlightAll() } catch (e) { /* ignore */ }
            }, 0)
        } catch (e) {
            // If markdown libs are missing, gracefully fallback to plain text (readmeContent)
            // Developer: install `markdown-it`, `dompurify`, `prismjs` to enable rendered README.
            // e.g. `bun add markdown-it dompurify prismjs` or `npm i markdown-it dompurify prismjs`
            // console.warn('Markdown rendering disabled:', e)
        }

    } catch (e) {
        readmeError.value = 'Unable to load README. You can copy-paste content here or set a valid raw README URL.'
        readmeContent.value = ''
    } finally {
        readmeLoading.value = false
    }
}

function loadForProject(projectId) {
    const key = storageKeyFor(projectId)
    const p = memoryStore.get(key)
    if (p) {
        try {
            judgeName.value = p.judge || ''
            comments.value = p.comments || ''
            p.rubrics?.forEach(sr => {
                const r = rubrics.find(x => x.id === sr.id)
                if (r) r.score = sr.score
            })
            lastSaved.value = p.timestamp ? new Date(p.timestamp).toLocaleString() : ''
        } catch {
            // ignore
        }
    } else {
        judgeName.value = ''
        comments.value = ''
        rubrics.forEach(r => (r.score = 0))
        lastSaved.value = ''
    }

    // load README for the selected project (non-blocking)
    fetchReadme(currentProject.value.readmeRawUrl)
}

function clearScores() {
    rubrics.forEach(r => (r.score = 0))
    comments.value = ''
}

function setScore(r, v) {
    // toggle: clicking the selected value will clear it
    r.score = r.score === v ? 0 : v
}

function autoFillSample() {
    // pick random integer scores between 0 and RUBRIC_MAX
    rubrics.forEach((r) => {
        r.score = Math.floor(Math.random() * (RUBRIC_MAX + 1))
    })
    comments.value = 'Demo scores. Replace with your real evaluation.'
}

/* Watcher: when project changes, load persisted review */
watch(currentIndex, () => loadForProject(currentProject.value.id), { immediate: true })

import { onMounted, onUnmounted } from 'vue'

// dynamic theme support: detect global color mode changes (Nuxt UI toggles)
const isDark = ref(false)

function detectDarkFromDoc() {
    if (typeof document === 'undefined') return false
    const el = document.documentElement
    // Common patterns: data-color-mode, data-theme, or a `dark` class. Check several.
    const attrColor = el.getAttribute('data-color-mode')
    const attrTheme = el.getAttribute('data-theme')
    if (attrColor === 'dark' || attrTheme === 'dark') return true
    if (el.classList.contains('dark') || el.classList.contains('nuxt-color-mode--dark')) return true
    // fallback to prefers-color-scheme
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

let _mo = null
let _mq = null

onMounted(() => {
    // initialize
    isDark.value = detectDarkFromDoc()

    // observe attribute changes on html element (for data-color-mode or class toggles)
    try {
        _mo = new MutationObserver(() => {
            isDark.value = detectDarkFromDoc()
        })
        _mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-color-mode', 'data-theme'] })
    } catch (e) {
        // ignore
    }

    // listen to prefers-color-scheme changes as fallback
    try {
        _mq = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = () => { isDark.value = detectDarkFromDoc() }
        if (_mq.addEventListener) _mq.addEventListener('change', onChange)
        else if (_mq.addListener) _mq.addListener(onChange)
    } catch (e) {
        // ignore
    }
})

onUnmounted(() => {
    try { if (_mo) _mo.disconnect() } catch {}
    try { if (_mq) { if (_mq.removeEventListener) _mq.removeEventListener('change', () => {}) } } catch {}
})

</script>

<style scoped>
.voting-page {
    /* color tokens (light defaults) */
    --bg: #f5f7fa;
    --panel-bg: #ffffff;
    --text: #1f2937;
    --muted: #6b7280;
    --muted-2: #374151;
    --input-bg: #ffffff;
    --border: #e5e7eb;
    --media-start: #eef2ff;
    --media-end: #f8fafc;
    --panel-shadow: 0 2px 8px rgba(16,24,40,0.05);

    display: grid;
    /* left has a min and a capped percentage, right gets the rest (wider right pane) */
    grid-template-columns: minmax(260px, 34%) minmax(560px, 1fr);
    min-height: 100vh;
    gap: 1rem;
    padding: 1rem;
    padding-top: 1rem;
    position: relative; /* anchor for absolute nav */
    box-sizing: border-box;

    background: var(--bg);
    color: var(--text);
    transition: background .25s ease, color .25s ease;
}

/* dark mode overrides */
@media (prefers-color-scheme: dark) {
    .voting-page {
        --bg: #071026;
        --panel-bg: #071226;
        --text: #e6eef8;
        --muted: #9ca3af;
        --muted-2: #cbd5e1;
        --input-bg: #0b1522;
        --border: rgba(255,255,255,0.06);
        --media-start: #031022;
        --media-end: #071520;
        --panel-shadow: none;
    }
}

/* also support explicit toggle via `.is-dark` class on the root .voting-page */
.voting-page.is-dark {
    --bg: #071026;
    --panel-bg: #071226;
    --text: #e6eef8;
    --muted: #9ca3af;
    --muted-2: #cbd5e1;
    --input-bg: #0b1522;
    --border: rgba(255,255,255,0.06);
    --media-start: #031022;
    --media-end: #071520;
    --panel-shadow: none;
}

.left-pane {
    background: var(--panel-bg);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: var(--panel-shadow);
    display: flex;
    flex-direction: column;
    color: var(--text);
    min-height: 0; /* allow children flex:1 to control scrolling */
}

.project-nav {
    display: flex;
    align-items: center;
    justify-content: flex-start; /* left align children; we'll center the nav block itself */
    gap: .5rem;
    margin: 0 0 1rem 0;
    /* span across the grid so it sits above both panels */
    grid-column: 1 / -1;
    width: 100%;
    z-index: 40;
    position: relative; /* keep header in-flow but allow internal alignment */
}

.project-nav .nav-center {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: min(760px, calc(100% - 2rem));
    gap: 1rem;
    margin: 0 auto; /* center this block within the header */
}
.project-nav .nav-prev,
.project-nav .nav-next {
    flex: 0 0 auto;
}
.project-nav .proj-title { flex: 1 1 auto; text-align: center; margin: 0; }
.project-nav .nav-right { position: static; margin-left: 0; }
.project-nav button {
    padding: .4rem .6rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--input-bg);
    color: inherit;
    cursor: pointer;
}
.project-nav button:disabled { opacity: .4; cursor: not-allowed; }
.proj-title { text-align: center; margin: 0; font-size: 1.05rem; }

.project-info { overflow: auto; padding-right: .2rem; }
.meta { margin: 0.2rem 0; color: var(--muted-2); }
.abstract {
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    padding: .5rem;
    border-radius: 6px;
    color: var(--muted-2);
}
.media-placeholder { display: flex; gap: .5rem; margin-top: .5rem; }
.media-item {
    flex: 1;
    min-height: 80px;
    border-radius: 6px;
    background: linear-gradient(180deg, var(--media-start), var(--media-end));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted-2);
    border: 1px dashed var(--border);
}

.left-footer { margin-top: 0.5rem; text-align: right; color: var(--muted); }

.readme-container { margin-top: .5rem; display: flex; flex-direction: column; flex: 1; }
.readme {
    background: var(--input-bg);
    border: 1px solid var(--border);
    padding: .8rem;
    border-radius: 6px;
    /* fill left pane height */
    flex: 1;
    max-height: none;
    overflow: auto;
    /* allow normal pre/code rendering */
    white-space: normal;
    color: inherit;
}
/* GitHub-like font for rendered markdown in the left pane */
.readme, .readme * {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: inherit;
}

.readme-header { margin: 0 0 .5rem 0; font-size: 1rem; color: var(--muted-2); }

.right-pane {
    background: var(--panel-bg);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: var(--panel-shadow);
    display: flex;
    flex-direction: column;
    gap: .75rem;
    color: var(--text);
}

.grading-header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 1rem;
}
.judge-meta { display: flex; gap: 1rem; align-items: center; }
.judge-meta input {
    padding: .4rem .5rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--input-bg);
    color: inherit;
}

.score-summary { text-align: right; font-size: .95rem; color: var(--text); }

.instructions summary { cursor: pointer; font-weight: 600; margin-bottom: .25rem; }
.instructions ol { margin: .5rem 0 0 1.1rem; color: var(--muted-2) }

.rubrics { overflow: visible; max-height: none; padding-right: .2rem; }
.rubric-row { display: grid; grid-template-columns: 1fr 340px; gap: .75rem; padding: .6rem; border-bottom: 1px solid var(--border); align-items: center; }
.rubric-title { display: flex; gap: .5rem; align-items: baseline; }
.weight { color: var(--muted); font-size: .85rem; }
.rubric-desc { font-size: .9rem; color: var(--muted-2); margin-top: .3rem; }

.rubric-controls { display: flex; gap: .5rem; align-items: center; }
.rubric-controls input[type="range"] { width: 100%; }
.score-box { display: flex; flex-direction: column; align-items: flex-end; gap: .25rem; width: 130px; }
.score-box input[type="number"] {
    width: 90px;
    padding: .3rem .4rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    text-align: right;
    background: var(--input-bg);
    color: inherit;
}
.weighted { font-size: .85rem; color: var(--muted-2) }

.comments textarea {
    width: 100%;
    padding: .6rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    resize: vertical;
    background: var(--input-bg);
    color: inherit;
}

.actions { display: flex; gap: .6rem; align-items: center; margin-top: 10px; }
.actions button {
    padding: .5rem .7rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--input-bg);
    color: inherit;
    cursor: pointer;
}
.btn-save { background: linear-gradient(90deg,#2563eb,#7c3aed); color: #fff; border: none; }
.last-saved { margin-left: auto; color: var(--muted); font-size: .85rem; }

/* Rubric table styles */
.rubric-table { width: 100%; border-collapse: collapse; margin-top: .5rem; table-layout: fixed; }
.rubric-table th, .rubric-table td { border: 1px solid var(--border); padding: .5rem; text-align: left; vertical-align: top; }
.rubric-table th { background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01)); font-weight: 600; }
.rubric-table input[type="number"] { width: 90px; padding: .25rem; border-radius: 6px; border: 1px solid var(--border); background: var(--input-bg); color: inherit; }
.rubric-desc { color: var(--muted-2); font-size: .9rem; }

.rubric-table .criterion-cell { width: 45%; }
.rubric-table .score-col { text-align: center; width: 11%; font-size: .95rem; }
.score-cell { text-align: center; cursor: pointer; user-select: none; background: transparent; }
.score-cell:hover { background: rgba(0,0,0,0.03); }
.score-cell.selected { background: linear-gradient(90deg, rgba(37,99,235,0.15), rgba(124,58,237,0.12)); border-radius: 4px; }
.score-cell[tabindex] { outline: none; }
.score-cell:focus { box-shadow: 0 0 0 3px rgba(37,99,235,0.12); border-radius: 4px; }

/* Help icon and tooltip */
.help-icon-container { display: inline-block; position: relative; margin-left: .5rem; z-index: 10; }
.help-icon { display: inline-block; width: 18px; height: 18px; line-height: 18px; text-align: center; border-radius: 50%; background: var(--input-bg); border: 1px solid var(--border); color: var(--muted-2); font-size: 12px; cursor: default; }
.help-icon-container:focus { outline: none; }
.tooltip { position: absolute; left: 100%; top: 50%; transform: translate(8px, -50%); z-index: 1000; background: var(--panel-bg); color: var(--text); border: 1px solid var(--border); box-shadow: var(--panel-shadow); padding: .6rem; border-radius: 6px; width: 280px; max-width: 70vw; visibility: hidden; opacity: 0; pointer-events: none; transition: opacity 120ms ease, visibility 120ms ease; }
.help-icon-container:hover .tooltip, .help-icon-container:focus-within .tooltip { visibility: visible; opacity: 1; pointer-events: auto; }
.tooltip-title { font-weight: 700; margin-bottom: .25rem }
.tooltip-desc { color: var(--muted-2); font-size: .9rem; margin-bottom: .4rem }
.tooltip-weight { color: var(--muted); font-size: .85rem }

.crit-abbr { display: inline-block; padding: .08rem .35rem; border-radius: 4px; background: linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01)); margin-left: .3rem; font-size: .95rem }
.crit-title { margin-bottom: .25rem }
.crit-desc { color: var(--muted-2); font-size: .9rem }
.rubric-table .weighted { text-align: right; font-weight:600 }

/* project-nav helpers (no duplicate root rules) */
.project-nav .nav-left { display:flex; gap:.5rem; align-items:center }
.proj-title { margin: 0; font-size: 1.05rem; }

/* responsive */
@media (max-width: 900px) {
    .voting-page { grid-template-columns: 1fr; grid-auto-rows: auto; height: auto; }
    .left-pane { order: 2; }
    .right-pane { order: 1; }
}
</style>