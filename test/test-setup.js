describe("Top", function() {
  beforeEach(function() { console.log("Top Setup"); });
  beforeAll(function() { console.log("Top Before All"); });
  afterAll(function() { console.log("Top Cleanup"); });

  describe("Example 1", function() {
    beforeEach(function() { console.log("Example 1 Before Each"); });
    afterEach(function() { console.log("Example 1 After Each"); });
    beforeAll(function() { console.log("Example 1 Setup"); });
    afterAll(function() { console.log("Example 1 Cleanup"); });

    it("Test 1", function() {
      console.log("Test 1");
    });

    it("Test 2", function() {
      console.log("Test 2");
    });
  }); // Example 1

  describe("Example 2", function() {
    beforeAll(function() { console.log("Example 2 Setup"); });
    afterAll(function() { console.log("Example 2 Cleanup"); });

    it("Test 3", function() {
      console.log("Test 3");
    });

    it("Test 4", function() {
      console.log("Test 4");
    });
  }); // Example 2

});