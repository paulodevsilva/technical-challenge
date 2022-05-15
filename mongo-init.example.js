db.createUser({
  user: 'application_username',
  pwd: 'application_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'application_database',
    },
  ],
});
