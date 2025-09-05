import * as Joi from 'joi';

export const schema = Joi.object({
  port: Joi.number().integer().default(3000),
  database: Joi.object({
    url: Joi.string()
      .pattern(/postgres:\/\/[a-zA-Z]/)
      .required(),
    port: Joi.number().integer().required(),
  }),
  jwt: Joi.object({
    secret: Joi.string().required(),
  }),
});

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    saltOrRounds: 10,
  },
});
