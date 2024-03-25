function convertRules(rules) {
  const convertedRules = { ...rules };

  function convertObject(obj) {
    for (const key in obj) {
      if (obj[key] === null) {
        if (key === 'rules' || key === 'arguments' || key === 'then') {
          obj[key] = [];
        } else {
          obj[key] = "";
        }
      }

      else if (typeof obj[key] === 'object') {
        convertObject(obj[key]);
      }
    }
  }

  convertObject(convertedRules);

  if (!Array.isArray(convertedRules)) {
    return [convertedRules];
  }

  return convertedRules;
}

module.exports = convertRules;