---
layout: post
title: "When A/B Tests Lie"
category: Experimentation
read_time: 12
description: "Why a statistically clean experiment can still produce the wrong product decision—and how marketplace teams design experimentation systems they can actually trust."
---

## Randomization is powerful. It is not magic.

A/B testing gives product teams something unusually valuable: a credible counterfactual.

If treatment and control are assigned correctly, we can ask:

> **What would have happened to the treated population if it had not received the treatment?**

That question is the foundation of modern product experimentation.

But it is also where many teams stop thinking.

They randomize users, calculate a treatment effect, check a p-value, and call the experiment rigorous.

In real products, the hard part starts before the statistical test.

Traffic can be assigned incorrectly. A user can be randomized into treatment without ever seeing the feature. A treatment can change the environment experienced by control users. A metric can be defined differently by two teams. A ranking experiment can have such a weak signal that an ordinary A/B test takes weeks to learn anything useful. And an average treatment effect can look positive while an economically important segment gets worse.

The SQL can be perfectly correct.

The statistics can be perfectly correct.

And the **decision can still be wrong**.

That is why I think about experimentation as a system:

```text
PRODUCT QUESTION
       ↓
CAUSAL DESIGN
       ↓
ELIGIBILITY
       ↓
RANDOMIZATION
       ↓
EXPOSURE
       ↓
MEASUREMENT
       ↓
ESTIMATION
       ↓
DIAGNOSIS
       ↓
DECISION
```

A failure anywhere in this chain can invalidate the conclusion downstream.

The most interesting experimentation problems are therefore not:

> "How do I calculate a p-value?"

They are:

> **"What would make this experiment answer the wrong question?"**

---

# A useful mental model: four ways an experiment can lie

I find it useful to classify experimentation failures into four layers:

```text
1. DESIGN
   Are we randomizing the right thing?

2. MEASUREMENT
   Are we measuring what actually happened?

3. ESTIMATION
   Are we using a statistical method appropriate
   for the experimental structure?

4. DECISION
   Even if the estimate is valid, does it
   imply that we should ship?
```

These are different failure modes.

A switchback experiment can have excellent measurement and still require a different estimator than a user-level A/B test.

A perfectly randomized experiment can have a broken exposure pipeline.

A statistically significant result can be economically meaningless.

And a positive average effect can hide a harmful segment.

The rest of this article is about what those failures look like in practice.

---

# 01 — Randomization does not guarantee independence

The first question I ask is:

**What exactly are we randomizing?**

A user?

A seller?

A session?

A delivery?

A geographic region?

A time interval?

The answer should follow the causal structure of the product, not the convenience of the experimentation platform.

## The DoorDash example

DoorDash has written extensively about this problem in its logistics marketplace.

Consider two deliveries that arrive at roughly the same time while only one Dasher is available.

If a new dispatch algorithm gets the treatment delivery assigned first, that decision can affect the control delivery because both deliveries compete for the same supply.

The experiment might look like:

```text
Delivery A → Treatment
Delivery B → Control
```

But the observations are not independent.

Treatment changed the environment in which control operates.

This is a classic marketplace interference problem.

DoorDash addresses this class of problem with **switchback experiments**, randomizing treatment and control across geographic-region/time units rather than individual deliveries. That keeps the marketplace state more coherent within an experimental unit and reduces interference between treatment and control. 

The conceptual difference is:

```text
Naive A/B

Order 1 → T
Order 2 → C
Order 3 → T
Order 4 → C


Switchback

Region A · 10:00–10:30 → T
Region A · 10:30–11:00 → C
Region A · 11:00–11:30 → T
```

The second design is less granular.

But it may be **more causally valid**.

That is an important experimentation lesson:

> **More randomization units do not automatically mean more information.**

If the units interact with each other, you may be manufacturing independence that does not exist in the real system.

---

# 02 — The experiment unit should match the product mechanism

This leads to a broader design principle:

