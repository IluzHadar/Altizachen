import bcrypt from 'bcryptjs';

const data123 = {
  users: [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'Hadar',
      email: 'Hadar@example.com',
      password: bcrypt.hashSync('Ss123456'),
      isAdmin: true,
    },
  ],

  products: [
    {
      //_id: '1',
      name: 'name12310101010404',
      image: '/images/w.jpg',
      category: 2,
      description: 'hig quality shirt',
    },
    {
      //_id: '2',
      name: 'Name2',
      image: '/images/p1.jpg',
      category: 2,
      description: 'hig quality',
    },
  ],
};
export default data123;
