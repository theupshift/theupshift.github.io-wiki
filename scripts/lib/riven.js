function Riven() {
  this.network = {};
}

const PORT_TYPES = {
  default: 'default',
  input: 'input',
  output: 'output',
  request: 'request',
  answer: 'answer'
}

const ROUTE_TYPES = {
  default: 'default',
  request: 'request'
}

// QUERY
function Ø (s, network = RIVEN.network) {
  const id = s.toLowerCase();
  if (id.indexOf(' ') > -1) {
    const split = id.split(' ');
    const nodeID = split[0];
    const portID = split[1];
    return network[nodeID] && network[nodeID].ports[portID] ?
      network[nodeID].ports[portID] : null;
  }
  if (network[id]) return network[id];
  return new Node(id);
}

function Node (id) {
  this.id = id;
  this.ports = {};
  this.parent = null;
  this.children = [];
  this.label = id;

  this.setup = () => {
    const {input, output, answer, request} = PORT_TYPES;
    Object.assign(this.ports, {
      input: new Port(this, 'in', input),
      output: new Port(this, 'out', output),
      answer: new Port(this, 'answer', answer),
      request: new Port(this, 'request', request)
    })
  }

  this.create = (type = Node, ...params) => {
    const node = new type(this.id, ...params);
    node.setup();
    RIVEN.network[node.id] = node;
    return node;
  }

  // Connect
  this.connect = (q, type = ROUTE_TYPES.output) => {
    if (q instanceof Array) {
      for (let i = 0; i < q.length; i++) {
        this.connect(q[i], type);
      }
    } else {
      const {request} = ROUTE_TYPES;
      this.ports[
        type === request ? 'request' : 'output'
      ].connect(
        `${q} ${type === request ? 'answer' : 'input'}`, type
      );
    }
  }

  this.syphon = (q) => {
    this.connect(q, ROUTE_TYPES.request);
  }

  this.bind = (q) => {
    this.connect(q);
    this.syphon(q);
  }

  // Target
  this.signal = (target) => {
    const tar = target.toLowerCase();
    for (let portID in this.ports) {
      const {routes} = this.ports[portID];
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (!route || !route.host || route.host.id !== tar) continue;
        return route.host;
      }
    }
    return null;
  }

  // SEND/RECEIVE
  this.send = (payload) => {
    const {routes} = this.ports.output;
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (!route) continue;
      route.host.receive(payload);
    }
  }

  this.receive = (q) => {
    const port = this.ports.output;
    for (route_id in port.routes) {
      const route = port.routes[route_id];
      if (route) route.host.receive(q);
    }
  }

  this.bang = () => {
    this.send(true);
  }

  // REQUEST/ANSWER
  this.answer = (q) => this.request(q);

  this.request = (q) => {
    let payload = {};

    for (let route_id in this.ports.request.routes) {
      const route = this.ports.request.routes[route_id];
      if (!route) continue;
      const answer = route.host.answer(q);
      if (!answer) continue;
      payload[route.host.id] = answer;
    }

    return payload;
  }
}

function Port (host, id, type = PORT_TYPES.default) {
  this.host = host;
  this.id = id;
  this.type = type;
  this.routes = [];

  this.connect = (b, type = 'transit') => {
    this.routes[this.routes.length] = Ø(b);
  }
}
