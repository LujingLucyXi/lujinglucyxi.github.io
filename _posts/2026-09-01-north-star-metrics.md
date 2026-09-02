---
layout: post
title: "Designing Better North-Star Metrics"
category: Product Analytics
read_time: 10
description: "A practical framework for designing measurement systems that connect user value, behavior, business outcomes, and the decisions teams actually make."
---

## The metric is not the strategy

Most teams don't actually have a North-Star Metric problem.

They have a **measurement architecture problem**.

The conversation usually starts with a familiar question:

> Should our North Star be revenue, active users, transactions, retention, or engagement?

That sounds like a metric-selection exercise. It isn't.

The harder questions are:

- What user behavior actually creates value?
- Which parts of that behavior can the product influence?
- Which signals are leading indicators versus lagging outcomes?
- What happens when teams start optimizing the metric?
- What important product qualities disappear when everything gets compressed into one number?

A useful North-Star Metric therefore isn't simply a KPI.

**It's the top layer of a measurement system.**

```text
                         BUSINESS OUTCOME
                                ↑
                         NORTH-STAR METRIC
                                ↑
                    USER VALUE / CORE BEHAVIOR
                           ↙           ↘
                  PRODUCT DRIVERS   GUARDRAILS
                       ↙     ↘       ↙   ↘
                    INPUT  BEHAVIOR QUALITY  RISK
                         ↓        ↓        ↓
                         OPERATIONAL SIGNALS
```

The goal isn't to reduce a complex product to one number.

The goal is to create a hierarchy that lets different teams answer the same question at different levels of resolution.

---

## 01 / Start with the decision, not the metric

A common mistake is to begin with the data that already exists.

A team opens its warehouse, looks at the most available measures, and asks which one correlates most strongly with revenue or retention.

That is backwards.

Start with the decision.

Ask:

> **What decision should this measurement system help us make?**

Suppose a product team wants to improve the quality of a customer experience. The useful measurement system might need to answer several different questions:

- Is the overall experience improving?
- Which part of the experience is responsible for the change?
- Is the improvement broad or concentrated in one segment?
- Did the change improve one dimension while damaging another?
- Which product or operational lever should we change next?

One number cannot answer all of these questions.

That is why I think about metrics as a **hierarchy rather than a list**.

```text
Decision
   ↓
Outcome
   ↓
North-Star Metric
   ↓
Driver Metrics
   ↓
Operational Signals
```

The North Star provides orientation. The lower levels provide diagnosis.

Without the lower levels, a North Star becomes a dashboard ornament: everyone watches it, but nobody knows what to do when it moves.

---

## 02 / Find the actual value exchange

The strongest North-Star candidates usually sit close to the product's fundamental value exchange.

That requires separating **activity from value**.

```text
Activity ≠ Value
Engagement ≠ Always Value
Revenue ≠ Always User Value
```

A user opening an app is activity.

A user successfully completing the thing they came to the app to do is closer to value.

For example:

| Product signal | What it tells you | What it may miss |
|---|---|---|
| Sessions | Frequency of usage | Whether sessions are useful |
| Clicks | Intent / interaction | Whether the outcome was successful |
| Messages | Communication activity | Whether users actually accomplished something |
| Transactions | Economic activity | Quality or long-term satisfaction |
| Revenue | Business outcome | Whether growth is healthy or sustainable |

None of these metrics is inherently wrong.

The question is whether the metric represents the **mechanism through which the product creates value**.

A useful candidate should ideally have three properties:

1. **It represents meaningful user value.**
2. **It moves with healthy product growth.**
3. **Teams can influence its drivers.**

The third point is particularly important.

A metric can be an excellent description of business performance while being a poor operating metric.

For example, revenue may be the ultimate business outcome, but a product team usually needs a more proximal measurement system to understand *why* revenue changed and what it can do about it.

---

## 03 / Build the metric tree

Once the core value exchange is clear, build downward.

Imagine a product where the core outcome is a successful customer transaction.

A useful measurement tree might look like this:

```text
                       SUCCESSFUL TRANSACTIONS
                                │
                ┌───────────────┼───────────────┐
                ↓               ↓               ↓
             Demand          Supply          Quality
                │               │               │
          Discovery rate   Availability    Completion rate
                │               │               │
           Conversion      Match rate      Failure rate
```

This structure creates a useful property: **the top-line metric can be decomposed.**

If successful transactions decline, we can ask whether the problem came from demand, supply, matching, or quality.

This is much more useful than simply knowing that the North Star went down 6%.

A good metric tree should therefore support three types of analysis:

### Direction

Is the product getting better or worse?

### Diagnosis

Which driver explains the movement?

### Action

Which lever can the team actually change?

If a metric cannot support the third question, it may be a useful reporting metric but a weak operating metric.

---

## 04 / The denominator problem

One of the easiest ways to misread product performance is to focus on the numerator.

Imagine:

```text
Transactions: +20%
```

That sounds excellent.

But what if:

```text
Users:       +50%
Transactions:+20%
```

Now the story is very different.

Or suppose a product expands into a new market and doubles its user base. Aggregate conversion falls from 12% to 9%, but every existing market actually improves.

