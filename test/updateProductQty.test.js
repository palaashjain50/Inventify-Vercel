const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Update with the correct path to your server file
const expect = chai.expect;

chai.use(chaiHttp);

describe('Update Product Quantities Route', () => {
  // 1.Staff/retailer trying to update product quantites
  it('Should return status 401 and a message for unauthorized user', function() {
    this.timeout(10000);
    chai.request(server)
      .post('/update-approval-status/Staff-049')
      .set('Cookie','token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbmFnZXIxQGdtYWlsLmNvbSIsImlkIjoiNjUzOGYzOTQ1MzhmNDNhZGE0MjRiZTRkIiwicm9sZSI6Im1hbmFnZXIiLCJ1c2VybmFtZSI6Ik1hbmFnZXItMSIsImlhdCI6MTcwMDk5MTM1NywiZXhwIjoxNzAxMDc3NzU3fQ.SBkmLPwMYBWyERcarD77tKpWi7M_RCzDVpuSERq2YeE')
      .send({
        transactionID: '65630d3a8be5015e1de388a5',
        status: 'In Approval',
        username: 'Staff-049'
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('success').to.equal(false);
        expect(res.body).to.have.property('message').to.equal('Unauthorized error');
        // done();
      });
  });


  // 2.Staff/retailer trying to update product quantites
  it('Should return status 500 and a message for invalid transaction id', function() {
    this.timeout(10000);
    chai.request(server)
      .post('/update-approval-status/Manager-1')
      .set('Cookie', 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbmFnZXIxQGdtYWlsLmNvbSIsImlkIjoiNjUzOGYzOTQ1MzhmNDNhZGE0MjRiZTRkIiwicm9sZSI6Im1hbmFnZXIiLCJ1c2VybmFtZSI6Ik1hbmFnZXItMSIsImlhdCI6MTcwMDk5MTM1NywiZXhwIjoxNzAxMDc3NzU3fQ.SBkmLPwMYBWyERcarD77tKpWi7M_RCzDVpuSERq2YeE')
      .send({
        transactionID: '65630d3a8be5015e1de388a1',
        status: 'In Approval',
        username: 'Manager-1'
      })
      .end((err, res) => {
        if(res.body.response.message === `Invalid Transaction ID, product quantites can't be updated!`) console.log("Invalid Transaction ID, product quantites can't be updated!")
        expect(res).to.have.status(500);
      });
  });

});
