const escapeWhitespaces = path => path.replace(/(\s+)/g, "\\$1");

module.exports = escapeWhitespaces;
