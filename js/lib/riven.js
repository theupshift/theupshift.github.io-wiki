function Riven() {
  this.network = {};
}

// QUERY
function Ø (id, {network} = RIVEN) {
  if (id.indexOf(' ') > -1) {
    const [node, port] = id.split(' ');
    return network[node] && network[node].ports[port] ?
      network[node].ports[port] : null;
  }
  const n = network[id];
  return n ? n : new Node(id);
}

function Node (id) {
  Object.assign(this, {
    id, ports: {}, parent: null, children: []
  });

  this.setup = () => {
    Object.assign(this.ports, {
      input: new Port(this, 'in', 'input'),
      output: new Port(this, 'out', 'output'),
      answer: new Port(this, 'answer', 'answer'),
      request: new Port(this, 'request', 'request')
    });
  }

  this.create = (type = Node, ...params) => {
    const node = new type(this.id, ...params);
    node.setup();
    RIVEN.network[node.id] = node;
    return node;
  }

  this.connect = (q, type = 'default') => {
    if (q instanceof Array) {
      for (let i = 0; i < q.length; i++) {
        this.connect(q[i], type);
      }
    } else {
      const isRequest = type === 'request';
      this.ports[isRequest ? 'request' : 'output'].connect(
        `${q} ${isRequest ? 'answer' : 'input'}`, type
      );
    }
  }

  this.syphon = (q) => this.connect(q, 'request');

  this.bind = (q) => {
    this.connect(q);
    this.syphon(q);
  }

  this.signal = (target) => {
    const tar = target;
    const {ports} = this;
    for (let portID in ports) {
      const {routes} = ports[portID];
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (!route || !route.host || route.host.id !== tar) continue;
        return route.host;
      }
    }
    return null;
  }

  this.send = (payload) => {
    const {routes} = this.ports.output;
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route) route.host.receive(payload);
    }
  }

  this.receive = (q) => {
    const {routes} = this.ports.output;
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route) route.host.receive(q);
    }
  }

  this.bang = () => this.send(true);

  this.answer = (q) => this.request(q);

  this.request = (q) => {
    let payload = {};
    const {routes} = this.ports.request;

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (!route) continue;
      const answer = route.host.answer(q);
      if (!answer) continue;
      payload[route.host.id] = answer;
    }

    return payload;
  }
}

function Port (host, id, type = 'default') {
  Object.assign(this, {host, id, type, routes: []});
  this.connect = (b, type = 'transit') => {
    this.routes[this.routes.length] = Ø(b);
  }
}
