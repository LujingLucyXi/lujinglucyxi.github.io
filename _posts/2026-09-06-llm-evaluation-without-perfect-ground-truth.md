---
layout: post
title: "Evaluating LLM Products Without Perfect Ground Truth"
category: AI / Evaluation
read_time: 14
description: "How to build useful evaluation systems when there is no single “correct” answer — with a case study on an LLM-driven policy evaluation framework I built for policy quality and downstream communications alignment."
---

## The evaluation problem

Traditional software has deterministic expectations: an input maps to a known correct output, and a test either passes or fails. LLM outputs break that contract. For most real prompts, many responses can be simultaneously useful, correct, safe, and stylistically appropriate — and many others can be subtly wrong in ways no exact-match test will ever catch.

This is the core difficulty: **there is often no single ground-truth answer to compare against.** You cannot diff the output against a golden string, and you cannot assume that a fluent, confident answer is a good one.

That reframes the work. Evaluating an LLM product is not a testing problem you solve once — it is a *product design and measurement problem* you operate continuously. The goal is not to discover one perfect score. It is to build a reliable feedback system that tells a team **what changed, whether it matters, and where the model is still failing.**

The rest of this post walks through how I think about building that system, and then grounds it in a concrete example: an LLM-driven framework I designed at TikTok Shop to evaluate policy quality and the alignment of downstream seller communications.

---

## Start with a rubric, not a score

The most common mistake is asking "is this answer good?" — a question so broad that two reasonable people will disagree, and the same person will disagree with themselves a week later. Quality has to be *decomposed* into observable, independently-judgeable dimensions before it can be measured.

```text
QUALITY
├── Correctness          — are the claims factually and logically right?
├── Relevance            — does it address the actual user intent?
├── Completeness         — does it cover what a good answer must cover?
├── Faithfulness         — is it grounded in the provided source/context?
├── Safety               — does it avoid harmful or policy-violating output?
└── Instruction following — does it respect format, tone, and constraints?
```

Each dimension needs three things to be usable:

1. **An operational definition** — a sentence a stranger could apply consistently.
2. **Anchored examples** — concrete pass, borderline, and fail cases for each score level.
3. **A scale that matches the decision** — binary for gating, a 1–5 scale for tracking gradual improvement.

A rubric is not bureaucracy. It is the interface between a fuzzy human notion of "good" and a repeatable measurement. If you cannot write the rubric, you do not yet understand what you are trying to ship.

---

## Build representative test sets

An evaluation is only as trustworthy as the examples it runs on. A benchmark built from easy synthetic prompts will report a healthy score while the product quietly fails in production. Your test set should be a *sample of reality*, deliberately stratified to include the cases that matter:

- **Common user journeys** — the high-frequency paths that define the everyday experience.
- **High-value edge cases** — rare inputs where a mistake is expensive.
- **Known failure modes** — everything the model has gotten wrong before.
- **Adversarial cases** — prompt injection, jailbreaks, and manipulative inputs.
- **Domain- and locale-specific cases** — regulatory, multilingual, or vertical nuances.

Two principles keep a test set honest over time. First, **weight by impact, not just frequency** — a rare catastrophic failure can matter more than a common minor one. Second, **treat the test set as a living asset** — every genuine production failure should end up in it, or you will keep re-discovering the same bug.

---

## Combine evaluation methods — and know what each one can't see

No single evaluation method is complete. The practical move is to layer methods that fail in *different* ways, so each covers the others' blind spots.

```text
                     EVALUATION LAYERS
        ┌───────────────┬───────────────┬───────────────┐
        │     RULES     │  MODEL-BASED  │     HUMAN      │
        │ deterministic │  LLM-as-judge │  expert review │
        │ cheap, exact  │ scalable, fuzzy│ rich, costly  │
        └───────┬───────┴───────┬───────┴───────┬───────┘
                └───────────────┼───────────────┘
                                ▼
                        AGGREGATE SCORE
                                ▼
                          ERROR ANALYSIS
                                ▼
                          REGRESSION SET
```

- **Rule-based checks** are cheap and exact — schema validity, banned phrases, required disclaimers, length limits. They catch the mechanical failures with certainty, but they are blind to meaning.
- **Model-based evaluation (LLM-as-judge)** scales judgment to thousands of cases and can reason about relevance and tone. But it inherits the biases of the judge model — position bias, verbosity bias, self-preference — and must itself be validated.
- **Human evaluation** provides the richest, most trustworthy judgment and is the only reliable anchor for subjective quality. It is also slow and expensive, so it is best spent on calibration, gold labels, and the ambiguous cases the other layers flag.

The point is not to pretend one layer is perfect. It is to understand precisely what each one *can* and *cannot* detect, and to route each case to the cheapest layer that can judge it reliably.

---

## Validate the judge before you trust the judge

When you use an LLM to grade other LLM outputs, the judge becomes a model you are shipping — and it needs its own evaluation. An unvalidated judge just launders bias into an official-looking number.

