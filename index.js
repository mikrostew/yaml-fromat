'use strict';

const fs = require('fs');
const readline = require('readline');
const YAML = require('yaml');

// I think this is actually called a "document separator" in YAML?
// https://yaml.org/spec/1.2/spec.html
const FM_SEPARATOR = '---';

// returns a Promise that resolves to the YAML front matter, as JSON
function readFile(file) {

  let foundInitialDashes = false;
  let foundClosingDashes = false;
  // using this to contain the front matter
  let yamlFMContents = [];
  // the contents of the rest of the file
  let fileContents = '';

  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    // always treat CR LF ('\r\n') as a single line break
    crlfDelay: Infinity,
  });

  return new Promise((resolve) => {

    rl.on('line', (input) => {
      console.log(`line: ${input}`);

      // the main logic for finding the yaml front matter section
      if (!foundInitialDashes) {
        if (input.trim() === FM_SEPARATOR) {
          // ok, we found it
          foundInitialDashes = true;
          console.log('(start of front matter)');
        } else {
          // if the first line is not '---', assume there is no front matter
          // https://jekyllrb.com/docs/front-matter/
          console.log('(no front matter)');
        }
      } else {
        // already found the initial dashes,
        // so combine things together until we find the closing dashes
        if (!foundClosingDashes) {
          if (input.trim() === FM_SEPARATOR) {
            foundClosingDashes = true;
            console.log('(end of front matter)');
            // show the FM contents
            console.log('front matter contents');
            console.log(yamlFMContents);
            // then pause the stream, to resume after modifying the YAML?
            // this doesn't work:
            // rl.pause();
            // does this? no
            // rl.close();
            // for both of those, I still get 'line' events
            // does this work? yes, so use this in case I only need to read the front matter
            rl.removeAllListeners('line');
            rl.close();

            const fmYaml = YAML.parse(yamlFMContents.join('\n'));
            // console.log(fmYaml);
            // console.log(FM_SEPARATOR);
            // console.log(YAML.stringify(fmYaml));
            // console.log(FM_SEPARATOR);

            resolve(fmYaml);

          } else {
            // just add to yaml contents
            console.log('(adding line to yaml contents)');
            yamlFMContents.push(input);
          }
        } else {
          // found the closing dashes, so add any further lines to contents
          console.log('(adding line to file contents)');
          fileContents += input;
        }
      }
    });

    // debug to see what's going on with things

    rl.on('pause', () => {
      console.log('(paused).');
    });

    rl.on('resume', () => {
      console.log('(resumed).');
    });

    rl.on('close', () => {
      console.log('(closed).');
    });

  });

}



// TODO: real tests, for when I want to refactor all this mess
readFile('./test-file.md').then((yaml) => console.log(yaml));

// TODO
// module.exports = {
//   readFile,
// }
