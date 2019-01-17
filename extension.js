//import vscode
const vscode = require('vscode');
const opn = require('opn')
const platform = require('os').platform();

const WIN_CHROME = 'chrome';
const LINUX_CHROME = 'google-chrome';
const LINUX_CHROMIUM = 'chromium-browser';

function activate(context) {
    // any browsers
    const disposable = vscode.commands.registerCommand('extension.openWith', function () {
        let editor = vscode.window.activeTextEditor
        let doc = editor.document
        vscode.window.showQuickPick(getQuickPick(), {
            matchOnDescription: true,
            placeHolder: 'Which browser you want to use?'
        }).then((val) => {
          if (val) {
            opn(doc.fileName, { app: val })
          } else {
            return
          }
        })
      })
      context.subscriptions.push(disposable)
 }

 function getQuickPick() {
    let quickPick = [];
    if (platform === 'win32') {  // Windows
        quickPick = [
            WIN_CHROME,
            'iexplore'
        ];
    } else {  // Linux
        quickPick = [
            LINUX_CHROMIUM,
            LINUX_CHROME
        ];
    }
    quickPick.push('firefox');
    quickPick.push('yandex');
    return quickPick;
};


exports.activate = activate;

function deactivate() { };
exports.deactivate = deactivate;
