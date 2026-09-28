---
layout: default
title: Status
description: What I am working on at the moment.
---
# Status

A short summary of what I am working on and listening to. I update it from time to time.

<table class="status">
{% for s in site.status %}<tr><th scope="row">{{ s[0] | replace: "_", " " | capitalize }}</th><td>{{ s[1] }}</td></tr>
{% endfor %}</table>

## Site updates

<ul class="log">
{% for u in site.data.updates %}<li><time datetime="{{ u.date | date: '%Y-%m-%d' }}">{{ u.date | date: "%-d %B %Y" }}</time> {{ u.text }}</li>
{% endfor %}</ul>
