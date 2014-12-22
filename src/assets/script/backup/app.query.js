/* globals jQuery, qg, Placeholders, Handlebars, routie, dataLayer */
/* jshint unused:false, sub:true, expr:true */

qg.swe.services = (function ( $, swe, _dl ) {
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
//            id: 'c361766e-f9d4-490a-817d-5effbdd97ba5',
//            url: 'staging.data.qld.gov.au'
            id: '384429ae-fd27-4448-afe6-e4ecb8d1ad93',
            url: 'data.qld.gov.au'
        }
    };

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
                page: null
            };

            // events
            this.event.submit();
            this.event.reset();
            this.get.types();
//            this.get.route();
            this.get.query();
            this.set.toggle();

            // empty
            app.empty();

            console.log(this.props);
        },
        empty: function () {
            $list.empty();
            $widget.empty();
        },
        event: {
            submit: function () {
                $form.submit(function ( event ) {
                    event.preventDefault();
                    var values = [];
                    $form.find( '.form-section' ).find( 'input, select' ).each(function () {
                        !$( this ).val() || values.push( $( this ).attr( 'id' ) + '=' + $( this ).val().replace( / /g, '+' ) );
                    });
                    app.set.query( values );
                });
            },
            reset: function () {
                $form.find( '.reset' ).bind( 'click', function ( event ) {
                    event.preventDefault();
                    app.get.route();
                    if ( !!window.location.search ) {
                        routie( app.props.route + window.location.search );
                    } else {
                        routie( app.props.route );
                    }
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
                    order = app.get.order();
                // if the keywords are set, construct a filter OR get everything
                if ( !!app.props.query && app.props.query.contains( 'keywords' ) ) {
                    var keywords = app.props.query.split( 'keywords' ).pop().substr( 1 );
                    query = 'SELECT * FROM "' + args.resource.id + '"' + ', plainto_tsquery(  \'english\', \'' + keywords + '\'  ) query' + filter + params + ' AND _full_text @@ query' + ' AND ( \"available\"=\'yes\' )' + ' ORDER BY ' + order + ', \"' + args.orderBy + '\"';
                } else {
                    query = 'SELECT * FROM \"' + args.resource.id + '\"' + filter + params + ' AND ( \"available\"=\'yes\' )' + ' ORDER BY ' + order + ', \"' + args.orderBy + '\"';
                }
                // run the data query method
                qg.data.get( args.resource.url, query, app.show.online );
            },
            offline: function () {
                var filter = app.get.filter(),
                    params = app.get.params(),
                    order = app.get.order(),
                    query = 'SELECT * FROM \"' + args.resource.id + '\"' + filter + params + ' AND ( \"available\"=\'no\' )' + ' ORDER BY ' + order + ', \"' + args.orderBy + '\"';
                // run the data query method
                //qg.data.get( args.resource.url, query, app.show.offline );
            },
            widget: function ( category ) {
                // if the category is set, construct a filter OR get everything
                if ( !!category && !!$widget.length ) {
                    var filter = ' WHERE 1=1',
                        params = app.get.params(),
                        order = app.get.order(),
                        query = 'SELECT * FROM \"' + args.resource.id + '\"' + filter + params + ' AND ( \"category-slug\"=\'' + category + '\' )' + ' ORDER BY ' + order + ', \"' + args.orderBy + '\"';
                    // run the data query method
                    //qg.data.get( args.resource.url, query, app.show.widget );
                }
            }
        },
//        virtual: {
//            push: function () {
//                app.virtual.check();
//                _dl.push({
//                    'event': 'VirtualPageview',
//                    'virtualPageURL': app.props.page,
//                    'virtualPageTitle': locations[ app.props.location ].title
//                });
//                app.virtual.check();
//                console.log( _dl );
//            },
//            remove: function () {
//
//            },
//            check: function () {
//                $.each(  _dl, function( key, item ) {
//                    console.log( key, item );
//                    if ( item.event === 'VirtualPageview' ) {
//                        delete _dl[ key ];
//                    }
//                });
//            }
//        },
        check: {
            location: function ( value ) {
                return locations.hasOwnProperty( value );
            }
        },
        get: {
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
                console.log(window.location);
                if ( window.location.contains( '?' ) ) {
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
                            if ( column !== 'keywords' ) {
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
                    query.split( '&' ).map(function ( item ) {
                        var id = item.split( '=' ).shift();
                        values[ id ] = item.split( '=' ).pop();
                    });
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

}( jQuery, qg.swe, dataLayer ) );