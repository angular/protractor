Protractor API
==============

{% for line in doc.toc %}
{% if line.isHeader %}
##{$ line.name $}
{% else %}* [{$ line.name $}](#{$ line.link $}){% endif %}{% endfor %}
