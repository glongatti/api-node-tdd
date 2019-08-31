const request = require('supertest');

const app = require('../../src/app');

const email = `${Date.now()}@mail.com`;


test('Deve listar todos os usuários', () => {
  return request(app).get('/users').then((res) => {
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    // expect(res.body[0]).toHaveProperty('name', 'John Doe');
  });
});


test('Deve inserir o usuário com sucesso', () => {
  return request(app).post('/users')
    .send({ name: 'Walter Mitty', email, password: '123456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Walter Mitty');
    });
});

test('Não deve inserir um usuário sem nome', () => {
  const mail = `${Date.now()}@mail.com`;
  return request(app).post('/users')
    .send({ email: mail, password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});

test('Não deve inserir usuário sem email', async () => {
  const result = await request(app).post('/users')
    .send({ name: 'Walter Mitty', password: '123456' });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatório');
});

test('Não deve inserir usuário sem senha', async (done) => {
  request(app).post('/users')
    .send({ name: 'Walter Mitty', email: 'asdasdas@sadsa.com' }).then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Senha é um atributo obrigatório');
      done();
    });
});

test('Não deve inserior usuário com e-mail existente', () => {
  return request(app).post('/users')
    .send({ name: 'Walter Mitty', email, password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Já existe um usuário com esse email');
    });
});