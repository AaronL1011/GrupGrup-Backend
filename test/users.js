//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const fs = require('fs');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

let userId = null;
let profileUrl = null;

chai.use(chaiHttp);
//Our parent block
describe('User Retrieval', () => {
  describe('/GET api/users', () => {
    it('should GET all the users', (done) => {
      chai
        .request(server)
        .get('/api/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(7);

          userId = res.body[3]._id;
          done();
        });
    });
  });

  describe('/GET api/users/:id', () => {
    it('should GET a user by their id', (done) => {
      chai
        .request(server)
        .get(`/api/users/${userId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('posts');
          res.body.should.have.property('_id');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('profile_url');
          res.body.should.have.property('password');
          res.body.should.have.property('bio');
          res.body.should.have.property('profile_picture');

          profileUrl = res.body.profile_url;
          done();
        });
    });
  });

  describe('/GET api/users/profile/:profileUrl', () => {
    it('should GET a users profile by their profile url', (done) => {
      chai
        .request(server)
        .get(`/api/users/profile/${profileUrl}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('posts');
          res.body.should.have.property('id');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('bio');
          res.body.should.have.property('profilePicture');
          done();
        });
    });
  });
});

let token = null;
let id = null;

describe('User Auth', () => {
  describe('/POST api/auth/signup', () => {
    it('should create a new user and return token and user data', (done) => {
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
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('user');
          res.body.user.should.have.property('username');
          res.body.user.should.have.property('id');
          res.body.user.should.have.property('url');

          token = res.body.token;
          done();
        });
    });
  });

  describe('/POST api/auth/login', () => {
    it('should log in a user and return token and user data', (done) => {
      let user = {
        email: 'testuser@email.com',
        password: '12345678'
      };

      chai
        .request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('user');
          res.body.user.should.have.property('username');
          res.body.user.should.have.property('id');
          res.body.user.should.have.property('url');
          done();
        });
    });
  });

  describe('/POST api/users/tokenIsValid', () => {
    it('should return true/false for a valid token', (done) => {
      chai
        .request(server)
        .post('/api/users/tokenIsValid')
        .set('auth-token', token)
        .end((err, res) => {
          res.body.should.be.a('boolean');
          done();
        });
    });
  });

  describe('/GET api/users/user', () => {
    it('should get user by their auth token', (done) => {
      chai
        .request(server)
        .get('/api/users/user')
        .set('auth-token', token)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('id');
          res.body.should.have.property('url');
          done();
        });
    });
  });
});

describe('User Modification', () => {
  describe('/PUT api/users/update', () => {
    it('should PUT new data to a user object', (done) => {
      body = {
        username: 'Updated Username',
        email: 'updatedtestuser@email.com',
        bio: 'Updated bio!'
      };

      chai
        .request(server)
        .put('/api/users/update')
        .set('auth-token', token)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('posts');
          res.body.should.have.property('_id');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('profile_url');
          res.body.should.have.property('password');
          res.body.should.have.property('bio');
          done();
        });
    });
  });

  describe('/POST api/profile-pic-upload', () => {
    it('should PUT new profile picture to a user object', (done) => {
      chai
        .request(server)
        .post('/api/profile-pic-upload')
        .set('auth-token', token)
        .type('form')
        .attach('image', fs.readFileSync('./test/test.png'), 'test.png')
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('profile_url');
          res.body.should.have.property('password');
          res.body.should.have.property('bio');
          done();
        });
    });
  });

  describe('/PUT api/users/update-password', () => {
    it('should PUT new password data to a user', (done) => {
      body = {
        current_password: '12345678',
        new_password: 'password'
      };

      chai
        .request(server)
        .put('/api/users/update')
        .set('auth-token', token)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('posts');
          res.body.should.have.property('_id');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('profile_url');
          res.body.should.have.property('password');
          res.body.should.have.property('bio');
          done();
        });
    });
  });

  describe('/DELETE api/users/delete', () => {
    it('should DELETE a user by their token', (done) => {
      chai
        .request(server)
        .delete('/api/users/delete')
        .set('auth-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('posts');
          res.body.should.have.property('_id');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('profile_url');
          res.body.should.have.property('password');
          res.body.should.have.property('bio');
          done();
        });
    });
  });
});
