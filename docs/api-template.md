##[{{name}}]({{sourceLink}})

{{desc}}

{% if example %}
###Example
```javascript
{{ example }}
```
{% endif %}

{% if params %}
###Params


Param | Type | Description
--- | --- | ---
{% for param in params %}{{param.name}} | {{param.type.description}} | {{param.description}}
{% endfor %}
{% endif %}

{% if returns %}
###Returns


Type | Description
--- | ---
{{returns.type.description}} | {{returns.description}}
{% endif %}
