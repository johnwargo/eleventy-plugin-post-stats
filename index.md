---
layout: base
title: Eleventy Plugin Post Stats
---

Bacon ipsum dolor amet venison ribeye drumstick prosciutto, swine alcatra leberkas salami t-bone tri-tip biltong. Picanha tenderloin flank boudin, biltong drumstick strip steak shoulder. Sirloin ham pork chop t-bone, boudin sausage bacon pork loin short loin frankfurter. Tenderloin chislic pork loin, sirloin meatloaf pork chop venison. Prosciutto jerky porchetta capicola shoulder, andouille ground round chislic pig doner.

* **Post count:** {{ collections.postStats.postCount }}
* **Average days between posts:** {{ collections.postStats.avgDays }}
* **First Post:** {{ collections.postStats.firstPostDate }}
* **Last Post:** {{ collections.postStats.lastPostDate }}

<style>
  table, th, td {
  border: 1px solid;
}
</style>

<table>
  <thead>
    <tr>
      <th>Year</th>
      <th>Count</th>
      <th>Avg. Days Between Posts&nbsp;</th>
    </tr>
  </thead>
  <tbody>
    {% for year in collections.postStats.years %}
      <tr>
        <td>{{ year.year }}</td>
        <td>{{ year.count }}</td>
        <td>{{ year.avgDays }}</td>
      </tr>    
    {% endfor %}
  </tbody>
</table>
