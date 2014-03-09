##[{{ doc.name }}]({{ doc.sourceLink }})
{%if doc.alias %}#### Use as: {{ doc.alias }}{%endif%}
{{ doc.description }}{% if doc.deprecated %}**DEPRECATED** {{doc.deprecated}}{% endif %}

{% if doc.example %}
###Example
{% if doc.view %}
```html
{{ doc.view }}
```
{% endif %}
```javascript
{{ doc.example }}
```
{% endif %}

{% if doc.params %}
###Params

Param | Type | Description
--- | --- | ---
{% for param in doc.params %}{{ param.name }} | {{ param.paramString }} | {{ param.description }}
{% endfor %}
{% endif %}

{% if doc.returns %}
###Returns

Type | Description
--- | ---
{{ doc.returnString }} | {{ doc.returns.description }}
{% endif %}
