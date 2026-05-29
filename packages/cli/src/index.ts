import { login } from './login.js';
import { init } from './init.js';
import { add, addAll } from './add.js';
import { list } from './list.js';

const args = process.argv.slice(2);
const command = args[0];

const HELP = `
  atom-uikit — ATOM UIKit Design System CLI

  Commands:
    login              Authenticate (opens browser)
    init               Create config + install foundations
    add <name>         Add a component to your project
    add --all          Add all components
    list               Show available components
    help               Show this help

  Examples:
    npx atom-uikit login
    npx atom-uikit init
    npx atom-uikit add button
    npx atom-uikit list
`;

async function main() {
  try {
    switch (command) {
      case 'login':
        await login();
        break;

      case 'init':
        await init();
        break;

      case 'add': {
        const name = args[1];
        if (name === '--all') {
          await addAll();
        } else if (name) {
          await add(name);
        } else {
          console.error('  Usage: npx atom-uikit add <name>\n');
          process.exit(1);
        }
        break;
      }

      case 'list':
        await list();
        break;

      case 'help':
      case '--help':
      case '-h':
      case undefined:
        console.log(HELP);
        break;

      default:
        console.error(`  Unknown command: ${command}\n`);
        console.log(HELP);
        process.exit(1);
    }
  } catch (err: any) {
    console.error(`\n  Error: ${err.message}\n`);
    process.exit(1);
  }
}

main();
