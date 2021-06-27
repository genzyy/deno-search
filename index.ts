import yargs from 'https://deno.land/x/yargs@v17.0.1-deno/deno.ts';
import * as path from 'https://deno.land/std@0.97.0/path/mod.ts';

const IGNORED_DIRECTORIES = new Set(['.git', '.github', '.gitignore']);

interface Match {
  fileName: string;
  lineNumber: number;
  lineText: string;
}
const Matches = new Map<string, Set<Match>>();

interface Yargs<ArgvReturnType> {
  describe: (param: string, description: string) => Yargs<ArgvReturnType>;
  demandOption: (required: string[]) => Yargs<ArgvReturnType>;
  argv: ArgvReturnType;
}

interface UserArguments {
  text: string;
  extension?: string;
}

interface FilterOptions {
  extension?: string;
}

const userArguments: UserArguments = (
  yargs(Deno.args) as unknown as Yargs<UserArguments>
)
  .describe('text', 'the text to search within the files of current directory')
  .describe('extension', 'enter the file extension')
  .demandOption(['text']).argv;

//console.log(userArguments);

//for await (const fileOrFolder of Deno.readDir(Deno.cwd())) {
//  console.log(fileOrFolder);
//}

async function getFilesList(
  directory: string,
  options: FilterOptions = {}
): Promise<string[]> {
  const foundFiles: string[] = [];
  for await (const fileOrFolder of Deno.readDir(directory)) {
    if (fileOrFolder.isDirectory) {
      if (IGNORED_DIRECTORIES.has(fileOrFolder.name)) continue;
      const nestedFiles = await getFilesList(
        path.join(directory, fileOrFolder.name),
        options
      );
      foundFiles.push(...nestedFiles);
    } else {
      const shouldStoreFile =
        !options.extension ||
        path.extname(fileOrFolder.name) === `.${options.extension}`;

      if (shouldStoreFile)
        foundFiles.push(path.join(directory, fileOrFolder.name));
    }
  }
  return foundFiles;
}

const files = await getFilesList(Deno.cwd(), userArguments);
//console.log(files);

for (const file of files) {
  const contents = await Deno.readTextFile(file);
  //console.log(contents);
  const lines = contents.split('\n');
  lines.forEach((line: any, index: any) => {
    if (line.includes(userArguments.text)) {
      const matchesForFile = Matches.get(file) || new Set<Match>();
      matchesForFile.add({
        fileName: file,
        lineNumber: index + 1,
        lineText: line
      });
      Matches.set(file, matchesForFile);
    }
  });
}

for (const match of Matches) {
  const [fileName, fileMatches] = match;
  console.log(fileName);
  fileMatches.forEach(m => {
    console.log(
      'On File:',
      m.fileName + ', On Line Number =>',
      m.lineNumber,
      ' as:\n',
      m.lineText.trim()
    );
  });
}
