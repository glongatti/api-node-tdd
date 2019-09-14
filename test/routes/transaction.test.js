const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

let user;
let user2;
let accUser;
let accUser2;

const MAIN_ROUTE = '/v1/transactions';

beforeAll(async () => {
  await app.db('transactions').del();
  await app.db('accounts').del();
  await app.db('users').del();

  const users = await app.db('users').insert([
    { name: 'User #1', email: 'user@mail.com', password: '$2a$10$2tPO2qUIpAgCMlUvbN7iw.ALYqceJh9l2wsawqBBwYPPZQRJjSJEG' },
    { name: 'User #2', email: 'user2@mail.com', password: '$2a$10$2tPO2qUIpAgCMlUvbN7iw.ALYqceJh9l2wsawqBBwYPPZQRJjSJEG' },
  ], '*');
  [user, user2] = users;
  delete user.password;
  user.token = jwt.encode(user, 'Segredo!!');
  const accs = await app.db('accounts').insert([
    { name: 'Acc #1', user_id: user.id },
    { name: 'Acc #2', user_id: user2.id },
  ], '*');
  [accUser, accUser2] = accs;
});

test('Deve listar apenas as transações do usuário', () => {
  // 2 usuários, 2 contas , 2 transações
  console.log('acc user', accUser)
  return app.db('transactions').insert([
    {
      description: 'T1', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id,
    },
    {
      description: 'T2', date: new Date(), ammount: 300, type: 'O', acc_id: accUser2.id,
    },
  ]).then(() => request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].description).toBe('T1');
    }));
});
