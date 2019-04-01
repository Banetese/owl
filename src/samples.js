const HELLO_WORLD = `const {Component, QWeb} = owl.core;

class HelloWorld extends Component {
  constructor() {
    super(...arguments);
    this.template = "demo.hello";
  }
}

const qweb = new QWeb(TEMPLATES);
const hello = new HelloWorld({qweb}, { name: "World" });
hello.mount(document.body);
`;

const HELLO_WORLD_XML = `<templates>
  <div t-name="demo.hello" class="hello">
    Hello <t t-esc="props.name"/>
  </div>
</templates>`;

const HELLO_WORLD_CSS = `.hello {
    color: darkred;
    font-size: 30px;
}`;

const HELLO_WORLD_ESNEXT = `// This example will not work if your browser does not support ESNext Class Fields
const {Component, QWeb} = owl.core;

class HelloWorld extends Component {
  template = "demo.hello";
}

const qweb = new QWeb(TEMPLATES);
const hello = new HelloWorld({qweb}, { name: "World" });
hello.mount(document.body);`;

const WIDGET_COMPOSITION = `class Counter extends owl.core.Component {
  constructor(parent, props) {
    super(parent, props);
    this.template="counter";
    this.state = {
      value: props.initialState || 0
    };
  }

  increment(delta) {
    this.updateState({ value: this.state.value + delta });
  }
}

class App extends owl.core.Component {
  constructor() {
    super(...arguments);
    this.template="app";
    this.widgets = { Counter };
  }
}

const env = {
  qweb: new owl.core.QWeb(TEMPLATES)
};

const app = new App(env);
app.mount(document.body);
`;

const WIDGET_COMPOSITION_XML = `<templates>
  <div t-name="counter">
    <button t-on-click="increment(-1)">-</button>
    <span style="font-weight:bold">Value: <t t-esc="state.value"/></span>
    <button t-on-click="increment(1)">+</button>
  </div>
  <div t-name="app">
      <t t-widget="Counter" t-props="{initialState: 1}"/>
      <t t-widget="Counter" t-props="{initialState: 42}"/>
  </div>
</templates>`;

const BENCHMARK_APP = `//------------------------------------------------------------------------------
// Generating demo data
//------------------------------------------------------------------------------
const messages = [];
const authors = ["Aaron", "David", "Vincent"];
const content = [
  "Lorem ipsum dolor sit amet",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
  "Excepteur sint occaecat cupidatat non proident"
];

function chooseRandomly(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

for (let i = 1; i < 16000; i++) {
  messages.push({
    id: i,
    author: chooseRandomly(authors),
    msg: \`\${i}: \${chooseRandomly(content)}\`,
    likes: 0
  });
}

//------------------------------------------------------------------------------
// Counter Widget
//------------------------------------------------------------------------------
class Counter extends owl.core.Component {
  constructor(parent, props) {
    super(parent, props);
    this.template = "counter";
    this.state = {
      counter: props.initialState || 0
    };
  }

  increment(delta) {
    this.updateState({ counter: this.state.counter + delta });
  }
}

//------------------------------------------------------------------------------
// Message Widget
//------------------------------------------------------------------------------
class Message extends owl.core.Component {
  constructor() {
    super(...arguments);
    this.template = "message";
    this.widgets = { Counter };
  }

  removeMessage() {
    this.trigger("remove_message", {
      id: this.props.id
    });
  }
}

//------------------------------------------------------------------------------
// Root Widget
//------------------------------------------------------------------------------
class App extends owl.core.Component {
  constructor() {
    super(...arguments);
    this.template = "root";
    this.widgets = { Message };
    this.state = {
      messages: messages.slice(0, 10)
    };
  }

  setMessageCount(n) {
    this.updateState({
      messages: messages.slice(0, n)
    });
  }

  removeMessage(data) {
    const index = messages.findIndex(m => m.id === data.id);
    const n = this.state.messages.length;
    messages.splice(index, 1);
    this.updateState({ messages: messages.slice(0, n - 1) });
  }

  increment(delta) {
    const n = this.state.messages.length + delta;
    this.setMessageCount(n);
  }
}

//------------------------------------------------------------------------------
// Application initialization
//------------------------------------------------------------------------------
const env = {
  qweb: new owl.core.QWeb(TEMPLATES)
};

const app = new App(env);
app.mount(document.body);
`;

const BENCHMARK_APP_CSS = `.main {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: grid;
  grid-template-columns: 220px 1fr;
}

.left-thing {
  background-color: gray;
  padding: 20px;
}

.left-thing button {
  width: 100%;
}

.left-thing .counter span {
  color: white;
}

.left-thing .counter button {
  width: 40px;
}

.right-thing {
  padding: 20px;
  overflow: auto;
}

/* Message widget */
.message .author {
  font-weight: bold;
}

.message {
  width: 400px;
  background-color: lightblue;
  margin: 10px 5px;
  border-radius: 5px;
  padding: 5px;
}`;

