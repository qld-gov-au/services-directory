'use strict';

describe('test interface', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get('http://localhost:9000/services');
    });

    it('check the title', function () {
        var test = element(by.css('//*[@id="content"]/child::node()'));
        var title = element(by.xpath('//*[@id="content"]/div/div/div/h1'));
//        var title = element(by.css('.search-widget .widget-header h2'));
//        console.log(title.getText());
//        expect(title.getText()).toBe('Search for services');
        console.log(typeof test, test.getSize());
    });

//    it('check the toggle', function () {
//        var form = element(by.css('#services-form'));
//        var toggle = element(by.css('#services-toggle'));
//        // on click
//        toggle.click();
//        expect(form.isDisplayed()).toBe(false);
//        // on second click
//        toggle.click();
//        expect(form.isDisplayed()).toBe(true);
//    });
//
//    // this is a slightly different version
//    it('check the toggle (again)', function () {
//        var form = element(by.css('#services-form'));
//        var toggle = element(by.css('#services-toggle'));
//        // on click
//        browser.actions().click(toggle).perform();
//        expect(form.isDisplayed()).toBe(false);
//        // on second click
//        browser.actions().click(toggle).perform();
//        expect(form.isDisplayed()).toBe(true);
//    });
});
