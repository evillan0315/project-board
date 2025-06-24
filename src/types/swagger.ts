export type SwaggerSpec = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, SwaggerPathItem>;
  components?: {
    schemas?: Record<string, SwaggerSchema>;
  };
};

export type SwaggerPathItem = Record<string, SwaggerOperation>;

export type SwaggerOperation = {
  summary?: string;
  description?: string;
  responses: Record<string, any>;
  requestBody?: {
    content: Record<string, any>;
  };
};

export type SwaggerSchema = {
  type: string;
  properties?: Record<string, SwaggerSchemaProperty>;
  required?: string[];
};

export type SwaggerSchemaProperty = {
  type: string;
  format?: string;
};