```text
What receives treatment?
        ↓
What experiences treatment?
        ↓
What produces the outcome?
        ↓
What can influence another experimental unit?
```

If those answers are different, investigate the causal structure.

For example, a seller-level intervention might be assigned to sellers while the outcome is measured on buyers.

That can be valid.

But it raises questions:

- Can buyers interact with multiple sellers?
- Can one seller's treatment affect another seller?
- Does the intervention change supply, ranking, price, or availability?
- Can the treatment alter the population exposed to control?
- Is the true independent unit the seller, buyer, market, or time window?

These questions matter more than whether the experiment dashboard says:

```text
Treatment: 50.1%
Control:   49.9%
```

A beautifully balanced experiment can still be badly designed.

---

# 03 — Sample-ratio mismatch is a data-quality alarm

Suppose a test is configured for 50/50 allocation.

The experiment dashboard reports:

```text
CONTROL      50.0%
TREATMENT    50.0%
```

Looks perfect.

But the raw assignment table says:

```text
CONTROL      62.0%
TREATMENT    38.0%
```

That is **sample-ratio mismatch (SRM)**.

SRM is not itself proof that the treatment effect is biased.

It is something more useful:

**a signal that the experimental pipeline may not be behaving as designed.**

Possible causes include:

- assignment logic bugs
- inconsistent eligibility rules
- identity stitching problems
- missing assignment events
- delayed exposure logging
- bot or internal traffic
- users switching devices
- downstream filtering
- treatment exposure occurring before enrollment

I like to reconcile the population as a funnel:

```text
ELIGIBLE
   │
   ▼
ASSIGNED
   │
   ▼
EXPOSED
   │
   ▼
MEASURED
```

At every step:

```text
Expected N
Actual N
Drop-off
Reason
```

If you cannot explain the population transitions, I would be uncomfortable interpreting the final treatment effect.

This is one reason mature experimentation systems invest heavily in data-quality checks rather than treating them as analyst cleanup.

---

# 04 — Assignment is not exposure

Another common mistake is assuming:

```sql
assigned_to = 'treatment'
```

means:

```text
the user saw the treatment
```

It does not.

Assignment tells us what the experiment intended to serve.

Exposure tells us what actually happened.

For a distributed product, there may be several additional failure points:

```text
ASSIGNMENT
    ↓
REQUEST
    ↓
SERVICE RESPONSE
    ↓
RENDER
    ↓
USER EXPOSURE
    ↓
BEHAVIOR
```

A feature flag can be assigned correctly while the downstream service fails.

A component can render incorrectly.

An event can fail to fire.

A user can be exposed but the analysis pipeline can miss the exposure event.

This is why I prefer explicit concepts for:

```text
ASSIGNMENT
EXPOSURE
OUTCOME
```

Then we can distinguish:

**Intent-to-treat**

> What happened to entities assigned to treatment?

**Exposure analysis**

> What happened among entities actually exposed?

**Implementation health**

> Did assignment reliably produce exposure?

These answer different questions.

The mistake is not choosing one.

The mistake is pretending they are interchangeable.

---

# 05 — A statistically significant result can still be the wrong result

Now suppose the experiment passes all the basic checks.

We have:

```text
Treatment effect = +2.8%
p-value           = 0.013
```

Should we ship?

Not yet.

The first question is:

**+2.8% of what?**

Then:

- Is the denominator stable?
- Is the metric actually tied to user value?
- Is the effect large enough to matter?
- Did quality deteriorate?
- Did the effect come from one unusual segment?
- Is the result robust over time?
- Is there an implementation explanation?
- Does the metric move because of the mechanism we expected?

Statistical significance answers a narrow question about evidence under a model.

It does not answer:

> **"Should the company ship this?"**

I think about the decision as three layers:

```text
STATISTICAL EVIDENCE
        ×
PRACTICAL MAGNITUDE
        ×
BUSINESS / PRODUCT VALUE
```

