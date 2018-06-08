import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/kwc-style/typography.js';
import '@kano/kwc-style/color.js';
import '@kano/kwc-icons/kwc-icons.js';
import '@kano/web-components/kano-icons/parts.js';
import '@kano/code/app/elements/kano-app-player/kano-app-player.js';
import './elements/kwc-code-display.js';
import './highlight-theme/app.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
`kwc-app-player`
Player UI component for kano code shares.

@demo demo/index-app.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                height: 100%;
            }

            :host * {
                box-sizing: border-box;
            }

            :host(:not([loaded])) kano-app-player {
                opacity: 0;
            }

            .app {
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
                height: 100%;
                position: relative;
            }

            kano-app-player:not(.fullscreen) {
                @apply --layout-flex;
                transition: opacity 200ms linear;
                width: 100%;
            }

        </style>
        <div class="app">
            <kano-app-player id="player" src="[[_appUrl]]" slug="[[_slug]]" on-app-ready="_onAppReady" show-toolbar="" layout="vertical"></kano-app-player>
        </div>

        <template is="dom-if" if="[[displayCode]]">
            <kwc-code-display code="[[_mdCode]]" lines="[[_lines]]" code-type="Javascript" on-hide-code="_hideCode"></kwc-code-display>
        </template>
`,

  is: 'kwc-app-player',

  properties: {
      /**
       * The code that creates this share.
       * @type {String}
       */
      _code: {
          type: String,
          value: null
      },
      /**
       * Flag to indicate whether the code display element is visible.
       * @type {Boolean}
       */
      displayCode: {
          type: Boolean,
          value: false
      },
      /**
       * Boolean flag to indicate whether the app has loaded
       * @type {Boolean}
       */
      loaded: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
      },
      /**
       * An array of line numbers for rendering the code display.
       * @type {Array}
       */
      _lines: {
          type: Array,
          computed: '_computeLines(_mdCode)'
      },
      /**
       * The markdown version of the share code to display in the
       * code display element.
       * @type {String}
       */
      _mdCode: {
          type: String,
          value: null
      },
      _slug: {
          type: String,
          value: null
      },
      _appUrl: {
          type: String,
          value: null
      },
      mode: {
          type: String,
          value: 'app'
      },
      /**
       * The current share to be played.
       * @type {Object}
       */
      share: {
          type: Object,
          observer: '_shareChanged'
      }
  },

  /** OBSERVERS **/
  /**
   * Computed the number of lines in the share's code and
   * populated an array with the list of numbers.
   * @param {String} mdCode Markdown string of share code
   * @return{Array} List of numbers.
   */
  _computeLines(mdCode) {
      if (!mdCode) {
          return [];
      }
      let newLines = mdCode.match(/\n(?!$)/g),
      lineCount = newLines ? newLines.length : 1
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
   * @param {Object} share Current share data
   */
  _shareChanged(share) {
      /**
       * If this component is being used to load a series of shares
       * in order, and there currently isn't any share data, then we
       * need to reset the `loaded` status back to `false` to hide the
       * app player.
       */
      if (!share) {
          return this.loaded = false;
      }
      let attachment = this.share.attachment_url,
          workspaceInfo = this.share.workspace_info_url;
      if (attachment) {
          this._slug = this.share.slug;
          this._appUrl = attachment;
      }
      if (workspaceInfo) {
          fetch(workspaceInfo)
              .then(r => r.json())
              .then(r => {
                  if (r.code && r.code.snapshot) {
                      let code = r.code.snapshot.javascript;
                      this.set('_code', code);
                      this.set('_mdCode', '```javascript\n' + code + '\n```');
                  }
              });
      }
  },

  /** EVENT HANDLERS**/
  /**
   * Proxy the hide code event from the code display element.
   *
   * @event hide-code
   */
  _hideCode() {
     this.fire('hide-code');
 },

  /**
   * Toggle the loaded property in order to show the app player.
   */
  _onAppReady() {
      this.loaded = true;
  }
});
