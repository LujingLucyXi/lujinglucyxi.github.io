---
layout: post
title: "Evaluating AI Agents in Production: When the Model Takes Actions"
category: AI / Frontier
read_time: 14
description: "Agentic AI shifts the hard problem from judging text to judging behavior over long, branching trajectories. Here's how to measure agents that act, not just answer."
---

## From answers to actions

The last wave of LLM products was about generating *text* — you evaluated an output. The current frontier is **agents**: systems that plan, call tools, take multi-step actions, and pursue goals over time. That shift breaks most of the evaluation intuitions that worked for single-turn chat.

When a model just answers, you judge one output. When an agent *acts*, you have to judge an entire **trajectory** — a branching sequence of decisions, tool calls, and recoveries, where a locally reasonable step can lead to a globally wrong outcome, and where the same task can be solved by many valid paths. This is the no-ground-truth problem from single-turn evaluation, raised to a much higher power.

This post is about how to think rigorously about evaluating agents that take actions in the real world.

---

## Why agent evaluation is genuinely harder

Three properties make agents resist the evaluation playbook that works for text:

- **Trajectories compound.** A 95% reliable step is only ~60% reliable over ten steps. Small per-action error rates become large per-task failure rates, so measuring a single step tells you little about the whole task.
- **Many paths are valid.** There is rarely one correct sequence of actions. Two agents can reach the right outcome through completely different tool calls, so you cannot grade against a fixed "golden trajectory."
- **Actions have consequences.** An agent doesn't just say the wrong thing — it can send the wrong email, delete the wrong record, or spend real money. Evaluation has to account for the *cost of being wrong*, not just whether it was wrong.

Together these mean you need to evaluate at multiple altitudes at once: the final outcome, the path taken to get there, and the individual decisions along the way.

---

## Evaluate at three altitudes

```text
AGENT EVALUATION ALTITUDES
┌──────────────────────────────────────────────┐
│ OUTCOME     Did it achieve the goal?          │  ← what the user cares about
│             (task success, side effects)      │
├──────────────────────────────────────────────┤
│ TRAJECTORY  Was the path sound?               │  ← efficiency & safety of process
│             (steps, cost, tool errors, loops) │
├──────────────────────────────────────────────┤
│ STEP        Was each decision reasonable?     │  ← where failures actually originate
│             (right tool, valid args, recovery)│
└──────────────────────────────────────────────┘
```

- **Outcome-level** is what ultimately matters: did the agent accomplish the goal, and did it avoid harmful side effects? This is your headline metric, but on its own it's a black box — it tells you *that* the agent failed, not *why*.
- **Trajectory-level** measures the quality of the process: number of steps, total cost and latency, tool-call error rate, whether it looped or thrashed, whether it recovered from errors. Two agents with identical success rates can have wildly different trajectory economics.
- **Step-level** is where you find root cause: did it pick the right tool, pass valid arguments, interpret the result correctly, and adapt when something failed? Most task failures trace back to a specific decision point, and only step-level evaluation surfaces it.

You need all three. Outcome tells you *whether*, trajectory tells you *how well*, and step tells you *where to fix*.

---

## Build environments, not just test sets

For single-turn models, a test set is a list of inputs. For agents, the equivalent is a **sandboxed environment** the agent can actually act in — with tools it can call, state it can change, and a way to score the resulting world state.

This matters because you cannot safely evaluate a real agent against production systems (it might actually send the emails). The move is to build reproducible, instrumented environments — mock tools, seeded state, deterministic where possible — so you can:

- run the same task many times and measure **variance**, not just a single lucky pass;
- inject failures (a tool times out, an API returns garbage) and measure **recovery**;
- replay a captured production failure as a **regression case** with its full context.

The environment *is* the benchmark. Its fidelity to the real world caps how much your scores mean.

---

## Judge process, but anchor on outcomes

Because there's no golden trajectory, you'll lean heavily on **LLM-as-judge** to assess whether a *path* was reasonable — was the plan coherent, were the tool choices sensible, did it recover gracefully? That's powerful and scalable, but it carries a specific danger with agents: **rewarding plausible-looking process that didn't actually work.**

The discipline is to keep judges anchored to verifiable outcomes wherever you can:

- Prefer **programmatic checks on end state** (is the record correct? did the transaction settle?) over subjective judgments of niceness. Ground truth on *outcomes* is often available even when ground truth on *paths* is not.
- Use the LLM judge for the genuinely subjective parts — plan quality, explanation, graceful failure — and **validate that judge against human labels**, exactly as you would any evaluator.
- Watch for the agent gaming the judge: an agent that learns to *narrate* competence without achieving it is a real and observed failure mode.

Process metrics tell you how to improve; outcome metrics keep you honest about whether it's actually working.

---

## Measure safety and cost as first-class metrics

For agents, "did it work?" is incomplete. Two failure modes matter as much as task success:

```text
BEYOND SUCCESS RATE
├── Safety      — harmful / irreversible actions, permission violations,
│                 unintended side effects, prompt-injection susceptibility
└── Economics   — steps, tokens, tool calls, latency, $ per completed task
```

An agent that completes 90% of tasks but occasionally takes an irreversible harmful action is not 90% good — it may be unshippable. Likewise, an agent that succeeds but burns ten times the necessary cost and time may lose to a simpler system. **Safety and efficiency are not footnotes to accuracy; they are part of the definition of a working agent.**

Prompt injection deserves special mention: because agents read untrusted content (web pages, documents, tool outputs) and then take actions, adversarial inputs can hijack behavior. Adversarial cases belong in every agent eval suite, not just security reviews.

---

## Close the loop with production telemetry

Offline environments will never fully anticipate reality. The strongest agent evaluation systems are tightly coupled to production observability.

```text
PRODUCTION TRACE (every step, tool call, decision logged)
     ↓
FAILURE DETECTED  (outcome miss, safety violation, cost blowup)
     ↓
ROOT-CAUSE AT STEP LEVEL
     ↓
REPLAY AS ENVIRONMENT CASE
     ↓
FIX (prompt / tool / policy / guardrail)
     ↓
REGRESSION TEST IN SANDBOX
     ↓
RELEASE
```

The key enabler is **full-trajectory tracing**: log every step, tool call, argument, and result so a production failure can be reconstructed and turned into a permanent regression case. Without that observability, an agent failure is a mystery; with it, it's a test you'll never fail the same way twice.

---

## Final takeaway

Evaluating agents is evaluating **behavior**, not text. That means judging at three altitudes — outcome, trajectory, and step — inside realistic sandboxed environments, anchoring subjective judgments to verifiable end states, and treating safety and cost as first-class metrics rather than afterthoughts.

The principle from single-turn evaluation still holds, only more so: you will rarely have perfect ground truth, and the goal is not a single perfect score. It is a reliable, well-instrumented system that tells you what your agent did, whether it was safe and worth the cost, and exactly where it went wrong — so the next release is grounded in evidence instead of hope.
