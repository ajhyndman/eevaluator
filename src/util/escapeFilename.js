/**
 * @module
 * This file is written in.js so it can easily be shared between src/ and
 * scripts/ code.
 */

/**
 * Escape filenames for multiplatform use. We're more aggressive than we need
 * to be, in the interest of keeping filenames human-friendly.
 */
function escapeFilename(name) {
  return name.replace(/[^a-z0-9-]+/gi, '-');
}

exports.escapeFilename = escapeFilename;
