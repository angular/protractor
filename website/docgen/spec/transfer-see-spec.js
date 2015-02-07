var seeProcessorFn = require('../processors/transfer-see');


describe('transfer-see', function() {
  var seeProcessor;

  beforeEach(function() {
    seeProcessor = seeProcessorFn();
  });

  var transferSee = function(docs) {
    seeProcessor.$process(docs);
  };

  it('should put @see info in the description', function() {
    var doc = {
      description: '',
      see: ['greetings.HelloWorld']
    };
    transferSee([doc]);
    expect(doc.description).toBe('See {@link greetings.HelloWorld}');
  });

  it('should append @see info to the description', function() {
    var doc = {
      description: 'Hello, World',
      see: ['greetings.HelloWorld']
    };
    transferSee([doc]);
    expect(doc.description).toBe('Hello, World<br />See {@link greetings.HelloWorld}');
  });

  it('should handle multiple @see tags', function() {
    var doc = {
      description: '',
      see: ['greetings.HelloWorld', 'greetings.HolaMundo']
    };
    transferSee([doc]);
    expect(doc.description).toBe('See {@link greetings.HelloWorld}<br />' +
        'See {@link greetings.HolaMundo}');
  });

  it('should handle information after @see tag', function() {
    var doc = {
      description: '',
      see: ['greetings.HelloWorld\n\nHello, World']
    };
    transferSee([doc]);
    expect(doc.description).toBe('See {@link greetings.HelloWorld}<br />Hello, World');
  });
});