All three matter.

---

# 06 — The metric itself can be the failure

This is where experimentation connects directly to metric design.

Imagine a new feature increases:

```text
click-through rate +8%
```

That sounds great.

But suppose:

```text
successful outcomes  -1%
customer complaints   +4%
retention             -0.5%
```

The experiment did not necessarily fail.

The **metric hierarchy failed** if the team treated click-through as the complete definition of success.

A mature experiment should distinguish:

```text
                    EXPERIMENT
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
        GOAL        GUARDRAILS    DIAGNOSTICS
          │             │             │
      Did it work?   What must     Why did it
                     not worsen?    move?
```

DoorDash describes a similar framework for high-velocity experimentation: goal metrics represent what the team is trying to improve, guardrails protect important outcomes that should not deteriorate, and diagnostic metrics help explain behavioral changes. citeturn0search10

This is more than dashboard organization.

It is **decision architecture**.

---

# 07 — Real-world example: DoorDash and marketplace interference

The DoorDash switchback example is useful because it exposes a subtle assumption.

Suppose we want to test a dispatch algorithm.

A conventional A/B design might randomize individual deliveries:

```text
A → Treatment
B → Control
C → Treatment
D → Control
```

But dispatch decisions interact through shared Dasher supply.

Now imagine:

```text
Only 1 Dasher available

Treatment order
      ↓
gets the Dasher
      ↓
Control order
      ↓
waits longer
```

The treatment has affected the control outcome.

The control group is no longer a clean counterfactual.

DoorDash's solution is to randomize at the region/time level, then analyze the resulting nested structure appropriately. Their engineering work also highlights that switchbacks create fewer independent units and therefore require careful statistical treatment. citeturn0search1turn0search4

This is a perfect example of why:

> **The experiment design should follow the system's dependency structure.**

The "best" randomization unit is not necessarily the smallest one.

---

# 08 — Real-world example: when more sensitivity matters more than more traffic

There is another interesting DoorDash example in ranking experimentation.

Traditional A/B tests can be slow when the difference between ranking systems is small relative to the noise in user behavior.

DoorDash describes using **interleaving designs**, where multiple ranking conditions can be evaluated within the same user's experience. Because the same user provides a within-subject comparison, interleaving can substantially improve sensitivity for appropriate ranking problems. DoorDash reports sensitivity gains far beyond conventional A/B testing in some of these settings and discusses practical issues such as dilution and non-engaged users. citeturn0search0

The important lesson is not:

> "Interleaving is better than A/B testing."

It is:

> **The experiment design should match the signal you are trying to detect.**

Think about the progression:

```text
A/B TEST
   ↓
Signal is weak
   ↓
Need weeks of traffic
   ↓
Too much opportunity cost
   ↓
Change experimental design
   ↓
Higher sensitivity
   ↓
Faster learning
```

Experimentation is therefore an optimization problem of its own:

```text
VALIDITY
   ×
POWER
   ×
SPEED
   ×
BLAST RADIUS
```

Improving one dimension can hurt another.

---

# 09 — Sometimes the experimentation problem is actually a data-platform problem

One of my favorite lessons from DoorDash is that experimentation eventually becomes infrastructure.

DoorDash describes building a centralized **Metrics Layer** because ad-hoc metric definitions and computation made experiment analysis inconsistent and difficult to scale.

Their system standardized metric definitions, ownership, governance, computation, and reuse. They also integrated capabilities such as variance reduction and pre-experiment checks into the experimentation workflow. DoorDash reports a 10× improvement in average experiment-analysis time compared with the previous ad-hoc SQL approach. citeturn0search5

That leads to a useful architecture:

```text
                    EXPERIMENT PLATFORM
                           │
             ┌─────────────┴─────────────┐
             ↓                           ↓
        METRICS LAYER               STATS ENGINE
             │                           │
       What to measure              How to estimate
             │                           │
             └─────────────┬─────────────┘
                           ↓
                     DECISION SYSTEM
```

