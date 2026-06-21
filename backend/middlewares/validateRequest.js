const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateRequest(schema = {}) {
  return (req, res, next) => {
    const errors = [];

    if (schema.body && !isPlainObject(req.body)) {
      errors.push({ field: 'body', message: 'Body must be a JSON object' });
    }

    validateSource(req.body || {}, schema.body, 'body', errors);
    validateSource(req.params || {}, schema.params, 'params', errors);
    validateSource(req.query || {}, schema.query, 'query', errors);

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    return next();
  };
}

function validateSource(source, validators, sourceName, errors) {
  Object.entries(validators || {}).forEach(([field, validator]) => {
    const result = validator(source[field], source);

    if (!result.valid) {
      errors.push({
        field: `${sourceName}.${field}`,
        message: result.message,
      });
      return;
    }

    if (Object.prototype.hasOwnProperty.call(result, 'value')) {
      source[field] = result.value;
    }
  });
}

function requiredString(field, { min = 1, max = 255, pattern } = {}) {
  return (value) => {
    if (typeof value !== 'string') {
      return { valid: false, message: `${field} is required` };
    }

    const trimmed = value.trim();
    if (trimmed.length < min) {
      return { valid: false, message: `${field} is too short` };
    }
    if (trimmed.length > max) {
      return { valid: false, message: `${field} is too long` };
    }
    if (pattern && !pattern.test(trimmed)) {
      return { valid: false, message: `${field} has an invalid format` };
    }

    return { valid: true, value: trimmed };
  };
}

function optionalString(field, options = {}) {
  const validate = requiredString(field, options);

  return (value) => {
    if (value === undefined || value === null || value === '') {
      return { valid: true };
    }

    return validate(value);
  };
}

function requiredInteger(field, { min = Number.MIN_SAFE_INTEGER } = {}) {
  return (value) => {
    const numberValue = Number(value);

    if (!Number.isInteger(numberValue) || numberValue < min) {
      return { valid: false, message: `${field} must be a valid number` };
    }

    return { valid: true, value: numberValue };
  };
}

function optionalInteger(field, options = {}) {
  const validate = requiredInteger(field, options);

  return (value) => {
    if (value === undefined || value === null || value === '') {
      return { valid: true };
    }

    return validate(value);
  };
}

function requiredEmail(value) {
  const result = requiredString('email', { max: 191, pattern: EMAIL_PATTERN })(value);
  return result.valid ? { valid: true, value: result.value.toLowerCase() } : result;
}

function requiredPassword(value) {
  return requiredString('password', { min: 8, max: 255 })(value);
}

function requiredDate(field) {
  return (value) => {
    if (typeof value !== 'string' || !DATE_PATTERN.test(value) || !isValidIsoDate(value)) {
      return { valid: false, message: `${field} must be a valid date` };
    }

    return { valid: true, value };
  };
}

function optionalDate(field) {
  const validate = requiredDate(field);

  return (value) => {
    if (value === undefined || value === null || value === '') {
      return { valid: true };
    }

    return validate(value);
  };
}

function isValidIsoDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
  );
}

function enumValue(field, allowedValues) {
  return (value) => {
    if (!allowedValues.includes(value)) {
      return { valid: false, message: `${field} is invalid` };
    }

    return { valid: true, value };
  };
}

function optionalEnumValue(field, allowedValues) {
  const validate = enumValue(field, allowedValues);

  return (value) => {
    if (value === undefined || value === null || value === '') {
      return { valid: true };
    }

    return validate(value);
  };
}

module.exports = {
  validateRequest,
  requiredString,
  optionalString,
  requiredInteger,
  optionalInteger,
  requiredEmail,
  requiredPassword,
  requiredDate,
  optionalDate,
  enumValue,
  optionalEnumValue,
};
