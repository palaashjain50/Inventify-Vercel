const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Update with the correct path to your server file
const expect = chai.expect;

chai.use(chaiHttp);

describe('Login Route', () => {
  it('should return status 401 and a message for missing fields', (done) => {
    chai.request(server)
      .post('/login')
      .send({}) // Sending empty body to simulate missing fields
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('success').to.equal(false);
        expect(res.body).to.have.property('message').to.equal('All fields required');
        done();
      });
  });

  it('should return status 401 and a message for non-existing account', function() {
    this.timeout(5000); // Increase the test timeout to 5 seconds (or adjust as needed)
  
    return chai.request(server)
      .post('/login')
      .send({ email: 'nonexistent@example.com', password: 'password', role: 'user' })
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('success').to.equal(false);
        expect(res.body).to.have.property('message').to.equal(`Account doesn't exist`);
        // done();
      });
  });
  
  

  it('should return status 401 and a message for invalid password', function() {
    this.timeout(5000);
  
    chai.request(server)
      .post('/login')
      .send({ email: 'harshjain3575@gmail.com', password: '1234', role: 'retailer' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('success').to.equal(false);
        expect(res.body).to.have.property('message').to.equal('Invalid Password');
        // done();
      });
  });

  it('should return status 200 and a message for valid password', function() {
    this.timeout(5000);
  
    chai.request(server)
      .post('/login')
      .send({ email: 'harshjain3575@gmail.com', password: '123', role: 'retailer' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').to.equal(true);
        expect(res.body).to.have.property('message').to.equal('User Login Success');
        // done();
      });
  });
  
  // Add more test cases for successful login scenarios and error handling if needed
});
