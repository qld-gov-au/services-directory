/* globals describe, browser */
/* jshint unused:false */

(function (describe, browser) {
    'use strict';

    var assert = require('assert');

    describe('grunt-webdriver test', function () {

        it('checks if title contains the search query', function (done) {

            browser
                .url('http://github.com')
                .setValue('#js-command-bar-field', 'grunt-webdriver')
                .submitForm('.command-bar-form')
                .getTitle(function (err, title) {
                    assert(title.indexOf('grunt-webdriver') !== -1);
                })
                .end(done);

        });

    });
}(describe, browser));