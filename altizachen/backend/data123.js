import bcrypt from 'bcryptjs';

const data123 = {
  users: [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
  ],

  products: [
    {
      //_id: '1',
      name: 'name1',
      image: '/images/w.jpg',
      price: 120,
      countInStock: 60,
      description: 'hig quality shirt',
    },
    {
      //_id: '2',
      name: 'Name2',
      image: '/images/p1.jpg',
      price: 120,
      countInStock: 70,
      description: 'hig quality',
    },
  ],
};
export default data123;
