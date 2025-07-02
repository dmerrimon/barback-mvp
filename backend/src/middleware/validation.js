const Joi = require('joi');

const validateSession = (req, res, next) => {
  const schema = Joi.object({
    venueId: Joi.string().uuid().required(),
    patronName: Joi.string().min(2).max(100).required(),
    patronPhone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    patronEmail: Joi.string().email().optional(),
    tableNumber: Joi.string().max(20).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

const validateTabItem = (req, res, next) => {
  const schema = Joi.object({
    itemName: Joi.string().min(1).max(100).required(),
    category: Joi.string().max(50).optional(),
    price: Joi.number().positive().precision(2).required(),
    quantity: Joi.number().integer().positive().optional(),
    addedBy: Joi.string().max(100).optional(),
    notes: Joi.string().max(500).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

const validatePayment = (req, res, next) => {
  const schema = Joi.object({
    sessionId: Joi.string().uuid().required(),
    amount: Joi.number().positive().precision(2).required(),
    tipAmount: Joi.number().min(0).precision(2).optional(),
    paymentMethodId: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

const validateBeacon = (req, res, next) => {
  const schema = Joi.object({
    venueId: Joi.string().uuid().required(),
    uuid: Joi.string().required(),
    major: Joi.number().integer().min(0).max(65535).required(),
    minor: Joi.number().integer().min(0).max(65535).required(),
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).optional(),
    location: Joi.object().optional(),
    rssiThreshold: Joi.number().integer().min(-100).max(0).optional(),
    isActive: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

const validateZone = (req, res, next) => {
  const schema = Joi.object({
    venueId: Joi.string().uuid().required(),
    name: Joi.string().min(1).max(100).required(),
    type: Joi.string().valid('entry', 'exit', 'bar', 'seating', 'other').required(),
    description: Joi.string().max(500).optional(),
    coordinates: Joi.object().optional(),
    triggerAction: Joi.string().valid('activate_tab', 'close_tab', 'notification', 'none').optional(),
    dwellTimeThreshold: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
    priority: Joi.number().integer().min(1).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateSession,
  validateTabItem,
  validatePayment,
  validateBeacon,
  validateZone
};