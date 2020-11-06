'use strict';

const readline = require('readline');

// I think this is actually called a "document separator" in YAML?
// https://yaml.org/spec/1.2/spec.html
const FM_SEPARATOR = '---';

// returns a Promise that resolves to the YAML front matter and other contents
function yamlAndContentsFromStream(readStream) {

  let foundInitialDashes = false;
  let foundClosingDashes = false;

  // lines in the front matter
  let yamlFMContents = [];
  // lines in the rest of the string
  let otherContents = [];

  const rl = readline.createInterface({
    input: readStream,
    // always treat CR LF ('\r\n') as a single line break
    crlfDelay: Infinity,
  });

  return new Promise((resolve, reject) => {

    // because these errors are not forwarded
    readStream.on('error', (err) => {
      reject(new Error(`Error reading input stream\n\n${err.message}`));
    });

    rl.on('line', (input) => {
      // console.log(`line: ${input}`);

      // the main logic for finding the yaml front matter section
      if (!foundInitialDashes) {
        if (input.trim() !== FM_SEPARATOR) {
          // if the first line is not '---', assume there is no front matter
          // https://jekyllrb.com/docs/front-matter/
          // console.log('(no front matter)');
          foundClosingDashes = true;
          otherContents.push(input);
        }
        // either way, don't check this again (only for the first line)
        foundInitialDashes = true;
      } else {
        // already found the initial dashes,
        // so combine things together until we find the closing dashes
        if (!foundClosingDashes) {
          if (input.trim() === FM_SEPARATOR) {
            foundClosingDashes = true;
            // console.log('(end of front matter)');
            // show the FM contents
            // console.log('front matter contents');
            // console.log(yamlFMContents);

            // then pause the stream, to resume after modifying the YAML?
            // this doesn't work:
            // rl.pause();
            // does this? no
            // rl.close();
            // for both of those, I still get 'line' events
            // does this work? yes, so use this in case I only need to read the front matter
            //rl.removeAllListeners('line');
            //rl.close();
          } else {
            // just add to yaml contents
            // console.log('(adding line to yaml contents)');
            yamlFMContents.push(input);
          }
        } else {
          // found the closing dashes, so add any further lines to contents
          // console.log('(adding line to file contents)');
          otherContents.push(input);
        }
      }
    });

    rl.on('close', () => {
      // if the FM was not terminated, that's no good
      if (foundInitialDashes && !foundClosingDashes) {
        reject(new Error('Non-terminated YAML front matter'));
      }

      // console.log('(closed).');
      resolve([yamlFMContents.join('\n'), otherContents.join('\n')]);
    });

  });

}

module.exports = yamlAndContentsFromStream;
