export type AccessArgs = {
  session?: {
    itemId?: string;
    listKey?: string;
    data?: {
      name?: string;
      permissions: 'USER' | 'EDITOR' | 'ADMIN';
    };
  };
  item?: any;
};

export type AccessControl = {
  [key: string]: (args: AccessArgs) => any;
};
