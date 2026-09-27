---
layout: default
title: about me
description: a little bit about me
---
<section class="window" markdown="1">
<div class="window-bar"><span>♡ about me</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
<div class="window-body" markdown="1">

## hi again ♡

i'm **{{ site.author }}**, a music maker and university student who loves all things soft,
pink and sparkly. i believe boys can wear bows, paint their nails and cry at sad songs
(and should!).

i started making music because i wanted to make the sounds i hear in my head when i'm
daydreaming. now i make songs between lectures, on the bus and very late at night.

this page is written in **markdown**, so it's super easy to edit: just change the text in
`about.md` ✎

</div>
</section>

<section class="window">
  <div class="window-bar"><span>✧ profile card</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
  <div class="window-body">
    <table class="profile">
      <tr><th>name</th><td>{{ site.author }}</td></tr>
      <tr><th>pronouns</th><td>he/him</td></tr>
      <tr><th>i am a</th><td>music maker &amp; uni student</td></tr>
      <tr><th>studying</th><td>{{ site.data.uni.degree }}</td></tr>
      <tr><th>fave color</th><td><span class="swatch" aria-hidden="true"></span> pastel pink (obviously)</td></tr>
      <tr><th>star sign</th><td>✧ (yours here)</td></tr>
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
