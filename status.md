---
layout: default
title: Status
description: What Vivien is up to right now.
---
# Status

What I'm up to at the moment. Updated whenever I remember to.

<table class="status">
{% for s in site.status %}<tr><th scope="row">{{ s[0] | replace: "_", " " | capitalize }}</th><td>{{ s[1] }}</td></tr>
{% endfor %}</table>

## Site updates

<ul class="log">
{% for u in site.data.updates %}<li><time datetime="{{ u.date | date: '%Y-%m-%d' }}">{{ u.date | date: "%Y-%m-%d" }}</time> {{ u.text }}</li>
{% endfor %}</ul>
