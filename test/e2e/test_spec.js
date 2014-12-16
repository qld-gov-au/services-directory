'use strict';

describe('test stuff', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get('http://localhost:9000/services');
    });

    it('should do something', function () {
        var title = element(by.css('.search-widget .widget-header h2'));
        expect(title.getText()).toBe('Search for services');
    });
});
