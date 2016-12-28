module.exports = function() {
  return true;
};

/**
 * The reason this file exists is so that we can set a breakpoint via
 * script name, and then control when that breakpoint is set in
 * our library code by importing and calling this function. The
 * breakpoint will always be on line 2.
 */