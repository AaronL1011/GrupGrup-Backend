//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const fs = require('fs');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

let postId = null;
let token = null;
let authorID = null;

chai.use(chaiHttp);

describe('Post Retrieval Errors', () => {
  describe('/GET api/posts/:id with incorrect post id', () => {
    it('should GET a post by its id', (done) => {
      chai
        .request(server)
        .get(`/api/posts/1234567890`)
        .end((err, res) => {
          res.should.have.status(400);
          res.error.text.should.equal(
            'This post doesnt exist, please check and try again.'
          );
          done();
        });
    });
  });
});

describe('Post Modification Errors', () => {
  describe('Dummy user creation for posting', () => {
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
          res.should.have.status(200);

          token = res.body.token;
          authorID = res.body.user.id;
          done();
        });
    });
  });

  describe('/POST api/image-upload with invalid file', () => {
    it('should return status 422 with invalid file message', (done) => {
      body = {
        visibility: '1',
        caption: 'Test caption',
        tags: 'hello, world',
        displayName: 'Test Username',
        authorURL: 'testuser'
      };
      chai
        .request(server)
        .post('/api/image-upload')
        .set('auth-token', token)
        .type('form')
        .attach('images', fs.readFileSync('./test/testgif.gif'), 'testgif.gif')
        .field('displayName', body.displayName)
        .field('authorURL', body.authorURL)
        .field('authorID', authorID)
        .field('visibility', body.visibility)
        .field('caption', body.caption)
        .field('tags', body.tags)
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(422);
          res.error.text.should.equal('Invalid file type, try another photo!');
          done();
        });
    });
  });

  describe('/PUT api/posts/:id with invalid post id', () => {
    it('should return status 400 with post not found message', (done) => {
      body = {
        visibility: '2',
        caption: 'Updated test caption',
        tags: 'updated, hello, world'
      };
      chai
        .request(server)
        .put(`/api/posts/123466797564`)
        .set('auth-token', token)
        .send(body)
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(400);
          res.error.text.should.equal(
            'Post doesnt exist, please check and try again.'
          );
          done();
        });
    });
  });

  describe('/PUT api/posts/:id with no auth token', () => {
    it('should return status 400 with post not found message', (done) => {
      body = {
        visibility: '2',
        caption: 'Updated test caption',
        tags: 'updated, hello, world'
      };
      chai
        .request(server)
        .put(`/api/posts/123466797564`)
        .set('auth-token', '')
        .send(body)
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(401);
          res.error.text.should.equal(
            'Token verification failed, authorization denied.'
          );
          done();
        });
    });
  });

  describe('/DELETE api/posts/:id with an invalid id', () => {
    it('should delete specified post and return a confirmation message', (done) => {
      chai
        .request(server)
        .delete(`/api/posts/123123123`)
        .set('auth-token', token)
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(400);
          res.error.text.should.equal(
            'Post not found, please check and try again'
          );
          done();
        });
    });
  });

  describe('Deleting dummy account', () => {
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