The aggregate number is technically correct. The interpretation is wrong.

This is why metric design needs explicit attention to **denominators, cohorts, and composition effects**.

A simple rate such as:

```text
Conversion Rate = Successful Outcomes / Eligible Users
```

already contains several modeling decisions:

- Who counts as an eligible user?
- What time window defines eligibility?
- When does the denominator become fixed?
- Can the same user appear multiple times?
- Does the population change between periods?

These details are not implementation trivia.

They determine what the metric means.

For important metrics, I want the definition to be precise enough that two analysts could implement it independently and still produce the same result.

---

## 05 / A North Star needs a decomposition, not just a definition

A metric definition tells you **what** the number is.

A decomposition tells you **why it moved**.

Suppose:

```text
North Star = Active Users × Successful Outcomes per Active User
```

A 10% increase can now be decomposed into two fundamentally different stories:

```text
Story A
More users × same behavior

Story B
Same users × more value per user
```

Those imply very different product decisions.

The same principle applies to marketplace, engagement, revenue, and operational metrics.

Whenever possible, I want to know whether movement came from:

- **Volume** — more users, sellers, transactions, or sessions
- **Rate** — higher conversion or completion
- **Mix** — a different composition of users or products
- **Quality** — better outcomes per interaction
- **Frequency** — users performing the behavior more often

This is where a measurement system becomes analytical rather than descriptive.

---

## 06 / Metrics create incentives

The moment a metric becomes a target, it stops being purely descriptive.

Teams optimize toward it.

That creates a fundamental risk:

> **The metric can improve while the underlying product gets worse.**

Suppose a team is measured on engagement.

They discover that notifications increase daily sessions.

Great.

But if the additional sessions come from users repeatedly checking something because the product created uncertainty or friction, the metric may improve while user value declines.

This is a version of the broader principle behind Goodhart's Law:

> When a measure becomes a target, it can stop being a good measure.

That means metric design is also **incentive design**.

Before making a metric a target, ask:

- Can the metric be gamed?
- Can one team improve it while hurting another outcome?
- Does optimizing the metric create undesirable user behavior?
- Can short-term gains damage long-term value?
- What behavior does the organization implicitly reward?

The best metric systems anticipate these failure modes rather than discovering them after the metric has already become an organizational target.

---

## 07 / Use guardrails to preserve what the North Star hides

A single metric necessarily compresses information.

That compression is useful for alignment, but dangerous if nobody tracks what gets lost.

This is why North-Star Metrics should usually be paired with **guardrails**.

```text
                         NORTH STAR
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
           Growth           Value           Scale
              │
              └───────────────┬───────────────┘
                              ↓
                         GUARDRAILS
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
                  Quality    Trust    Retention
```

The right guardrails depend on the product, but common categories include:

- Quality
- Retention
- Reliability
- Trust and safety
- Customer complaints
- Latency
- Unit economics
- Cancellation / failure rates

The purpose isn't to create another giant dashboard.

It's to prevent the organization from optimizing one dimension of the product while silently degrading another.

A useful principle is:

**North Star = what we want to increase.**

**Guardrails = what we refuse to sacrifice.**

---

## 08 / Segment before you celebrate

Aggregate metrics can hide extremely different user experiences.

If the North Star increases 8%, I immediately want to know:

```text
Who improved?
Who did not?
Where did the change happen?
When did it happen?
What changed in the population?
```

Useful cuts might include:

- New vs. returning users
- Geography
- Product surface
- Customer segment
- Seller / creator / consumer cohort
- Acquisition channel
- Tenure
- Product category

Segmentation isn't just a reporting exercise.

It can reveal that the apparent overall improvement is actually a composition effect, or that a small segment is driving most of the movement.

For product decisions, **distribution often matters as much as the average**.

---

## 09 / The experiment is where the metric gets tested

A North-Star Metric becomes especially useful when it can serve as an outcome in experimentation.

But this introduces another question:

> Is the metric sensitive enough to detect meaningful product changes?

A metric can be conceptually perfect and still be operationally weak if it is:

- Too sparse
- Too noisy
- Too delayed
- Too sensitive to unrelated external factors
- Difficult to attribute to the treatment

That is why I don't evaluate a metric only on whether it sounds strategically correct.

I also ask whether it behaves well statistically.

For an experiment, I care about things such as:

```text
Sensitivity
Variance
Sample size requirements
Time to observation
Treatment responsiveness
Segment stability
Guardrail behavior
```

A metric that takes six months to move may be strategically meaningful but useless as the primary metric for a two-week experiment.

In practice, a mature measurement system often needs both:

**Lagging outcome metrics** — did we ultimately create value?

**Leading product metrics** — did the mechanism we expected to change actually move?

The two should tell a coherent story.

---

## 10 / Case study: turning fragmented seller signals into one operating metric

Here's a real example from my work on a large global commerce platform. I've anonymized the company and some implementation details, but the measurement problem and outcome are real.

The business had a familiar problem: seller performance was being measured through several disconnected signals. Fulfillment, product quality, and customer service were each visible in different systems, but there was no single measurement layer that helped product and operations teams answer a simple question:

