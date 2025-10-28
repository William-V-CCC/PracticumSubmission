# PracticumSubmission


Postman Test for the Default Route


pm.test("Status code is 200", () => {
  pm.response.to.have.status(200);
});

const json = pm.response.json();

pm.test("Response has message and endpoints", () => {
  pm.expect(json).to.have.property("message");
  pm.expect(json).to.have.property("endpoints");
});

pm.test("Endpoints object lists /batsignal routes", () => {
  pm.expect(json.endpoints).to.have.property("GET /batsignal");
  pm.expect(json.endpoints).to.have.property("POST /batsignal");
  pm.expect(json.endpoints).to.have.property("GET /batsignal/photo");
});
