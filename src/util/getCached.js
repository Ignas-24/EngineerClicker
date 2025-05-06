import _ from 'lodash'
import { Achievement } from '../components/BottomLeft/Achievements/Achievement';

const getCached = (fn) => {
  let cache = null;
  return () => {
    const curr = fn();
    if (_.isEqual(cache, curr)) {
      if(typeof curr[0] == 'object') {
        console.log('equal');
        console.log(cache, curr);
      }
      return cache;
    } else {
      cache = curr;
      return curr;
    }
  };
};

export default getCached;
