/**
`kwc-art-player`
Player UI component for make art shares.

@demo demo/index-art.html
*/
/*
FIXME(polymer-modulizer): the above comments were extracted
from HTML and may be out of place here. Review them and
then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/kwc-style/typography.js';
import '@kano/kwc-style/color.js';
import '@kano/kwc-icons/kwc-icons.js';
import './elements/kwc-code-display.js';
import './highlight-theme/art.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
_template: html`
    <style>
        :host * {
            box-sizing: border-box;
        }
        .player {
            @apply --layout-vertical;
            @apply --layout-center;
            @apply --layout-center-justified;
            height: 100%;
            position: relative;
        }
        iron-image {
            @apply --layout-vertical;
            @apply --layout-center;
            height: 100%;
            width: 100%;
        }
    </style>
    <div class="player">
        <iron-image id="image" src="[[share.cover_url]]" sizing="contain" preload="" fade="">
                    </iron-image>
    </div>
    <template is="dom-if" if="[[displayCode]]">
            <kwc-code-display code="[[_mdCode]]" lines="[[_lines]]" code-type="[[_computeCodeType(share.app)]]" on-hide-code="_hideCode">
                                </kwc-code-display>
    </template>
`,

is:'kwc-art-player',

properties: {
    /**
     * The code that creates this share.
     */
    _code: {
        type: String,
        value: null
    },
    /**
     * Flag to indicate whether the code display element is visible.
     */
    displayCode: {
        type: Boolean,
        value: false,
        notify: true
    },
    /**
     * An array of line numbers for rendering the code display.
     */
    _lines: {
        type: Array,
        computed: '_computeLines(_mdCode)'
    },
    /**
     * The markdown version of the share code to display in the 
     * code display element.
     */
    _mdCode: {
        type: String,
        value: null
    },
    /**
     * The current share to be played.
     */
    share: {
        type: Object,
        value: () => {
            return {};
        }
    }
},

observers: [
    '_shareChanged(share.*)'
],

/** OBSERVERS **/
/**
 * Computed the number of lines in the share's code and
 * populated an array with the list of numbers.
 */
_computeLines (mdCode) {
    if (!mdCode) {
        return [];
    }
    let newLines = mdCode.match(/\n(?!$)/g),
        lineCount = newLines ? newLines.length : 1;
    const lines = [];
    /* Don't include the header */
    for (let i = 1; i < lineCount; i++) {
        lines.push(i);
    }
    return lines;
},

/**
 * Load any code from storage and compute the markdown for 
 * display in the display code element.
 */
_shareChanged () {
    if (!this.share){return;}
    let attachment = this.share.attachment_url;
    if (attachment) {
        fetch(attachment)
            .then(r => r.text())
            .then(code => {
                this._code = code;
                this._mdCode = '```coffeescript\n' + code + '\n```';
            });
    }
},

_computeCodeType (app) {
    if (app === 'make-light') {
        return 'Python';
    } else {
        return 'CoffeeScript';
    }
},

/** EVENT HANDLERS**/
/**
 * Set the property responsible for displaying and hiding the 
 * display code element.
 */
_hideCode () {
    this.set('displayCode', false);
    this.dispatchEvent(new CustomEvent('hide-code'));
}
});
