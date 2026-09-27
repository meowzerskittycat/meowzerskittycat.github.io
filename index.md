---
layout: default
sections: [About, Status, News]
---
# {{ site.title }}

## About

First-year engineering student. I make music in my spare time, mostly for myself.
This site has some notes on uni, what I'm working on, and things I like.

## Status

<table class="status">
{% for s in site.status %}<tr><th scope="row">{{ s[0] | replace: "_", " " | capitalize }}</th><td>{{ s[1] }}</td></tr>
{% endfor %}</table>

## News

{% for u in site.data.updates limit: 5 %}
<h3>{{ u.date | date: "%Y-%m-%d" }}</h3>
<p>{{ u.text }}</p>
{% endfor %}
