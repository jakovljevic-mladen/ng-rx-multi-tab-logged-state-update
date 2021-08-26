export interface User {
  email: string;
  role: Role;
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface Permission {
  type: string;
}

export const getAdminUser = () => <User>{
  email: 'admin@example.com',
  role: {
    name: 'ADMIN',
    permissions: [
      { type: 'ADMINISTRATION' },
      { type: 'USERS_READ' },
      { type: 'USERS_WRITE' }
    ]
  }
};

export const getRegularUser = () => <User>{
  email: 'regular@example.com',
  role: {
    name: 'REGULAR',
    permissions: [
      { type: 'USERS_READ' }
    ]
  }
};