> **Is the seller experience getting better, and what is driving the change?**

### The original system

The existing metrics were individually useful, but difficult to operate as a system:

```text
Fulfillment ─────┐
                 │
Product Quality ─┼──→ Many dashboards ──→ Hard to diagnose
                 │
Customer Service ┘
```

A seller could perform well on one dimension and poorly on another, while aggregate business reporting made it difficult to see the tradeoff. Teams also had different definitions, thresholds, and reporting cadences.

The solution was not to throw away the underlying metrics and replace them with a single score. It was to create a **measurement hierarchy**.

### The redesigned system

I designed a composite **Shop Performance Score** that consolidated three core pillars—product quality, fulfillment reliability, and customer service—while preserving the underlying components for diagnosis.

```text
                         SHOP PERFORMANCE SCORE
                                  │
              ┌──────────────────┼──────────────────┐
              ↓                  ↓                  ↓
        PRODUCT QUALITY     FULFILLMENT       CUSTOMER SERVICE
              │                  │                  │
        defects / issues    reliability       service outcomes
              └──────────────────┼──────────────────┘
                                 ↓
                         SELLER-LEVEL VIEW
                                 ↓
                     SEGMENT / COHORT ANALYSIS
                                 ↓
                         ACTION + EXPERIMENT
```

This distinction mattered. The composite score created alignment; the component metrics preserved the ability to explain *why* a seller's score moved.

### What made it a North Star rather than a dashboard KPI

I pressure-tested the metric against the framework above:

| Question | Design choice |
|---|---|
| Does it represent user value? | It reflects dimensions of seller performance that directly shape the customer experience. |
| Can teams influence it? | Each pillar maps to concrete operational and product levers. |
| Can we diagnose movement? | The score decomposes into its three underlying pillars. |
| Can it create bad incentives? | Component metrics and guardrails remain visible instead of optimizing only the aggregate. |
| Can we segment it? | Seller cohorts, categories, and performance tiers can be compared separately. |
| Can we connect it to outcomes? | Changes can be evaluated alongside customer and marketplace outcomes. |

The architecture became:

```text
                         DECISION
                            ↓
                  SHOP PERFORMANCE SCORE
                            ↓
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
          QUALITY       FULFILLMENT      SERVICE
             ↓              ↓              ↓
       OPERATIONAL     OPERATIONAL    OPERATIONAL
         SIGNALS         SIGNALS        SIGNALS
                            ↓
                    SELLER ACTIONS
                            ↓
                 CUSTOMER EXPERIENCE
```

### The outcome

The score became a common operating layer across a seller population of **300,000+ active sellers**. More importantly, it changed the workflow from *reporting performance* to *diagnosing performance and deciding what to do next*.

Following adoption of the measurement system and associated interventions, the share of sellers reaching the top **Star Shop** tier increased by **8%**.

That result is important, but the more durable lesson is about measurement design: the score did not create value because it was a clever formula. It created value because it connected a top-line outcome to interpretable drivers and actions.

### What I would do differently now

If I were building the system again from scratch, I would make the causal structure even more explicit from day one:

1. **Define the customer outcome first.**
2. **Separate the score from the diagnostic tree.**
3. **Document denominator and eligibility rules as part of the metric contract.**
4. **Instrument every component so movement can be traced to a mechanism.**
5. **Predefine guardrails before making the score a target.**
6. **Validate the score in experiments, not only through historical correlation.**

That last point is the one I would emphasize most. A composite score can be highly predictive and still be a poor product metric. The real test is whether it helps teams detect meaningful changes, explain them, and make better decisions.

## 11 / A practical metric review

Before adopting a North-Star Metric, I like to pressure-test it with a simple checklist.

```text
METRIC REVIEW

□ Does it represent real user value?
□ Is the causal mechanism reasonably clear?
□ Can teams influence its drivers?
□ Is the denominator stable and well defined?
□ Can the metric be decomposed?
□ Can it be gamed?
□ What important behavior does it hide?
□ What guardrails are required?
□ Can we segment it meaningfully?
□ Can it detect meaningful product changes?
□ Can we explain why it moved?
□ What decision changes when it moves?
```

The last question is the most important.

> **What decision changes when this metric moves?**

If the answer is simply *“we'll put it on the dashboard,”* you probably have a reporting metric—not a decision metric.

---

## Final takeaway

The best North-Star Metric is rarely a magical KPI.

It is the top layer of a coherent measurement system connecting:

```text
USER VALUE
    ↓
BEHAVIOR
    ↓
PRODUCT DRIVERS
    ↓
OPERATIONAL SIGNALS
    ↓
NORTH-STAR OUTCOME
    ↓
BUSINESS RESULT
```

The real achievement isn't finding the perfect number.

**It's building a system where a change in the number can be traced back to behavior, product mechanisms, operational constraints, and ultimately user value.**

A good North-Star Metric doesn't make a product simpler.

**It makes the complexity legible.**

And that's when a metric stops being something that appears on an executive dashboard and becomes something a product organization can actually operate.
