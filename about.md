---
layout: default
title: About
description: A short introduction.
---
# About

I am a first-year software engineering student. I am interested in how software and systems work, and most of my time goes into writing code. Outside of my studies I make music.

I set up this site to have one place for my writing, and to document what I work on instead of leaving notes spread across folders.

## Profile

<table class="status">
<tbody>
<tr><th scope="row">Pronouns</th><td>He/they</td></tr>
<tr><th scope="row">Studying</th><td>Software engineering, first year</td></tr>
</tbody>
</table>

## Interests

<table class="status">
<tbody>
{% for f in site.data.favorites %}<tr><th scope="row">{{ f.category }}</th><td>{{ f.items | join: ", " }}</td></tr>
{% endfor %}</tbody>
</table>
