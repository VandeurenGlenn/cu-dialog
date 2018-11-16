import define from './../node_modules/backed/src/utils/define.js';
import CSSMixin from './../node_modules/backed/src/mixins/css-mixin.js';
import RenderMixin from './../node_modules/custom-renderer-mixin/src/render-mixin.js';

export default define(class CuDialog extends CSSMixin(RenderMixin(HTMLElement)) {

  static get observedAttributes() {
    return ['text', 'title'];
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'});
    this._ok = this._ok.bind(this);
    this._cancel = this._cancel.bind(this);
  }

  get button() {
    return this.shadowRoot.querySelector('button')
  }

  set text(value) {
    this._text = value;
    this.setAttribute('text', value);
    this.render({ text: value, title: this.title });
  }

  get text() {
    return this._text || '';
  }

  set title(value) {
    this._title = value;
    this.setAttribute('title', value);
    this.render({ title: value, text: this.text });
  }

  get title() {
    return this._title || '';
  }

  qsBtn(name) {
    return this.shadowRoot.querySelector(`.${name}`)
  }

  cleanEventListeners() {
    this.qsBtn('ok').removeEventListener('click', this._ok)
    this.qsBtn('cancel').removeEventListener('click', this._cancel)
  }

  attributeChangedCallback(name, old, value) {
    if (this[name] !== value && value !== old) this[name] = value;
  }

  show() {
    this.qsBtn('ok').addEventListener('click', this._ok)
    this.qsBtn('cancel').addEventListener('click', this._cancel)
    this.classList.add('shown');
  }

  _ok() {
    this.cleanEventListeners();
    this.classList.remove('shown');
    if (this.action) this.action('ok')
  }

  _cancel() {
    this.cleanEventListeners();
    this.classList.remove('shown');
    if (this.action) this.action('cancel')
  }

  get template() {
    return html`
    <style>
      :host {
        mixin(--css-hero)
        transform: translate(-450%, -450%);
        flex-direction: column;
        box-sizing: border-box;
        opacity: 0;
      }
      button {
        border: none;
        background: transparent;
        color: #555;
        user-select: none;
        cursor: pointer;
        min-width: 160px;
        outline: none;
      }
      :host(.shown) {
        transform: translate(-50%, -50%);
        transition: transform ease-in 320ms opacity ease-in 320ms;
        opacity: 1;
      }
      @media (min-width: 321px) {
        :host {
          width: 320px;
        }
      }
      apply(--css-flex)
      apply(--css-flex-2)
      apply(--css-row)
      .row {
        height: 40px;
        padding: 12px;
        box-sizing: border-box;
      }
      strong {
        padding-bottom: 36px;
        font-size: 20px;
        padding: 12px 24px 12px;
        box-sizing: border-box;
      }
      .text-container {
        mixin(--css-column)
        overflow-y: auto;
        border-bottom: 1px solid #eee;
        border-top: 1px solid #eee;
        padding: 12px 24px 24px;
        box-sizing: border-box;
      }
    </style>
    <slot name="title">
      <strong>${'title'}</strong>
    </slot>

    <span class="text-container">
      <slot>
        <span>${'text'}</span>
      </slot>
    </span>

    <span class="flex"></span>
    <span class="row">
      <span class="flex"></span>
      <button class="cancel" title="cancel">cancel</button>
      <span class="flex-2"></span>
      <button class="ok" title="ok">ok</button>
      <span class="flex"></span>
    </span>
    `;
  }
})
