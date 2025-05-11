import numberSeparatorRule from './LargeNumberSeparatorRule.js';
import requireNotifyRule from './RequireNotifyAfterGameMutation.js';

export default {
  rules: {
    'numeric-separators': numberSeparatorRule,
    'require-notify-after-game-mutation': requireNotifyRule
  },
};