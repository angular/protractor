#Index

{% for line in toc %}
{% if line.isHeader %}##{{line.name}}{% else %}* [{{line.name}}](#{{line.link}}){% endif %}{% endfor %}
