# PracticumSubmission


Postman Test for the Default Route

pm.test("Status code is 200", () => {
  pm.response.to.have.status(200);
});


pm.test("Status message is OK", () => {
  pm.expect(pm.response.reason()).to.eql("OK");
});
const json = pm.response.json();

pm.test("Response includes a message field", () => {
  pm.expect(json).to.have.property("message");
});


