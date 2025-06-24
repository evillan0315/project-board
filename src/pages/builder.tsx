import { Show } from 'solid-js';

import { useAuth } from '../contexts/AuthContext';

import DynamicForm from '../components/form/DynamicForm';

export default function Builder() {
  const handleSubmit = (data: any) => {
    console.log('Form Data:', data);
    // Handle form submission
  };

  const schema2 = {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
        title: 'First Name',
        order: 1,
      },
      lastName: {
        type: 'string',
        title: 'Last Name',
        order: 2,
      },
      email: {
        type: 'string',
        title: 'Email Address',
        order: 3,
        colSpan: 2,
      },
      birthDate: {
        type: 'string',
        format: 'date',
        title: 'Birth Date',
        order: 4,
      },
      subscribe: {
        type: 'boolean',
        title: 'Subscribe to newsletter',
        order: 5,
      },
      tags: {
        type: 'array',
        title: 'Tags',
        order: 6,
        colSpan: 2,
      },
    },
    required: ['firstName', 'email'],
  };

  const schema = {
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

  const { isAuthenticated } = useAuth();
  return (
    <div class="flex-1 h-full overflow-auto">
      <DynamicForm schema={schema2} onSubmit={handleSubmit} />
    </div>
  );
}
