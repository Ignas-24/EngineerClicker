import _ from "lodash";

const getCached = (fn) => {
  let cache = null;
  return () => {
    const curr = fn();
    if (_.isEqual(cache, curr)) {
      return cache;
    } else {
      cache = curr;
      return curr;
    }
  };
};

export default getCached;
