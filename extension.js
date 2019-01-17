//import vscode
const vscode = require('vscode');
const opn = require('opn')
const platform = require('os').platform();
const defaultBrowser = require('x-default-browser');

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
              doc.save();
            let appArgs = getChromeArgs(val);
            opn(doc.fileName, { app: appArgs });
          } else {
            return
          }
        })
      })
      context.subscriptions.push(disposable)

      //  default browser
    const disposableDefault = vscode.commands.registerCommand('extension.openWithDefault', () => {
        let editor = vscode.window.activeTextEditor;
        let doc = editor.document;

        defaultBrowser(function (error, result) {
            if (!error) {
                let appName = null;
                if (result.commonName === 'chrome') {
                    if (platform === 'win32') {
                        appName = WIN_CHROME;
                    } else {
                        appName = LINUX_CHROME;
                    }
                } else if (result.commonName === 'chromium') {
                    appName = LINUX_CHROMIUM;
                }
                doc.save();
                opn(doc.fileName, { app: appName });
            }
            else {
                opn(doc.fileName);
            }
        });
    });
    context.subscriptions.push(disposableDefault)
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

function getChromeArgs(val) {
    let args = [];
    if (val === 'chrome with devtools') {
        switch (platform) {
            case 'win32':
                args = [WIN_CHROME];
                break;
            case 'linux':
                args = [LINUX_CHROME];
                break;
            default:
                console.log(platform);
                break;
        }
        args.push('--auto-open-devtools-for-tabs');
        return args;
    } else {
        return val;
    }
}

exports.activate = activate;

function deactivate() { };
exports.deactivate = deactivate;
