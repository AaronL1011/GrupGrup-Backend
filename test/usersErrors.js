//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const fs = require('fs');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

let invalidUserId = '1234567890';
let invalidProfileUrl = 'testingtestingtestingtesting';

chai.use(chaiHttp);
//Our parent block
describe('User Retrieval Errors', () => {
  describe('/GET api/users/:id with invalid id', () => {
    it('should return a status of 400 and appropriate message', (done) => {
      chai
        .request(server)
        .get(`/api/users/${invalidUserId}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.equal(
            'User doesnt exist, please check and try again'
          );
          done();
        });
    });
  });

  describe('/GET api/users/profile/:profileUrl with invalid url', () => {
    it('should return a status of 400 and appropriate message', (done) => {
      chai
        .request(server)
        .get(`/api/users/profile/${invalidProfileUrl}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.equal(
            'User doesnt exist, please check and try again'
          );
          done();
        });
    });
  });
});

let token = null;

describe('User Auth Errors', () => {
  describe('/POST api/auth/signup with missing profile url', () => {
    it('should return 400 with a dynamic error message', (done) => {
      let user = {
        username: 'Test Username',
        email: 'testuser@email.com',
        password: '12345678'
      };

      chai
        .request(server)
        .post('/api/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.be.a('string');
          done();
        });
    });
  });
  describe('/POST api/auth/signup with missing username', () => {
    it('should return 400 with a dynamic error message', (done) => {
      let user = {
        profile_url: 'TestUrl',
        email: 'testuser@email.com',
        password: '12345678'
      };

      chai
        .request(server)
        .post('/api/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.be.a('string');
          done();
        });
    });
  });

  describe('/POST api/auth/signup with missing password', () => {
    it('should return 400 with a dynamic error message', (done) => {
      let user = {
        username: 'Test Username',
        email: 'testuser@email.com',
        profile_url: '12345678'
      };

      chai
        .request(server)
        .post('/api/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.be.a('string');
          done();
        });
    });
  });

  describe('/POST api/auth/login with incorrect credentials', () => {
    it('should return status 400 and appropriate error message', (done) => {
      let user = {
        email: 'incorrectemail@email.com',
        password: '1234567dqedf3fasdqw8'
      };

      chai
        .request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.equal(
            'Some details were incorrect, please check email and password and try again.'
          );
          done();
        });
    });
  });

  describe('/POST api/auth/login with missing password', () => {
    it('should return status 400 and appropriate error message', (done) => {
      let user = {
        email: 'incorrectemail@email.com',
        password: ''
      };

      chai
        .request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.be.a('string');
          done();
        });
    });
  });

  describe('/POST api/auth/login with missing email', () => {
    it('should return status 400 and appropriate error message', (done) => {
      user = {
        email: '',
        password: '32gyuihcby42uibc2i3'
      };

      chai
        .request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.be.a('string');
          done();
        });
    });
  });

  describe('/POST api/auth/login with invalid email', () => {
    it('should return status 400 and appropriate error message', (done) => {
      let user = {
        email: 'notanemail',
        password: '238hd8hdi12'
      };

      chai
        .request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.be.a('string');
          done();
        });
    });
  });

  describe('/POST api/auth/login with invalid password', () => {
    it('should return status 400 and appropriate error message', (done) => {
      let user = {
        email: 'validemail@email.com',
        password: '123'
      };

      chai
        .request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.be.a('string');
          done();
        });
    });
  });

  describe('/POST api/users/tokenIsValid with an invalid token', () => {
    it('should return false for an invalid token', (done) => {
      chai
        .request(server)
        .post('/api/users/tokenIsValid')
        .set('auth-token', 'invalid')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal(false);
          done();
        });
    });
  });

  describe('/POST api/users/tokenIsValid with a missing token', () => {
    it('should return false for a missing token', (done) => {
      chai
        .request(server)
        .post('/api/users/tokenIsValid')
        .set('auth-token', '')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.equal(false);
          done();
        });
    });
  });

  describe('/GET api/users/user without auth token', () => {
    it('should return 401 with appropriate message', (done) => {
      chai
        .request(server)
        .get('/api/users/user')
        .end((err, res) => {
          res.should.have.status(401);
          res.error.text.should.equal(
            'Token verification failed, authorization denied.'
          );
          done();
        });
    });
  });

  describe('/GET api/users/user with invalid auth token', () => {
    it('should return 401 with appropriate message', (done) => {
      chai
        .request(server)
        .get('/api/users/user')
        .set('auth-token', 'invalid')
        .end((err, res) => {
          res.should.have.status(401);
          res.error.text.should.equal(
            'Token verification failed, authorization denied.'
          );
          done();
        });
    });
  });
});

describe('User Modification Errors', () => {
  describe('Dummy User Sign up', () => {
    it('create a new user and store token', (done) => {
      let user = {
        username: 'Test Username',
        email: 'testuser@email.com',
        password: '12345678',
        profile_url: 'testuser'
      };

      chai
        .request(server)
        .post('/api/auth/signup')
        .send(user)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    describe('/PUT api/users/update with invalid token', () => {
      it('should return status 401 and appropriate message', (done) => {
        body = {
          username: 'Updated Username',
          email: 'updatedtestuser@email.com',
          bio: 'Updated bio!'
        };

        chai
          .request(server)
          .put('/api/users/update')
          .set('auth-token', 'invalidtoken')
          .send(body)
          .end((err, res) => {
            res.should.have.status(401);
            res.error.text.should.equal(
              'Token verification failed, authorization denied.'
            );
            done();
          });
      });
    });

    describe('/POST api/profile-pic-upload wrong file type', () => {
      it('should return 422 and incorrect file message', (done) => {
        chai
          .request(server)
          .post('/api/profile-pic-upload')
          .set('auth-token', token)
          .type('form')
          .attach('image', fs.readFileSync('./test/testgif.gif'), 'testgif.gif')
          .end((err, res) => {
            // console.log(res);
            res.should.have.status(422);
            res.error.text.should.equal(
              'Invalid file type, try another photo!'
            );
            done();
          });
      });
    });

    describe('/PUT api/users/update-password with wrong current_password', () => {
      it('should return 400 and error message', (done) => {
        body = {
          current_password: '1234567X',
          new_password: 'password'
        };

        chai
          .request(server)
          .put('/api/users/update-password')
          .set('auth-token', token)
          .send(body)
          .end((err, res) => {
            res.should.have.status(400);
            res.error.text.should.equal(
              'Some details were incorrect, please check password and try again.'
            );
            done();
          });
      });
    });

    describe('/PUT api/users/update-password with invalid new_password', () => {
      it('should return 400 and error message', (done) => {
        body = {
          current_password: '12345678',
          new_password: 'pass'
        };

        chai
          .request(server)
          .put('/api/users/update-password')
          .set('auth-token', token)
          .send(body)
          .end((err, res) => {
            res.should.have.status(400);
            res.error.text.should.equal(
              'Password must be a minimum of 6 characters!'
            );
            done();
          });
      });
    });

    describe('/DELETE api/users/delete with invalid token', () => {
      it('should return 401 with unauthorized message', (done) => {
        chai
          .request(server)
          .delete('/api/users/delete')
          .set('auth-token', 'invalidtoken')
          .end((err, res) => {
            res.should.have.status(401);
            res.error.text.should.equal(
              'Token verification failed, authorization denied.'
            );
            done();
          });
      });
    });

    describe('DELETE Dummy User', () => {
      it('should DELETE a user by their token', (done) => {
        chai
          .request(server)
          .delete('/api/users/delete')
          .set('auth-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});
