import QWeb from "./qweb_vdom";

// import {init} from "../libs/snabbdom/src/snabbdom"
// import sdProps from "../libs/snabbdom/src/modules/props"
// import sdListeners from "../libs/snabbdom/src/modules/eventlisteners"

// const patch = init([sdProps, sdListeners]);

export interface Env {
  qweb: QWeb;
  services: { [key: string]: any };
  [key: string]: any;
}

export default class Widget {
  name: string = "widget";
  template: string = "<div></div>";

  parent: Widget | null;
  children: Widget[] = [];
  env: Env | null = null;
  el: ChildNode | null = null;
  state: Object = {};
  refs: { [key: string]: Widget } = {};

  //--------------------------------------------------------------------------
  // Lifecycle
  //--------------------------------------------------------------------------

  constructor(parent: Widget | null, props?: any) {
    this.parent = parent;
    if (parent) {
      parent.children.push(this);
      if (parent.env) {
        this.setEnvironment(parent.env);
      }
    }
  }

  async willStart() {}

  mounted() {}

  willUnmount() {}

  destroyed() {}
  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  async mount(target: HTMLElement) {
    await this.willStart();
    this.env!.qweb.addTemplate(this.name, this.template);
    delete this.template;
    await this.render();
    target.appendChild(this.el!);
  }

  destroy() {
    if (this.el) {
      this.el.remove();
    }
  }

  setEnvironment(env: Env) {
    this.env = Object.create(env);
  }

  /**
   * DOCSTRIGN
   *
   * @param {Object} newState
   * @memberof Widget
   */
  async updateState(newState: Object) {
    Object.assign(this.state, newState);
    await this.render();
  }

  //--------------------------------------------------------------------------
  // Private
  //--------------------------------------------------------------------------

  async render() {
    // const vnode = await this.env!.qweb.render(this.name, this);
    // patch(this.el, vnode);
    
    // this._setElement(fragment.firstChild!);
  }

  // private _setElement(el: ChildNode) {
  //   if (this.el) {
  //     this.el.replaceWith(el);
  //   }
  //   this.el = el;
  // }
}