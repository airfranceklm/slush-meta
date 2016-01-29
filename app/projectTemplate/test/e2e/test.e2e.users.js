describe('My app', function() {
  beforeEach(function() {
    browser.get('http://127.0.0.1:7230/');
    browser.element(By.id("USERS")).click();
  });

  it('should have ten users per pages', function () {
    var nbElement = browser.element.all(by.repeater('user in users.list|filter:search'));
    expect(nbElement.count()).toBe(10);
  });

  it('should have 20 users if the more button is clicked', function () {
    browser.element(by.css('[ng-click="users.getNext()"]')).click();
    var nbElement = browser.element.all(by.repeater('user in users.list|filter:search'));
    expect(nbElement.count()).toBe(20);
  });

  it('should render the user creation view when clicking on the "Add" button', function () {
    browser.element.all(by.css('[ng-click="users.goToItem(user.tech_id)"]')).first().click();
    expect(browser.getLocationAbsUrl()).toMatch("/users/edit/");
  });

  it('First user is Patel Waren', function () {
    var firstUserName = browser.element(by.repeater('user in users.list|filter:search').row(0).column('lastName'));
    expect(firstUserName.getText()).toEqual("0 - Patel Warren");
  });

  it('Second user is Stark Eddard', function () {
    var secondUserName = browser.element(by.repeater('user in users.list|filter:search').row(1).column('lastName'));
    expect(secondUserName.getText()).toEqual("1 - Hallie Benton");
  });

  it('Third user is Lanister Tyrion', function () {
    var thirdUserName = browser.element(by.repeater('user in users.list|filter:search').row(2).column('lastName'));
    expect(thirdUserName.getText()).toEqual("2 - Tina Bridges");
  });
});