Validate it the same way you would any classifier: **against a human-labeled gold set.** Measure the judge's agreement with expert humans, check for systematic skew (does it reward longer answers? prefer its own phrasing?), and calibrate its thresholds so its scores line up with human decisions. Only once the judge tracks human judgment can you responsibly scale it.

The same logic applies to your humans. If two trained reviewers frequently disagree, the problem often is not the model — **it is the rubric.** Ambiguous criteria produce noisy labels, and noisy labels make every downstream number meaningless. That makes **inter-rater agreement and calibration first-class metrics of the evaluation system itself**, not afterthoughts.

---

## Case study: an LLM-driven policy evaluation framework

Here is how these ideas came together in practice. At TikTok Shop, I owned governance analytics, and one persistent problem had no clean ground truth: **how do you know whether a policy is actually good, and whether the messages sellers receive about it faithfully reflect it?**

Two distinct questions were tangled together:

1. **Policy Quality** — is the policy itself clear, complete, enforceable, and internally consistent?
2. **Communications Alignment** — do the downstream artifacts sellers actually see (notifications, help-center articles, enforcement notices, in-app banners) accurately and comprehensibly convey that policy?

Neither had a "correct answer" to grade against. A policy isn't right or wrong; it's more or less clear and enforceable. A seller notification isn't a string match; it's more or less faithful to the underlying rule. This is exactly the no-ground-truth regime, so I built an LLM-driven evaluation framework in partnership with engineering and ML.

### 1. Decompose each question into a rubric

Rather than scoring "good policy," I split each side into observable dimensions with operational definitions and anchored examples:

```text
POLICY QUALITY                     COMMUNICATIONS ALIGNMENT
├── Clarity (unambiguous language) ├── Faithfulness (matches the policy)
├── Completeness (covers cases)    ├── Comprehensibility (seller can act)
├── Enforceability (operationally  ├── Completeness (no omitted rules)
│   testable)                      ├── Tone (appropriate, non-alarming)
├── Consistency (no internal or    └── Actionability (clear next step)
│   cross-policy conflicts)
└── Scope (edge cases addressed)
```

The alignment side was the subtle one. The failure mode wasn't a factually false notice — it was **drift**: a communication that was individually plausible but no longer matched the current policy, or that technically matched but a seller couldn't understand or act on. That is precisely the kind of error exact-match testing never catches.

### 2. Build a representative, stratified test set

I assembled an evaluation set spanning high-frequency violation scenarios, high-value edge cases, known past ambiguities, and multiple seller segments — the same real journeys that drove enforcement across 300K+ sellers. Every historical dispute or comprehension failure became a case in the set, so the benchmark reflected how policy actually landed, not how we hoped it would.

### 3. Layer the evaluation methods

- **Rules** caught mechanical drift — required disclaimers, mandatory appeal-path language, banned ambiguous phrasing.
- **LLM-as-judge** scored each policy–communication pair against the rubric at scale: given the source policy and the downstream artifact, rate faithfulness, comprehensibility, and completeness, and flag any claim in the communication not supported by the policy.
- **Human expert review** from policy and legal partners anchored the subjective dimensions and provided the gold labels.

### 4. Validate the judge against human labels

Before trusting a single automated number, I calibrated the LLM judge against expert-labeled examples, measured agreement, and corrected for verbosity and leniency skew. I tracked inter-rater agreement among the human reviewers too — where they disagreed, we usually found an ambiguous rubric criterion and sharpened it. The rubric and the judge improved together.

### 5. Close the loop into policy operations

The framework wasn't a one-off audit. It became a continuous system: production comprehension failures and appeals flowed back into the test set, scores surfaced which policies and which communications were drifting, and those signals fed directly into policy rewrites and communication updates — which were then re-evaluated as regression cases before going live.

### The outcome

Framed this way, evaluation stopped being a subjective debate and became a measurable, reviewable pipeline. The framework drove roughly **+15% outperformance against governance targets** and measurably improved **policy comprehension** among sellers — because we could finally see, quantitatively, where a policy was unclear or where its downstream communications had drifted out of alignment, and fix the specific gap instead of guessing.

---

## Close the loop

The strongest evaluation systems are not static benchmarks; they are feedback machines that continuously convert failures into future defenses.

```text
PRODUCTION FAILURE
       ↓
ERROR ANALYSIS        ← cluster failures, find the pattern
       ↓
NEW EVAL CASE         ← encode the failure so it can't recur silently
       ↓
MODEL / PROMPT CHANGE ← fix the underlying cause
       ↓
REGRESSION TEST       ← prove the fix, guard against relapse
       ↓
RELEASE
```

Each trip around this loop makes the benchmark a more faithful mirror of reality, and each caught regression is a failure that will never surprise a user again.

---

## Final takeaway

For LLM products, **evaluation is infrastructure** — as foundational as your deployment pipeline or your monitoring stack, not a checklist you run before launch.

You will rarely have perfect ground truth. That is fine. The job is not to find one flawless score; it is to build a reliable, well-calibrated feedback system that tells your team what changed, whether it matters, and where the model is still failing — so that every release is grounded in evidence instead of intuition.
