import bcrypt from 'bcryptjs';

const data123 = {
  users: [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
      sumOfLike: 0,
      userRating: 0,
      userAdCounter: 0,
        },
  ],

  products: [
    {
      //_id: '1',
      name: 'name1',
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
