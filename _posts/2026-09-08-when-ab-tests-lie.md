---
layout: post
title: "When A/B Tests Lie"
category: Experimentation
read_time: 7
description: "Sample-ratio mismatch, peeking, interference, and other ways a clean-looking experiment can mislead you."
---
## Randomized does not mean automatically valid

A/B testing is powerful because randomization creates a credible counterfactual. But a randomized experiment can still produce a misleading answer when the implementation or analysis violates the design.

### 01 — Sample-ratio mismatch

If a 50/50 test is receiving 62/38 traffic, stop.

Before interpreting treatment effects, investigate assignment, exposure, eligibility, logging, and filtering. A broken allocation mechanism can invalidate the inference.

### 02 — Peeking

Repeatedly checking significance and stopping when the p-value crosses a threshold changes the error rate.

A better workflow is to define the analysis window and decision rule in advance. If continuous monitoring is genuinely required, use a sequential testing framework designed for it.

### 03 — Interference

Randomization assumes one user's treatment does not change another user's outcome.

That assumption can fail in marketplaces, social products, and networked systems. Treating sellers independently while their buyers experience the treatment, for example, can create spillovers.

### 04 — Heterogeneous treatment effects

An average treatment effect can hide meaningful segments.

A positive average may coexist with negative effects for an important user group. Segment analysis should be hypothesis-driven rather than a fishing expedition across dozens of cuts.

### The pre-analysis checklist

```text
UNIT → ELIGIBILITY → RANDOMIZATION
  ↓
EXPOSURE → PRIMARY METRIC → GUARDRAILS
  ↓
MDE → ANALYSIS WINDOW → DECISION RULE
```

The experiment is not the SQL query at the end. The experiment is the entire chain of assumptions that makes that query interpretable.

### Final takeaway

The most dangerous A/B test is not one with an obviously broken dashboard.

It is one that looks perfectly clean while quietly violating the assumptions required for causal interpretation.
