var ptor = protractor.getInstance();
ptor.elem = ptor.findElement;
ptor.elems = ptor.findElements;
global.by = protractor.By;
global.ptor = ptor;
