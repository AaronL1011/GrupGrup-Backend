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

describe('Post Retrieval', () => {
  describe('/GET api/posts', () => {
    it('should GET all the posts', (done) => {
      chai
        .request(server)
        .get('/api/posts')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(10);

          postId = res.body[1]._id;
          done();
        });
    });
  });

  describe('/GET api/posts/:id', () => {
    it('should GET a post by its id', (done) => {
      chai
        .request(server)
        .get(`/api/posts/${postId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('tags');
          res.body.should.have.property('images');
          res.body.should.have.property('_id');
          res.body.should.have.property('displayName');
          res.body.should.have.property('authorID');
          res.body.should.have.property('authorURL');
          res.body.should.have.property('caption');
          res.body.should.have.property('visibility');
          res.body.should.have.property('displayName');
          done();
        });
    });
  });
});

describe('Post Modification', () => {
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
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('user');
          res.body.user.should.have.property('username');
          res.body.user.should.have.property('id');
          res.body.user.should.have.property('url');

          token = res.body.token;
          authorID = res.body.user.id;
          done();
        });
    });
  });

  describe('/POST api/image-upload', () => {
    it('should upload image to s3 and create and return a post object', (done) => {
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
        .attach('images', fs.readFileSync('./test/test.png'), 'test.png')
        .field('displayName', body.displayName)
        .field('authorURL', body.authorURL)
        .field('authorID', authorID)
        .field('visibility', body.visibility)
        .field('caption', body.caption)
        .field('tags', body.tags)
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('tags');
          res.body.should.have.property('images');
          res.body.should.have.property('_id');
          res.body.should.have.property('displayName');
          res.body.should.have.property('authorID');
          res.body.should.have.property('authorURL');
          res.body.should.have.property('caption');
          res.body.should.have.property('visibility');
          res.body.should.have.property('displayName');

          postId = res.body._id;
          done();
        });
    });
  });

  describe('/PUT api/posts/:id', () => {
    it('should update specified post and return updated post object', (done) => {
      body = {
        visibility: '2',
        caption: 'Updated test caption',
        tags: 'updated, hello, world'
      };
      chai
        .request(server)
        .put(`/api/posts/${postId}`)
        .set('auth-token', token)
        .send(body)
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('tags');
          res.body.should.have.property('images');
          res.body.should.have.property('_id');
          res.body.should.have.property('displayName');
          res.body.should.have.property('authorID');
          res.body.should.have.property('authorURL');
          res.body.should.have.property('caption');
          res.body.should.have.property('visibility');
          res.body.should.have.property('displayName');
          done();
        });
    });
  });

  describe('/DELETE api/posts/:id', () => {
    it('should delete specified post and return a confirmation message', (done) => {
      chai
        .request(server)
        .delete(`/api/posts/${postId}`)
        .set('auth-token', token)
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(200);
          res.body.should.be.a('object');
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
          res.body.should.be.a('object');
          res.body.should.have.property('posts');
          res.body.should.have.property('_id');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('profile_url');
          res.body.should.have.property('password');
          done();
        });
    });
  });
});
