/**
 * Requires
 */
import { EventDispatcher, isEmpty } from '@squirrel-forge/ui-util';

/**
 * Create a timer view
 */
export class Timer extends EventDispatcher {

    autoplay = true;

    defaultTemplate = '__D__d __H__h __M__:__S__';

    template = null;

    nodes;

    #interval = null;

    constructor( element, debug ) {
        super( element, null, debug );
        this.initialize();
    }

    initialize() {
        this.template = this.target.getAttribute( 'data-timer-template' );
        if ( typeof this.template === 'string' && this.template.toLowerCase() === 'default' ) {
            this.template = this.defaultTemplate;
        }
        if ( isEmpty( this.template ) ) this.template = null;
        this.nodes = this.getNodesData();
        this.zero = parseInt( this.target.getAttribute( 'data-timer' ) || '0', 10 ) * 1000;
        if ( this.zero <= new Date().getTime() ) {
            this.dispatchEvent( 'timer.complete', { instant : true, from : this.zero } );
        }
        if ( this.autoplay ) this.play();
    }

    getNodesData() {
        const data = [];
        const nodes = this.target.querySelectorAll( '[data-timer-value]' );
        for ( let i = 0; i < nodes.length; i++ ) {
            const node = nodes[ i ];
            const value = node.getAttribute( 'data-timer-value' );
            if ( !isEmpty( value ) ) data.push( { value, node } );
        }
        return data;
    }

    play() {
        if ( this.debug ) this.debug.log( this.constructor.name + '::play()' );
        this.#interval = setInterval( () => {
            const now = new Date().getTime();
            const distance = this.zero - now;

            let days = Math.floor( distance / ( 1000 * 60 * 60 * 24 ) );
            if ( days < 0 ) days = 0;
            let hours = Math.floor(  distance % (  1000 * 60 * 60 * 24  ) / ( 1000 * 60 * 60 )  );
            if ( hours < 0 ) hours = 0;
            let minutes = Math.floor(  distance % (  1000 * 60 * 60  ) / ( 1000 * 60 )  );
            if ( minutes < 0 ) minutes = 0;
            let seconds = Math.floor(  distance % (  1000 * 60  ) / 1000  );
            if ( seconds < 0 ) seconds = 0;

            const data = {
                D : this.constructor._leadingZero( days ),
                d : days,
                H : this.constructor._leadingZero( hours ),
                h : hours,
                M : this.constructor._leadingZero( minutes ),
                m : minutes,
                S : this.constructor._leadingZero( seconds ),
                s : seconds,
            };

            if ( this.template ) {
                this.target.innerHTML = this.constructor._replace( data, this.template );
            }
            for ( let i = 0; i < this.nodes.length; i++ ) {
                this.nodes[ i ].node.innerText = data[ this.nodes[ i ].value ];
                this.nodes[ i ].node.setAttribute( 'data-timer-display', data[ this.nodes[ i ].value ] );
            }

            if ( distance < 0 ) {
                window.clearInterval( this.#interval );
                this.dispatchEvent( 'timer.complete', { instant : false, from : this.zero } );
            }
        }, 1000 );
    }

    stop() {
        if ( this.debug ) this.debug.log( this.constructor.name + '::stop()' );
        window.clearInterval( this.#interval );
    }

    static _leadingZero( num, len ) {
        len = len || 2;
        let v = '' + num;
        while ( v.length < len ) {
            v = '0' + v;
        }
        return v;
    }

    static _replace( vars, tmpl ) {
        let regex, name;
        for ( name in vars ) {
            if ( Object.prototype.hasOwnProperty.call( vars, name ) && typeof vars[ name ] !== 'function' ) {
                regex = new RegExp( '__' + name + '__', 'g' );
                tmpl = tmpl.replace( regex, vars[ name ] );
            }
        }
        return tmpl;
    }

}
