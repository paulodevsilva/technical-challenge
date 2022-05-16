db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [
    {
      role: 'dbOwner',
      db: 'technical-challenge',
    },
  ],
});
