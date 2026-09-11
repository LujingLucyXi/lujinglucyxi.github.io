---
layout: post
title: "Real-Time Risk: The New Data Stack Behind Fraud Decisioning"
category: Fintech / Risk
read_time: 8
description: "How streaming data, feature stores, and machine-speed models collapse the gap between a transaction and a decision — and the startups building the rails."
---
## The 300-millisecond problem

Every card swipe, ACH push, account signup, and instant payout now carries an implicit deadline. The user is staring at a spinner. The fraudster is exploiting the same speed. And the risk team has, on average, a few hundred milliseconds to answer a deceptively hard question: *is this real?*

For most of fintech's history, the answer arrived too late — a nightly batch job, a chargeback three weeks later, a spreadsheet a human eventually opened. That worked when money moved slowly. It breaks in a world of real-time rails (FedNow, RTP, instant payouts, stablecoin settlement), where a fraudulent transfer is irreversible before the batch job ever runs.

The frontier of data, AI, and fintech right now isn't a flashy consumer app. It's the unglamorous, high-stakes **real-time risk stack**: the streaming pipelines, feature stores, and low-latency models that decide, in the moment, whether to approve, decline, step up, or freeze.

## What actually changed

Three shifts turned real-time risk from nice-to-have into table stakes:

- **Money got faster than fraud review.** Irreversible instant payments removed the safety net of clawbacks. If you can't decide in real time, you can't decide at all.
- **Signals got richer.** Device fingerprints, behavioral biometrics, network graphs, and session telemetry generate thousands of features per event — far more than a hand-written rules engine can absorb.
- **The tooling matured.** Streaming infrastructure, online feature stores, and cheap inference made it feasible to score a transaction with fresh features *in-line*, not after the fact.

The result is one architectural pattern repeating across the industry:

```text
EVENT STREAM
      ↓
REAL-TIME FEATURE COMPUTATION
      ↓
MODEL INFERENCE
      ↓
POLICY / DECISION LAYER
      ↓
CASE MANAGEMENT (human in the loop)
      ↓
FEEDBACK INTO LABELS
```

The winners are the companies turning that pattern into a product.

## The startups building the rails

A cohort is racing to own different layers of this stack:

- **Sardine** — device intelligence and behavioral biometrics fused into a real-time risk score across fraud, AML, and payments, claiming decisioning in under 150ms and now layering in AI agents that automate alert reviews and regulatory filings. Named a Leader in Forrester's Q3 2026 Financial Crime Management Wave; used by 300+ banks and fintechs. The bet: the richest early signal is *how* a user behaves, not just *what* they submit.
- **Unit21** — the pioneer of *no-code* tooling for risk and compliance teams, relaunched in March 2026 as "AI Risk Infrastructure" built around agentic AI that tunes rules, investigates alerts, and files reports end-to-end. Its enduring wedge is the decision and case-management layer for analysts, not just data scientists (customers include Chime and Intuit).
- **Taktile** — a no-code decision-engine platform for credit and fraud (founded 2020 by ex-QuantCo Harvard alums) that treats risk policy as a product surface: build with low-code blocks, then backtest, A/B test, and monitor decision flows the way software teams ship code. Customers include Mercury and Zilch.
- **Oscilar** — founded by Confluent and Apache Kafka co-creator Neha Narkhede, explicitly AI-native and streaming-first, unifying fraud, credit, and compliance decisioning on one backbone. Its Agent Hub spans fraud, compliance, credit, and onboarding; customers include SoFi and MoneyGram.

Adjacent players — Alloy (identity decisioning), Hummingbird (compliance case work) — are converging on the same center of gravity: the *decisioning platform*, not the point solution. What unites them is that they don't sell a single model. They sell the infrastructure to compute features fast, decide consistently, explain the decision, and learn from the outcome.

## The data problems nobody puts on the landing page

**01 — Train/serve skew.** Features computed in a batch training pipeline must match, to the decimal, the features computed live in a sub-150ms budget. When they drift apart, your offline AUC lies to you. This is why online feature stores are the real center of gravity — not the model architecture.

**02 — Label latency and selection bias.** Fraud labels arrive late and biased. A "good" transaction today may be confirmed fraud in 60 days. And you only see outcomes for transactions you *approved* — the declines are a counterfactual black hole that quietly poisons the next model.

**03 — Adversarial drift.** Unlike a churn model, the thing you're predicting actively fights back. Patterns mutate in response to your defenses, so a model that was excellent last quarter decays on purpose. Fast retraining isn't hygiene here; it's survival.

**04 — The explainability tax.** A declined loan or frozen account can trigger regulatory obligations (adverse-action reasons, fair-lending scrutiny). A black-box score isn't enough — the stack must emit a *reason*. This is why decision layers, not just models, are winning: they make the logic auditable.

## Where AI changes the shape of the problem

Two developments are reshaping the stack:

- **Graph and embedding-based detection.** Fraud is relational — rings, mule networks, shared devices. Representing entities as embeddings in a graph surfaces coordinated abuse that per-transaction models miss.
- **LLMs in the investigation loop.** The emerging move isn't LLMs making the approve/decline call (too slow, too opaque for the hot path). It's LLMs *compressing the investigation*: summarizing a case, drafting a SAR narrative, explaining why a rule fired, triaging the alert queue. Agentic workflows attack the real bottleneck — the cost of human review — not the millisecond decision.

## Why this matters for a data professional

Real-time risk is one of the most intellectually honest problems in the field. It punishes the things that are easy to fake — a good offline metric, a clean demo — and rewards the hard things: pipeline discipline, causal thinking about biased labels, monitoring, and the humility to keep a human in the loop.

It also sits exactly where the industry is converging: streaming data infrastructure, applied machine learning, and regulated financial decisioning. These companies are building the nervous system for money that now moves at machine speed. The batch era is over. What replaces it — fast, explainable, adversarial, human-supervised decisioning — is where the next decade of fintech data work will be done.
