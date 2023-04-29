---
layout: base
title: Eleventy Plugin Post Stats
---

Bacon ipsum dolor amet venison ribeye drumstick prosciutto, swine alcatra leberkas salami t-bone tri-tip biltong. Picanha tenderloin flank boudin, biltong drumstick strip steak shoulder. Sirloin ham pork chop t-bone, boudin sausage bacon pork loin short loin frankfurter. Tenderloin chislic pork loin, sirloin meatloaf pork chop venison. Prosciutto jerky porchetta capicola shoulder, andouille ground round chislic pig doner.

<!-- * Post count: {{ collections.postStats.postCount }}
* First Post: {{ collections.postStats.firstPostDate }}
* Last Post: {{ collections.postStats.lastPostDate  }}  -->

<ul>
{% for entry in collections.postStats %}
  <li>{{ entry.key }}: {{ entry.value}}</li>
{% endfor %}
</ul>