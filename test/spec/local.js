/* globals describe, browser */
/* jshint unused:false */

(function (describe, browser) {
    'use strict';

    var assert = require('assert');

    describe('grunt-webdriver test', function () {

        it('checks for stuff', function (done) {

            browser
                .url('http://localhost:9001')
                .setValue('#content h1', 'grunt-webdriver')
//                .submitForm('.command-bar-form')
//                .getTitle(function (err, title) {
//                    assert(title.indexOf('grunt-webdriver') !== -1);
//                })
                .end(done);

        });

    });
}(describe, browser));