##[{{name}}]({{sourceLink}})
{{description}}

{% if example %}
###Example
{% if view %}
```html
{{ view }}
```
{% endif %}
```javascript
{{ example }}
```
{% endif %}

{% if params %}
###Params

Param | Type | Description
--- | --- | ---
{% for param in params %}{{param.name}} | {{param.type.description | replace("\|", "&#124;")}} | {{param.description}}
{% endfor %}
{% endif %}

{% if returns %}
###Returns

Type | Description
--- | ---
{{returns.type.description}} | {{returns.description}}
{% endif %}