const BENCHMARK_APP_XML = `<templates>
  <div t-name="root" class="main">
      <div class="left-thing">
          <div class="counter">
              <button t-on-click="increment(-1)">-</button>
              <span style="font-weight:bold">Value: <t t-esc="state.messages.length"/></span>
              <button t-on-click="increment(1)">+</button>
          </div>
          <button t-on-click="setMessageCount(10)">10 messages</button>
          <button t-on-click="setMessageCount(20)">20 messages</button>
          <button t-on-click="setMessageCount(500)">500 messages</button>
          <button t-on-click="setMessageCount(1000)">1000 messages</button>
          <button t-on-click="setMessageCount(5000)">5000 messages</button>
          <button t-on-click="setMessageCount(15000)">15000 messages</button>
      </div>
      <div class="right-thing">
          <div class="content">
              <t t-foreach="state.messages" t-as="message">
                  <t t-widget="Message" t-att-key="message.id" t-props="message" t-on-remove_message="removeMessage"/>
              </t>
          </div>
      </div>
  </div>

  <div t-name="message" class="message">
    <span class="author"><t t-esc="props.author"/></span>
    <span class="msg"><t t-esc="props.msg"/></span>
    <button class="remove" t-on-click="removeMessage">Remove</button>
    <t t-widget="Counter" t-props="{initialState: props.id}"/>
  </div>

  <div t-name="counter">
    <button t-on-click="increment(-1)">-</button>
    <span style="font-weight:bold">Value: <t t-esc="state.counter"/></span>
    <button t-on-click="increment(1)">+</button>
  </div>

</templates>`;

const STATE_MANAGEMENT = `const { Component, QWeb } = owl.core;
const { Store, connect } = owl.extras;

//------------------------------------------------------------------------------
// Store Definition
//------------------------------------------------------------------------------
const actions = {
  addTodo({ commit }, title) {
    commit("addTodo", title);
  },
  removeTodo({ commit }, id) {
    commit("removeTodo", id);
  },
  toggleTodo({ state, commit }, id) {
    commit("toggleTodo", id);
  },
  clearCompleted({ state, commit }) {
    state.todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        commit("removeTodo", todo.id);
      });
  }
};

const mutations = {
  addTodo(state, title) {
    const id = state.nextId++;
    const todo = { id, title, completed: false };
    state.todos.push(todo);
  },
  removeTodo(state, id) {
    const index = state.todos.findIndex(t => t.id === id);
    state.todos.splice(index, 1);
  },
  toggleTodo(state, id) {
    const todo = state.todos.find(t => t.id === id);
    todo.completed = !todo.completed;
  }
};

const state = { todos: [], nextId: 1 };

//------------------------------------------------------------------------------
// TodoList root widget
//------------------------------------------------------------------------------
class TodoList extends Component {
  constructor() {
    super(...arguments);
    this.template = "todoapp";
  }
  addTodo(ev) {
    if (ev.keyCode === 13) {
      const title = ev.target.value;
      if (title.trim()) {
        this.env.store.dispatch("addTodo", title);
      }
      ev.target.value = "";
    }
  }
  toggleTodo(todo) {
    this.env.store.dispatch("toggleTodo", todo.id);
  }
  removeTodo(todo) {
    this.env.store.dispatch("removeTodo", todo.id);
  }
}

function mapStateToProps(state) {
  return { todos: state.todos };
}

const App = connect(mapStateToProps)(TodoList);

//------------------------------------------------------------------------------
// App Initialization
//------------------------------------------------------------------------------
const store = new Store({ state, actions, mutations });
const qweb = new QWeb(TEMPLATES);
const env = {
  qweb,
  store
};
const app = new App(env);
app.mount(document.body);
`;

const STATE_MANAGEMENT_XML = `<templates>
  <div t-name="todoapp">
    <input autofocus="true" placeholder="What needs to be done?" t-on-keyup="addTodo"/>
    <ul>
        <li class="todo" t-foreach="props.todos" t-as="todo">
            <span t-att-class="{completed: todo.completed}"><t t-esc="todo.id"/>. <t t-esc="todo.title"/></span>
            <span class="action" t-on-click="toggleTodo(todo)">(toggle)</span>
            <span class="action" t-on-click="removeTodo(todo)">(remove)</span>
        </li>
    </ul>
  </div>
</templates>
`;

const STATE_MANAGEMENT_CSS = `.action {
    cursor: pointer;
    margin: 0 5px;
}

.completed {
    text-decoration: line-through;
}
`;

const EMPTY = ``;

export const SAMPLES = [
  {
    description: "Hello World",
    code: HELLO_WORLD,
    xml: HELLO_WORLD_XML,
    css: HELLO_WORLD_CSS
  },
  {
    description: "Hello World (ESNext)",
    code: HELLO_WORLD_ESNEXT,
    xml: HELLO_WORLD_XML,
    css: HELLO_WORLD_CSS
  },
  {
    description: "Widget Composition",
    code: WIDGET_COMPOSITION,
    xml: WIDGET_COMPOSITION_XML
  },
  {
    description: "Benchmark application",
    code: BENCHMARK_APP,
    css: BENCHMARK_APP_CSS,
    xml: BENCHMARK_APP_XML
  },
  {
    description: "State management app",
    code: STATE_MANAGEMENT,
    css: STATE_MANAGEMENT_CSS,
    xml: STATE_MANAGEMENT_XML
  },
  {
    description: "Empty",
    code: EMPTY
  }
];
