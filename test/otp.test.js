const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Update with the correct path to your server file
const expect = chai.expect;

chai.use(chaiHttp);

describe('OTP Route', () => {
  it('Should return status 401 and a message for missing fields', (done) => {
    chai.request(server)
      .post('/get-otp')
      .send({}) // Sending empty body to simulate missing fields
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('success').to.equal(false);
        expect(res.body).to.have.property('message').to.equal('Email address missing!');
        done();
      });
  });

  it('Should return status 401 and a message for an already existing account', function() {
    this.timeout(5000); // Increase the test timeout to 5 seconds (or adjust as needed)
  
    return chai.request(server)
      .post('/get-otp')
      .send({ email: 'harshjain3575@gmail.com'})
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('success').to.equal(false);
        expect(res.body).to.have.property('message').to.equal(`Account already exists!`);
      });
  });
  

  it('Should return status 200 and a message for otp generated', function() {
    this.timeout(5000);
  
    chai.request(server)
      .post('/get-otp')
      .send({ email: 'testerjain3575@gmail.com'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').to.equal(true);
        expect(res.body).to.have.property('message').to.equal('OTP sent successfully!');
      });
  });
  
  
});
