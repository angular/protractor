##[{$ doc.name $}]({$ doc.sourceLink $})
{%if doc.alias %}####{$ doc.alias $}{%endif%}
{$ doc.description $}

{% if doc.example %}
###Example
{% if doc.view %}
```html
{$ doc.view $}
```
{% endif %}
```javascript
{$ doc.example $}
```
{% endif %}

{% if doc.params %}
###Params

Param | Type | Description
--- | --- | ---
{% for param in doc.params %}{$ param.name $} | {$ param.type.description | replace("\|", "&#124;") $} | {$ param.description $}
{% endfor %}
{% endif %}

{% if doc.returns %}
###Returns

Type | Description
--- | ---
{$ doc.returns.type.description $} | {$ doc.returns.description $}
{% endif %}
