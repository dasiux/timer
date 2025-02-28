import { appendHTML, simpleReplace } from '@squirrel-forge/ui-util';
import { Timer } from './lib/Timer';

const DEBUG = document.body.getAttribute( 'data-debug' ) === 'true' || location.hash === '#debug' ? console : null;

const timers = [
    [ 1742079600, 'cv' ],
    [ 1742482800, 'ka' ],
    [ 1750975200, 'jk' ],
    [ 1756418400, 'dh' ],
    [ 1770595200, 'dj' ],
];

const template = document.getElementById( 'timer' ).innerHTML;
const target = document.querySelector( '[data-timers]' );

for ( let i = 0; i < timers.length; i++ ) {
    appendHTML( target, simpleReplace( template, { timestamp : timers[ i ][ 0 ], label : timers[ i ][ 1 ] } ) );
}

const timerElements = target.querySelectorAll( '[data-timer]' );

for ( let i = 0; i < timerElements.length; i++ ) {
    const timerElement = timerElements[ i ];
    timerElement.addEventListener( 'timer.complete', () => { timerElement.remove(); } );
    new Timer( timerElement, DEBUG );
}
