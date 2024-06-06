import * as fs from 'fs';
import * as path from 'path';

function concatFiles(dirs: string[]): string {
  let result = '';

  for (const dir of dirs) {
    if (fs.lstatSync(dir).isDirectory()) {
      const files = fs.readdirSync(dir);
      const filePaths = files.map(file => path.join(dir, file));
      result += concatFiles(filePaths);
    } else {
      const filename = path.basename(dir);
      const fileContent = fs.readFileSync(dir, 'utf-8');
      result += `// ${filename}\n${fileContent}\n\n`;
    }
  }

  return result;
}

// Usage:
// const dirs = ['dir1', 'dir2', 'file1.ts', 'file2.ts'];
// const content = concatFiles(dirs);
// console.log(content);


const content = concatFiles(["src", "test",
  "README.md",
  "package.json"]);
// console.log(content);
const outputFileName = "dist/abc.txt";
console.info(`See ${outputFileName}`)
await Bun.write(outputFileName, content);