DoorDash's Dash-AB is another example of this pattern: a centralized statistics engine designed to standardize analysis methods across different experiment types, including A/B, switchback, CUPED, and other methods. The motivation included reducing inconsistent analysis and methodological errors while making expertise reusable across teams. citeturn0search3

This is an important shift in how I think about experimentation:

> **At scale, experimentation is a data product.**

The goal is not merely to help analysts run tests.

The goal is to make the *correct analysis path easier than the incorrect one*.

---

# 10 — A real-world example from marketplace governance

I have seen the same principle from a different angle in marketplace governance.

The problem was not a simple consumer-facing feature.

It involved interventions that could affect seller behavior, marketplace quality, operational outcomes, and downstream business impact.

The initial temptation was to evaluate an intervention with one top-line outcome.

That was too narrow.

The measurement architecture needed to separate:

```text
PRIMARY OUTCOME
       │
       ├───────────────┐
       ↓               ↓
BEHAVIORAL         BUSINESS
DRIVERS             IMPACT
       │
       └───────────────┐
                       ↓
                  GUARDRAILS
               QUALITY · RISK
```

### Step 1 — Define the causal question

Instead of:

> "Did the metric increase?"

the question became:

> **Did the intervention improve the target outcome without creating unacceptable downstream risk?**

That changed the experiment design.

### Step 2 — Reconcile the population

We explicitly cared about:

```text
ELIGIBLE SELLERS
      ↓
ASSIGNED SELLERS
      ↓
EXPOSED SELLERS
      ↓
MEASURED SELLERS
```

This made implementation quality part of the analysis rather than an afterthought.

### Step 3 — Separate treatment from behavior

The intervention could change seller behavior.

So we needed to distinguish:

```text
ASSIGNMENT
    ↓
EXPOSURE
    ↓
BEHAVIOR CHANGE
    ↓
MARKETPLACE OUTCOME
```

Each layer answers a different question.

### Step 4 — Diagnose the aggregate effect

If the top-line result moved, the next question was:

```text
Which segments moved?
Which drivers moved?
Which quality signals moved?
Which risks moved?
```

The point was not to produce hundreds of subgroup charts.

It was to build enough decomposition to explain **why the aggregate metric moved**.

### Step 5 — Turn one analysis into a reusable system

The most valuable output was not a single experiment readout.

It was a reusable measurement framework:

```text
EXPERIMENT DESIGN
       ↓
DATA QA
       ↓
STANDARDIZED METRICS
       ↓
TREATMENT EFFECT
       ↓
SEGMENT / DRIVER ANALYSIS
       ↓
GUARDRAILS
       ↓
BUSINESS DECISION
```

That is the difference between analyzing experiments and **building experimentation capability**.

---

# 11 — Peeking is not the only way to overfit an experiment

Repeatedly checking a p-value is an obvious problem.

But there are quieter forms of experimentation overfitting.

For example:

```text
100 metrics
×
20 segments
×
10 time windows
```

creates a huge search space.

Eventually, something will look interesting by chance.

This is why I care about a distinction between:

```text
PRIMARY METRIC
        ↓
PRE-SPECIFIED SECONDARY METRICS
        ↓
DIAGNOSTIC EXPLORATION
```

Exploration is valuable.

But exploratory findings should not automatically receive the same evidentiary status as a pre-specified primary hypothesis.

A useful experiment report should make that distinction visible.

---

# 12 — Guardrails should be designed before launch

Guardrails are sometimes treated as a final checklist:

```text
Primary metric: +3.2% ✓
Guardrails: no obvious issue ✓
Ship.
```

I prefer to define them as part of the hypothesis.

If the hypothesis is:

> This intervention improves successful outcomes.

The complete product hypothesis might be:

> This intervention improves successful outcomes **without materially degrading quality, trust, retention, or operational health.**

That changes the experiment design.

