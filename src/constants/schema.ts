export const USER_PROFILE = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      description: 'Enter your first name',
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
      description: 'Enter your last name',
    },
    email: {
      type: 'string',
      title: 'Email',
      format: 'email',
      description: 'Enter your email address',
    },
    age: {
      type: 'number',
      title: 'Age',
      description: 'Enter your age',
    },
    newsletter: {
      type: 'boolean',
      title: 'Subscribe to Newsletter',
      default: true,
      description: 'Check if you want to subscribe to our newsletter',
    },
    role: {
      type: 'string',
      title: 'Role',
      enum: ['admin', 'editor', 'viewer'],
      description: 'Select your role',
    },
    bio: {
      type: 'string',
      title: 'Bio',
      format: 'textarea',
      description: 'Tell us about yourself',
    },
  },
  required: ['firstName', 'lastName', 'email'],
};
