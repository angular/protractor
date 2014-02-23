Protractor API
==============

Note: in this documentation, `protractor` and `webdriver` refer to namespaces,
and `ptor` and `driver` refer to instances of the Protractor and Webdriver
classes.

Protractor is a wrapper around WebDriver, so anything available on WebDriver
is available on Protractor. The best documentation for both is the code itself.
This file provides an overview and links on where to get more information.

{% for line in toc %}
{% if line.isHeader %}
##{{line.name}}
{% else %}* [{{line.name}}](#{{line.link}}){% endif %}{% endfor %}
