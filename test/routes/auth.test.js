const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/auth';

test('Deve criar usuario via signup', () => {
  const email = `${Date.now()}@gmail.com`;

  return request(app).post('/auth/signup')
    .send({ name: 'Walter', email, password: '12345' })
    .then((res) => {
      // console.log('resss', res)
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Walter');
      expect(res.body).toHaveProperty('email');
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Deve receber token ao longar', () => {
  const email = `${Date.now()}@gmail.com`;
  return app.services.user.save({ name: 'Walter', email, password: '1123123' })
    .then(() => {
      request(app).post('/auth/signin')
        .send({ email, password: '1123123' })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('token');
        });
    });
});

test('Não deve autenticar usuário com senha errada!', () => {
  const email = `${Date.now()}@gmail.com`;
  return app.services.user.save({ name: 'Walter', email, password: '1123123' })
    .then(() => {
      request(app).post('/auth/signin')
        .send({ email, password: '1111111' })
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.error).toBe('Usuário ou senha incorretos');
        });
    });
});

test('Não deve autenticar usuário que não existe', () => {
  return request(app).post('/auth/signin')
    .send({ email: 'asdaas.com', password: '1111111' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuário ou senha incorretos');
    });
});

test('Não deve acessar uma rota protegida sem token', () => {
  return request(app).get('/v1/users').then((res) => {
    expect(res.status).toBe(401);
  });
});
