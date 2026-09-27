---
layout: default
title: Music
description: The music I make for myself.
sections: [Working on, On repeat, Setup]
---
{% assign music = site.data.music %}
# Music

I make music in my free time. I don't really post it; it's a way to unwind after classes.

## Working on

<ul>
{% for m in music.making %}<li>{{ m }}</li>
{% endfor %}</ul>

## On repeat

<ul>
{% for l in music.listening %}<li>{{ l }}</li>
{% endfor %}</ul>

## Setup

<table class="status">
{% for s in music.setup %}<tr><th scope="row">{{ s.what }}</th><td>{{ s.note }}</td></tr>
{% endfor %}</table>

{% if music.links and music.links.size > 0 %}
## Listen

<ul>
{% for l in music.links %}<li><a href="{{ l.url }}">{{ l.name }}</a></li>
{% endfor %}</ul>
{% endif %}
