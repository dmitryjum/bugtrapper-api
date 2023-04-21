export default {
  type: "object",
  properties: {
    message: { type: 'string' },
    error_details: { type: 'object' }
    application_id: { type: 'string' }
  },
  required: ['message']
} as const;