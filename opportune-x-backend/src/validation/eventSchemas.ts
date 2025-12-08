import Joi from "joi";

export const eventSchema = Joi.object({
  title: Joi.string().required(),
  org: Joi.string().required(),
  applyUrl: Joi.string().uri().required(),
  type: Joi.string().allow("", null),
  source: Joi.string().allow("", null),
  sourceUrl: Joi.string().uri().allow("", null),
  mode: Joi.string().allow("", null),
  location: Joi.string().allow("", null),
  deadline: Joi.date().iso().allow(null),
  tags: Joi.array().items(Joi.string()).default([]),
  description: Joi.string().allow("", null),
  featured: Joi.boolean().optional(),
  collectedAt: Joi.date().iso().allow(null),
});