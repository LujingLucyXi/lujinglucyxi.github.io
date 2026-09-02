---
layout: default
title: Writing
---
<div class="page-intro"><div class="eyebrow"><span class="pulse"></span> FIELD NOTES</div><h1>Writing on data, product & AI.</h1><p>Practical frameworks, technical deep dives, and lessons from building measurement systems and products.</p></div>
<div class="writing-list">
{% for post in site.posts %}
<a class="writing-row" href="{{ post.url }}"><div class="writing-index">{{ forloop.index | prepend: '0' }}</div><div><div class="meta">{{ post.category | upcase }} · {{ post.read_time }} MIN READ</div><h2>{{ post.title }}</h2><p>{{ post.description }}</p></div><span>↗</span></a>
{% endfor %}
</div>
