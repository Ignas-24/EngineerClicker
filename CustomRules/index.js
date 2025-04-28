import numberSeparatorRule from './LargeNumberSeparatorRule.js';
import requireNotifyRule from './RequireNotifyAfterGameMutation.js';
import indentationRule from './IndentationReadibility.js';

export default {
  rules: {
    'numeric-separators': numberSeparatorRule,
    'require-notify-after-game-mutation': requireNotifyRule,
    'require-less-indentations': indentationRule
  },
};