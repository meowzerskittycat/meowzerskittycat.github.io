---
layout: default
title: about
description: a bit about me
---
<section class="card" markdown="1">
<h1 class="label">about</h1>

i'm **{{ site.author }}**. i'm a first-year engineering student, and in my spare time i make music.
i like pink, cute things and figuring out how stuff works.

i made this site as a small place online that's mine. i'll add to it when i have time.

</section>

<section class="card">
  <h2 class="label">profile</h2>
  <dl class="spec spec-grid">
    <dt>name</dt><dd>{{ site.author }}</dd>
    <dt>pronouns</dt><dd>he/him</dd>
    <dt>studying</dt><dd>{{ site.data.uni.degree }}, {{ site.data.uni.year }}</dd>
    <dt>hobbies</dt><dd>making music</dd>
    <dt>fave color</dt><dd><span class="swatch" aria-hidden="true"></span>pink</dd>
  </dl>
</section>

<section class="card">
  <h2 class="label">favorite things</h2>
  <div class="favorites">
    {% for f in site.data.favorites %}
      <div class="fav">
        <h3>{{ f.category }}</h3>
        <ul>{% for i in f.items %}<li>{{ i }}</li>{% endfor %}</ul>
      </div>
    {% endfor %}
  </div>
</section>
