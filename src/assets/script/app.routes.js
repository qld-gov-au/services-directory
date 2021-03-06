/* globals jQuery, Placeholders, Handlebars, routie */
/* jshint unused:false, sub:true, expr:true */

var qg = qg || {};
    qg.swe = qg.swe || {};

qg.swe.services = (function ( $, swe ) {
    'use strict';

    // jquery objects
    var $list = $( '#services' ),
        $form = $( '#services-form' ),
        $widget = $( '#services-widget' ),
        $search = $( '#services-search' );

    var template = {
        error: $( '#error-template' ).html(),
        warn: $( '#warn-template' ).html(),
        list: $( '#list-template' ).html(),
        widget: $( '#widget-template' ).html()
    };

    // arguments
    var args = {
        title: 'Do it online | Queensland Government',
        orderBy: 'service',
        category: {
            title: 'Transport and motoring',
            slug: 'transport-and-motoring'
        },
        resource: {
            // Prod
            id: '384429ae-fd27-4448-afe6-e4ecb8d1ad93',
            url: 'data.qld.gov.au'
        }
    };

    // Set to staging server if detected
    if (window.location.href.indexOf('qld-uat.ssq.qld.gov.au') > -1 || window.location.href.indexOf('local') > -1) {
        args.resource = {
            // Staging
            // id: 'c361766e-f9d4-490a-817d-5effbdd97ba5', <-- Note: couldn't find this resource
            id: '15941f11-2f1d-4d8d-9245-563f4526f2ef',
            url: 'staging.data.qld.gov.au'
        };
    }

    // locations
    var locations = {
        root: {
            title: args.title,
            params: {
                'kiosk-friendly': null,
                'kiosk-only': false,
                'print-required': null,
                'wide-display': false
            }
        },
        jimboomba: {
            title: 'Jimboomba - ' + args.title,
            params: {
                'kiosk-friendly': true,
                'kiosk-only': true,
                'print-required': null,
                'wide-display': false
            }
        },
        laidley: {
            title: 'Laidley - ' + args.title,
            params: {
                'kiosk-friendly': true,
                'kiosk-only': true,
                'print-required': null,
                'wide-display': true
            }
        },
        plainland: {
            title: 'Plainland - ' + args.title,
            params: {
                'kiosk-friendly': true,
                'kiosk-only': true,
                'print-required': null,
                'wide-display': true
            }
        }
    };

    // Custom dictionary for keywords. Uses regex on both sides
    // var dictionary = {
    //     replace: {
    //         'stamp.duty': 'transfer duty'
    //     },
    //     supplement: {
    //         'test': 'work'
    //     }
    // };

    var app = {
        init: function () {
            // properties
            this.props = {
                types: null,
                route: null,
                query: null,
                params: null,
                location: null,
                kiosk: null,
                page: null,
                relevance: null
            };

            // events
            this.event.submit();
            this.event.reset();
            this.get.types();
            this.get.route();
            this.get.query();
            this.set.toggle();
            this.get.relevance();

            // empty
            app.empty();

            // routes
            routie({
                '/': function () {
                    //console.log( 'Route: root' );
                    app.empty();
                    app.set.form();
                    app.set.location();
                    app.set.route();
                    app.set.params( app.props.location );
                    app.set.kiosk( app.props.location );
                    app.get.query();
                    app.get.page();
                    app.data.online();
                    app.data.offline();
                    app.data.widget( args.category.slug );
                },
                '/:query': function ( value ) {
                    console.log( 'Route: query' );
                    app.empty();
                    app.set.form( value );
                    app.set.location();
                    app.set.route();
                    app.set.params( app.props.location );
                    app.set.kiosk( app.props.location );
                    app.get.query();
                    app.get.page();
                    app.data.online();
                    app.data.offline();
                    app.data.widget( args.category.slug );
                },
                '/location/:name': function ( value ) {
                    //console.log( 'Route: location' );
                    app.empty();
                    app.set.form( value );
                    app.set.location( value );
                    app.set.route( '/location/' + value );
                    app.set.params( app.props.location );
                    app.set.kiosk( app.props.location );
                    app.get.query();
                    app.get.page();
                    if ( !!app.props.params ) {
                        app.data.online();
                        app.data.offline();
                        app.data.widget( args.category.slug );
                    }
                }
            });

            // run route
            routie( app.props.route + ( !!app.props.query ? ( '?' + app.props.query ) : '' ) );
        },
        empty: function () {
            $list.empty();
            $widget.empty();
        },
        event: {
            submit: function () {
                $form.submit(function ( event ) {
                    var $submitTarget;
                    console.log( 'submit triggered', event );
                    event.preventDefault();
                    var values = [];
                    if( !! app.props.relevance ) {
                        values.push( 'relevance=' + app.props.relevance ); // Add Relevance
                    }
                    $form.find( '.form-section' ).find( 'input, select' ).each(function () {
                        !$( this ).val() || values.push( $( this ).attr( 'id' ) + '=' + $( this ).val().replace( / /g, '+' ) );
                    });
                    app.set.query( values );

                    // Hack to get around SWE
                    $submitTarget = $(this).find('input[type=submit]');
                    $submitTarget.prop('disabled', true);
                    setTimeout(
                        (function( $submitTarget ){
                            return function() {
                                console.log('timeout', $submitTarget);
                                // $(this).find('input[type=submit]').prop('disabled', false);
                                $submitTarget.prop('disabled', false);
                            };
                        }($submitTarget)
                    ), 10000);
                });

            },
            reset: function () {
                // Binds the reset function
                $form.find( '.reset' ).bind( 'click', function ( event ) {
                    app.action.reset( true );
                    /*
                    var relevanceStr = (!! app.props.relevance && app.props.relevance != null ) ? '?relevance='+app.props.relevance : '';
                    event.preventDefault();
                    app.get.route();
                    if ( !!window.location.search ) {
                        routie( app.props.route + relevanceStr + window.location.search );
                    } else {
                        routie( app.props.route + relevanceStr );
                    }
                    */
                });
            },
            toggle: function () {
                $( '#services-toggle' ).bind( 'click', function ( e ) {
                    e.preventDefault();
                    $form.is( ':visible' ) ? $form.addClass( 'hide' ) : $form.removeClass( 'hide' );
                    $form.is( ':visible' ) ? $( this ).addClass( 'up' ) : $( this ).removeClass( 'up' );
                });
            }
        },
        action: {
            reset: function() {
                // Actually re-sets the form
                var relevanceStr = (!! app.props.relevance && app.props.relevance != null ) ? '?relevance='+app.props.relevance : '';

                app.get.route();
                if ( !!window.location.search ) {
                    routie( app.props.route + relevanceStr + window.location.search );
                } else {
                    routie( app.props.route + relevanceStr );
                }
            },
            clearRelevance: function() {
                // resets the relevance
                var props,
                    queryString;
                props = app.props.query.replace('relevance='+app.props.relevance,'').replace('&&','&').replace(/^&/,'').replace(/&$/,'').split('&');
                queryString = app.props.query.replace('relevance='+app.props.relevance,'').replace('&&','&').replace(/^&/,'').replace(/&$/,'');
                app.props.relevance = null;

                app.set.query( props );
                routie( app.props.route + '?' + queryString );
            }

        },
        parse: {
            online: function ( records ) {
                var result = {
                    type: {},
                    length: records.length
                };
                for ( var key in records ) {
                    if ( records.hasOwnProperty( key ) ) {
                        var type = records[ key ][ 'type-slug' ];
                        if ( !result.type.hasOwnProperty( type ) ) {
                            result.type[ type ] = {
                                services: [],
                                title: app.props.types[ type ],
                                image: type
                            };
                        }
                        result.type[ type ].services.push( records[ key ] );
                    }
                }
                return result;
            },
            offline: function ( records ) {
                var result = [];
                for ( var key in records ) {
                    if ( records.hasOwnProperty( key ) ) {
                        result.push( records[ key ] );
                    }
                }
                return result;
            },
            widget: function ( records ) {
                var result = {services: [], category: args.category};
                for ( var key in records ) {
                    if ( records.hasOwnProperty( key ) ) {
                        records[ key ].available = ( 'yes' === records[ key ].available ) ? !0 : !1;
                        result.services.push( records[ key ] );
                    }
                }
                return result;
            },
            keywords: function( keywords ) {
                var key,
                    regex;
                // Dictionary supplement and replace
                keywords = keywords.replace('+',' ').toLowerCase(); // Clean up '+' for spaces
                // for( key in dictionary.supplement ) {
                //     console.log('loop',key,keywords);
                //     if( dictionary.supplement.hasOwnProperty(key) ) {
                //         regex = new RegExp( key.replace(' ','+') );
                //         console.log('loop',key,regex);
                //         keywords = keywords.replace( regex, key + '|' +dictionary.supplement[key] );
                //     }
                // }
                // for( key in dictionary.replace ) {
                //     if( dictionary.replace.hasOwnProperty( key.replace(' ','+') ) ) {
                //         regex = new RegExp(key);
                //         keywords = keywords.replace( regex, dictionary.replace[key] );
                //     }
                // }
                // clean for to_tsquery
                keywords = keywords.replace(/[\+\s]/g,' & ');
                return keywords;
            }
        },
        show: {
            error: function ( message ) {
                var wrapper = {error: message},
                    populate = Handlebars.compile( template.error );
                $list.empty().append( populate( wrapper ) ).trigger( 'x-height-change' );
            },
            online: function ( data ) {
                if ( data.success && data.result.records.length ) {
                    var result = app.parse.online( data.result.records ),
                        wrapper = {items: result},
                        populate = Handlebars.compile( template.list );
                    $list.append( populate( wrapper ) ).trigger( 'x-height-change' );
                } else {
                    app.show.error( null );
                }
            },
            offline: function ( data ) {
                if ( data.success && data.result.records.length ) {
                    var result = app.parse.offline( data.result.records ),
                        wrapper = {items: result},
                        populate = Handlebars.compile( template.warn );
                    $list.prepend( populate( wrapper ) ).trigger( 'x-height-change' );
                }
            },
            widget: function ( data ) {
                if ( data.success && data.result.records.length ) {
                    var result = app.parse.widget( data.result.records ),
                        wrapper = {items: result},
                        populate = Handlebars.compile( template.widget );
                    $widget.append( populate( wrapper ) ).trigger( 'x-height-change' );
                }
            }
        },
        data: {
            online: function () {
                var query = null,
                    filter = app.get.filter(),
                    params = app.get.params(),
                    order = app.get.order(),
                    relevance = app.get.relevance(),
                    relevanceStr = '';
                // Set relevance string
                if( !! relevance && relevance != null ){
                     relevanceStr = ' AND lower( "relevance" ) LIKE lower( \'%' + app.get.relevance() + '%\' )';
                }
                // if the keywords are set, construct a filter OR get everything
                if ( !!app.props.query && app.props.query.contains( 'keywords' ) ) {
                    var keywords = app.props.query.split( 'keywords' ).pop().substr( 1 ).split('&')[0];
                    keywords = app.parse.keywords( keywords );
                    query = 'SELECT * FROM "' + args.resource.id + '"' + ', plainto_tsquery(  \'english\', \'' + keywords + '\'  ) query' + filter + params + ' AND _full_text @@ query' + ' AND ( \"available\"=\'yes\' ) ' + relevanceStr + ' ORDER BY ' + order + ', \"' + args.orderBy + '\"';
                } else {
                    query = 'SELECT * FROM \"' + args.resource.id + '\"' + filter + params + ' AND ( \"available\"=\'yes\' ) ' + relevanceStr + ' ORDER BY ' + order + ', \"' + args.orderBy + '\"';
                }
                // run the data query method
                // qg.data.get( args.resource.url, query, app.show.online );
                // NIM - DEV
                app.get.data( args.resource.url, query, app.show.online );
            },
            offline: function () {
                var filter = app.get.filter(),
                    params = app.get.params(),
                    order = app.get.order(),
                    query = 'SELECT * FROM \"' + args.resource.id + '\"' + filter + params + ' AND ( \"available\"=\'no\' )' + ' ORDER BY ' + order + ', \"' + args.orderBy + '\"';
                // run the data query method
                // qg.data.get( args.resource.url, query, app.show.offline );
                app.get.data( args.resource.url, query, app.show.offline );
            },
            widget: function ( category ) {
                // if the category is set, construct a filter OR get everything
                if ( !!category && !!$widget.length ) {
                    var filter = ' WHERE 1=1',
                        params = app.get.params(),
                        order = app.get.order(),
                        query = 'SELECT * FROM \"' + args.resource.id + '\"' + filter + params + ' AND ( \"category-slug\"=\'' + category + '\' )' + ' ORDER BY ' + order + ', \"' + args.orderBy + '\"';
                    // run the data query method
                    // qg.data.get( args.resource.url, query, app.show.widget );
                    // app.get.data( args.resource.url, query, app.show.widget );
                }
            }
        },
        check: {
            location: function ( value ) {
                return locations.hasOwnProperty( value );
            }
        },
        get: {
            data: function ( domain, query, options ) {
                // set options
                if ( $.isFunction( options )) {
                    options = {
                        successCallback: options,
                        cache: false
                    };
                } else {
                    options = $.extend({ cache: false }, options );
                }
                // set error callback
                var errorCallback = function() {
                    $( document ).status( 'show', {
                        status: 'fail',
                        lightbox: true,
                        title: 'Error loading data',
                        body: '<p>We were unable to retrieve data.</p><p>Please try again later.</p>'
                    });
                };
                // ajax call
                $.ajax({
                    type: 'GET',
                    data: { sql: query },
                    url: 'https://' + domain + '/api/action/datastore_search_sql',
                    contentType: 'application/json; charset=utf-8',
                    crossDomain: true,
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    pageCache: options.cache
                }).done(function ( jqXHR ) {
                    options.successCallback(jqXHR);
                }).fail(function ( jqXHR, textStatus ) {
                    errorCallback();
                });
            },
            page: function () {
                var parts = window.location.toString().split( '#' );
                var location = parts.shift();
                var query = parts.pop();
                app.props.page = location + query.replace( '/', '' );
            },
            types: function () {
                var list = {};
                $( '#type' ).find( 'option' ).each(function ( key, item ) {
                    if ( !!$( item ).val() ) {
                        list[ $( item ).val() ] = $( item ).text();
                    }
                });
                app.props.types = list;
            },
            query: function () {
                if ( !!window.location.hash && window.location.hash.contains( '?' ) ) {
                    app.props.query = window.location.hash.split( '?' ).pop();
                } else {
                    app.props.query = null;
                }
            },
            route: function () {
                if ( !!window.location.hash ) {
                    app.props.route = window.location.hash.split( '?' ).shift().substr( 1 );
                } else {
                    app.props.route = '/';
                }
            },
            order: function () {
                var count = 0,
                    result = '( CASE \"type-slug\"';
                $.each( app.props.types, function ( key, value ) {
                    count++;
                    result += ' WHEN \'' + key + '\' THEN ' + ( count );
                });
                result += ' END )';
                return result;
            },
            filter: function () {
                var query = ' WHERE 1=1';
                if ( !!app.props.query ) {
                    var values = app.props.query.split( '&' );
                    for ( var key in values ) {
                        if ( values.hasOwnProperty( key ) ) {
                            var column = values[ key ].split( '=' ).shift(),
                                value = values[ key ].split( '=' ).pop();
//                            if ( column === 'keywords' ) {
//                                query += ' AND ( \"' + 'query' + '\"=\'' + value + '\' )';
//                            } else {
//                                query += ' AND ( \"' + ( column + '-slug' ) + '\"=\'' + value + '\' )';
//                            }
                            if ( column !== 'keywords' && column !== 'relevance' ) {
                                query += ' AND ( \"' + ( column + '-slug' ) + '\"=\'' + value + '\' )';
                            }
                        }
                    }
                }
                return query;
            },
            params: function () {
                var query = '';
                if ( !!app.props.params ) {
                    var array = [];
                    var values = app.props.params.split( '&' );
                    for ( var key in values ) {
                        if ( values.hasOwnProperty( key ) ) {
                            var column = values[ key ].split( '=' ).shift(),
                                value = values[ key ].split( '=' ).pop();
                            array.push( '( \"' + column + '\"=\'' + value + '\' )' );
                            //query += ' AND ( \"' + column + '\"=\'' + value + '\' )';
                        }
                    }
                    query += ' AND ( ' + array.join( ' OR ' ) + ' )';
                }
                return query;
            },
            location: function () {
                var values = [];
                $.map( locations[ app.props.location ].params, function ( value, key ) {
                    if ( value !== null && key !== 'wide-display' ) {
                        values.push( key + '=' + app.set.truth( value ) );
                    }
                });
                return values.join( '&' );
            },
            relevance: function() {
                if( !! app.props.query && app.props.query.contains( 'relevance' ) ) {
                    var relevance = app.props.query.split( 'relevance=' ).pop().split('&')[0];
                    relevance = ( relevance == null || relevance == 'null' ) ? null: relevance;
                    relevance = relevance.replace('+',' ').toLowerCase();
                    app.props.relevance = relevance;
                    $('#search-filter').html( 'Searching for services related to <em><strong>' + relevance + '</strong></em>. &nbsp; <a href="#">Search all services instead</a>' );
                    $('#search-filter a').on( 'click', function() {
                        app.action.clearRelevance();
                    });
                    return relevance;
                } else {
                    $('#search-filter').html('');
                    return null;
                }
            }
        },
        set: {
            query: function ( value ) {
                // set query
                app.props.query = value.join( '&' );
                // run route
                routie( app.props.route + ( !!app.props.query ? ( '?' + app.props.query ) : '' ) );
            },
            route: function ( value ) {
                // if the value is passed in then route is set
                if ( !!value ) {
                    app.props.route = ( value.contains( '?' ) ) ? value.split( '?' ).shift() : value;
                } else {
                    app.props.route = '/';
                }
            },
            form: function ( value ) {
                var query = null;
                // if the value is passed in and contains search params
                if ( !!value && value.contains( '?' ) ) {
                    query = value.split( '?' ).pop();
                } else {
                    query = window.location.hash.contains( '?' ) && window.location.hash.split( '?' ).pop();
                }
                // then, if we have a query, then set the form
                if ( !!query ) {
                    // loop through each and set form value
                    var values = {};
                    var split = query.split( '&' );
                    $.each( split, function(index, item) {
                        var id = item.split( '=' ).shift();
                        values[ id ] = item.split( '=' ).pop();
                    });
                    // split.map(function ( item ) {
                    //     var id = item.split( '=' ).shift();
                    //     values[ id ] = item.split( '=' ).pop();
                    // });
                    $form.find( '.form-section' ).find( 'input, select' ).each(function () {
                        var id = $( this ).attr( 'id' );
                        if ( values.hasOwnProperty( id ) ) {
                            $( this ).val( values[ id ] );
                        } else {
                            $( this ).val( '' );
                        }
                    });
                } else {
                    $form.find( '.form-section' ).find( 'input, select' ).each(function () {
                        $( this ).val( '' );
                    });
                }
            },
            params: function ( value ) {
                // check if location is valid, then set params
                if ( !!value ) {
                    if ( !!app.check.location( value ) ) {
                        app.props.params = app.get.location();
                    } else {
                        app.show.error( 'This location is unavailable.' );
                        app.props.params = null;
                    }
                } else {
                    app.props.params = null;
                }
            },
            truth: function ( value ) {
                return ( !!value ) ? 'yes' : 'no';
            },
            location: function ( value ) {
                if ( !!value ) {
                    app.props.location = value.split( '?' ).shift();
                } else {
                    app.props.location = 'root';
                }
            },
            kiosk: function ( value ) {
                if ( !!locations.hasOwnProperty( value ) && locations[ value ].params[ 'wide-display' ] ) {
                    app.props.kiosk = !!locations[ value ].params[ 'wide-display' ];
                    $( 'body' ).addClass( 'kiosk' );
                } else {
                    $( 'body' ).removeClass( 'kiosk' );
                }
            },
            toggle: function () {
                $search.find( '.widget-header' ).append( $( '<span class="action"><a href="#" id="services-toggle" class="up">Toggle</a></span>' ) );
                app.event.toggle();
            }
        }
    };

    return app;

}( jQuery, qg.swe ) );
