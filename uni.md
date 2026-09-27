---
layout: default
title: Uni
description: Vivien's first year of engineering.
---
{% assign uni = site.data.uni %}
# Uni

{{ uni.year }}, {{ uni.degree | downcase }}.
{{ uni.semester.name }}: {{ uni.semester.start | date: "%Y-%m-%d" }} to {{ uni.semester.end | date: "%Y-%m-%d" }}.

## Classes

<dl>
{% for c in uni.classes %}<dt>{{ c.name }}</dt>
<dd>{{ c.note }}</dd>
{% endfor %}</dl>

## To-do

<ul class="todo">
{% for t in uni.todo %}<li><code>[{% if t.done %}x{% else %}&nbsp;{% endif %}]</code> {% if t.done %}<del>{{ t.text }}</del>{% else %}{{ t.text }}{% endif %}</li>
{% endfor %}</ul>

## Things that help

<ol>
{% for tip in uni.study_tips %}<li>{{ tip }}</li>
{% endfor %}</ol>