DoorDash has also described **metric-aware rollouts** that automatically monitor standardized app-health metrics and can pause a rollout when degradation is detected. citeturn0search7

This is an important evolution:

```text
EXPERIMENT
    ↓
MEASURE
    ↓
DETECT
    ↓
DECIDE
    ↓
AUTOMATE
```

At sufficient scale, good experimentation should not depend entirely on a human noticing a bad graph.

---

# 13 — What I would want to see before I trust an experiment

My pre-flight checklist is:

```text
DESIGN
□ Is the randomization unit causally appropriate?
□ Could treatment affect control?
□ Is the experiment structure A/B, switchback,
  interleaving, DiD, or something else?

POPULATION
□ Is eligibility deterministic?
□ Does assignment match eligibility?
□ Is there sample-ratio mismatch?
□ Is population drift understood?

EXPOSURE
□ Can assignment be distinguished from exposure?
□ Are exposure events complete?
□ Can treatment leak into control?

METRICS
□ Does the primary metric represent real value?
□ Is the denominator stable?
□ Is the metric definition standardized?
□ Who owns the metric definition?
□ Are guardrails defined?
□ Are diagnostic metrics available?

ANALYSIS
□ Is the estimator appropriate for the design?
□ Are clusters or repeated observations handled?
□ Was the analysis window defined in advance?
□ Are repeated looks handled correctly?
□ Are important segments hypothesis-driven?

DECISION
□ Is the effect practically meaningful?
□ Are tradeoffs acceptable?
□ Can we explain why the metric moved?
□ Is the result robust?
□ What would make us reverse the decision?
```

The final question is the one I care about most:

> **What evidence would change our mind?**

If there is no answer, the experiment may be serving the decision rather than informing it.

---

# 14 — The experimentation stack I actually want

For a mature product organization, I would think about the system as five layers:

```text
┌──────────────────────────────────────┐
│            DECISION LAYER            │
│  Ship · Iterate · Roll back · Learn  │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│          DIAGNOSTIC LAYER            │
│ Segments · Drivers · Tradeoffs · QA  │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│          STATISTICAL LAYER           │
│ A/B · Switchback · DiD · CUPED · ... │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│            METRIC LAYER              │
│ Goals · Guardrails · Diagnostics     │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│         DATA / EXPOSURE LAYER        │
│ Assignment · Exposure · Events · QA  │
└──────────────────────────────────────┘
```

This is what makes experimentation scalable.

Not more dashboards.

Not more p-values.

Not more analysts manually rewriting SQL.

**Infrastructure that encodes good experimental judgment.**

---

# Final takeaway

A/B tests do not usually lie because the math is wrong.

They lie because we ask a mathematically precise question about the wrong system.

A test can be:

```text
randomized
balanced
statistically significant
```

and still fail because:

```text
the wrong unit was randomized
        ↓
treatment contaminated control
        ↓
exposure was measured incorrectly
        ↓
the metric captured activity instead of value
        ↓
the estimator ignored the experimental structure
        ↓
the average hid an important segment
        ↓
the result was statistically significant
but strategically irrelevant
```

The best experimentation organizations recognize this.

DoorDash's work is a useful example: switchbacks for network effects, interleaving for weak ranking signals, centralized metrics for measurement consistency, statistical infrastructure for methodological rigor, and metric-aware rollouts for operational safety. citeturn0search1turn0search0turn0search5turn0search3turn0search7

The common thread is not a particular statistical method.

It is **engineering the conditions under which an experiment can be trusted**.

That is the part of experimentation I find most interesting.

The goal is not to prove that a number moved.

It is to build a system where you can confidently explain:

```text
WHAT changed?
    ↓
WHY did it change?
    ↓
WHO experienced the change?
    ↓
WHAT did it cost?
    ↓
CAN WE TRUST the estimate?
    ↓
WHAT should we do next?
```

**A good experiment does not just produce an effect size. It produces a decision you can defend.**
