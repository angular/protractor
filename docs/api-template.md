##{{name}}

[code](https://www.google.com/{{startingLine}})

{{desc}}

{% if tags.tags %}
###Params


Param | Type | Description
--- | --- | ---
{% for tag in tags.tags %}{{tag.title}} | {{tag.type.name}} | {{tag.description|replace("\n", "")}}
{% endfor %}
{% endif %}

{% if returns %}
###Returns


Type | DescriptionGG
--- | ---
{{returns.type.description}} | {{returns.description}}
{% endif %}
