describe('My app', function() {
  beforeEach(function() {
    browser.get("http://127.0.0.1:7230/#/home");
  });

  it("should load home the page", function() {
    // test goes here
    expect(browser.getTitle()).toEqual("<%= appName %>");
    expect(browser.getLocationAbsUrl()).toMatch("/home");
  });
});
