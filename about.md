---
layout: default
title: about me
description: a bit about me
---
<section class="window" markdown="1">
<div class="window-bar"><span>♡ about me</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
<div class="window-body" markdown="1">

## hi

i'm **{{ site.author }}**. i'm a first-year engineering student, and in my spare time i make music.
i like pink, cute things and figuring out how stuff works.

i made this site as a small place online that's mine. i'll add to it when i have time.

*(this page is written in markdown. edit `about.md` to change it.)*

</div>
</section>

<section class="window">
  <div class="window-bar"><span>✧ profile</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
  <div class="window-body">
    <table class="profile">
      <tr><th>name</th><td>{{ site.author }}</td></tr>
      <tr><th>pronouns</th><td>he/him</td></tr>
      <tr><th>studying</th><td>{{ site.data.uni.degree }} ({{ site.data.uni.year }})</td></tr>
      <tr><th>hobbies</th><td>making music</td></tr>
      <tr><th>fave color</th><td><span class="swatch" aria-hidden="true"></span> pink</td></tr>
    </table>
  </div>
</section>

<section class="window">
  <div class="window-bar"><span>♡ favorite things</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
  <div class="window-body">
    <div class="favorites">
      {% for f in site.data.favorites %}
        <div class="fav">
          <h3>{{ f.category }}</h3>
          <ul>{% for i in f.items %}<li>{{ i }}</li>{% endfor %}</ul>
        </div>
      {% endfor %}
    </div>
  </div>
</section>
