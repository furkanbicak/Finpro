import {
    CSSResultGroup,
    html,
    LitElement,
    PropertyValues,
    TemplateResult,
  } from 'lit';
  import { customElement, property } from 'lit/decorators.js';
  import { event, EventDispatcher } from '../../../utilities/event';
  
  import style from './fp-tab.css';
  import type FpTabGroup from '../fp-tab-group';
  
  /**
   * @tag fp-tab
   * @summary Finpro Tab component
   */
  @customElement('fp-tab')
  export default class FpTab extends LitElement {
    static get styles(): CSSResultGroup {
      return [style];
    }
  
    private tabGroup: FpTabGroup | null;
  
    connectedCallback() {
      super.connectedCallback();
  
      this.updateComplete.then(() => {
        this.tabGroup = this.closest<FpTabGroup>('fp-tab-group');
        // FIXME: We need to warn if parent is not tab-group
        this.tabGroup?.registerTab(this);
      });
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      this.tabGroup?.unregisterTab(this);
    }
  
    /**
     * Sets the caption of tab
     */
    @property({ type: String })
    caption: string;
  
    /**
     * Name of the tab that should match `tab-panel`'s `tab` attribute
     */
    @property({ type: String, reflect: true })
    name: string;
  
    /**
     * Set tooltip text. Should be set to display information icon.
     */
    @property({ type: String, attribute: 'help-text', reflect: true })
    helpText: string;
  
    /**
     * Name of the icon which display on the left side of the tab.
     */
    @property({ type: String })
    icon = '';
  
    /**
     * Shows notification dot.
     */
    @property({ type: Boolean, reflect: true })
    notify = false;
  
    /**
     * Sets the content of the badge.
     */
    @property({ type: String })
    badge = '';
  
    /**
     * Set `tab` as selected.
     */
    @property({ type: Boolean, reflect: true })
    selected = false;
  
    /**
     * Set `tab` as disabled.
     */
    @property({ type: Boolean, reflect: true })
    disabled = false;
  
    /**
     * Fires when tab is selected.
     */
    @event('fp-tab-selected') private _onSelect: EventDispatcher<string>;
  
    /**
     * Set tab selected.
     */
    select() {
      this.selected = true;
    }
  
    updated(changedProperties: PropertyValues<this>) {    
      if (changedProperties.has('selected') && this.selected) {
        this._onSelect(this.name);
      }
    }
  
    render(): TemplateResult {
      const title = html` <slot></slot>`;
  
      const helpTooltip = this.helpText
        ? html` <div class="help-container">
            <fp-tooltip>
              <fp-button
                slot="tooltip-trigger"
                icon="info"
                variant="tertiary"
                kind="neutral"
                label="${this.helpText}"
              ></fp-button>
              ${this.helpText}
            </fp-tooltip>
          </div>`
        : null;
  
      const icon = this.icon
        ? html` <div class="icon">
            <fp-icon name="${this.icon}"></fp-icon>
          </div>`
        : null;
  
      const badge = this.badge
        ? html` <div class="badge-container">
            <fp-badge size="small">${this.badge}</fp-badge>
          </div>`
        : null;
  
      const caption = this.caption ? html` <div class="caption">${this.caption}</div>` : null;
  
      return html`
        <button
          ?disabled="${this.disabled}"
          role="tab"
          class="container"
          @click="${() => this.select()}"
        >
          <div class="title-container">
            <div class="title">${icon} ${title} ${badge}</div>
            ${caption}
          </div>
          ${helpTooltip}
        </button>
      `;
    }
  }
  
  declare global {
    interface HTMLElementTagNameMap {
      'fp-tab': FpTab;
    }
  }
  