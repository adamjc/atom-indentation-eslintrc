'use babel';

import { CompositeDisposable } from 'atom';

export default {

  atomIndentationEslintrcView: null,
  modalPanel: null,
  subscriptions: null,
  toggled: false,
  initialIndentRule: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-indentation-eslintrc:toggle': () => this.toggle()
    }));
  },

  getESLintIndentationRule() {
    return atom.project.getDirectories()[0].getFile('.eslintrc.json').read().then(file => {
      let eslintrc = JSON.parse(file);

      if (eslintrc && eslintrc.rules && eslintrc.rules.indent) {
        return eslintrc.rules.indent[1];
      } else {
        atom.notifications.addError(`Could not find .eslintrc.json in ${atom.project.getDirectories()[0]}`);
      }
    });
  },

  getCurrentIndentationRule() {
      return atom.config.get('editor.tabLength');
  },

  setESLintIndentationRule(rule) {
    if (rule) {
      atom.config.set('editor.tabLength', rule);
      atom.notifications.addSuccess(`Indentation set to: ${this.getCurrentIndentationRule()}`)
    }
  },

  deactivate() {
    this.setESLintIndentationRule(this.initialIndentRule);
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  toggle() {
    if (!this.toggled) {
      this.initialIndentRule = this.getCurrentIndentationRule();
      this.getESLintIndentationRule().then(rule => this.setESLintIndentationRule(rule));
    } else {
      this.setESLintIndentationRule(this.initialIndentRule);
    }

    this.toggled = !this.toggled;
  }

};
