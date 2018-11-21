const riven = {};

function Q (id, network = riven) {
  if (id.indexOf(' ') > -1) {
    const [node, port] = id.split(' ');
    const n = network[node];
    const p = n.ports[port];
    return n && p ? p : null;
  }
  const n = network[id];
  return n ? n : new N(id);
}

function P (host, type = 'default') {
  Object.assign(this, {host, type, routes: []});
  this.connect = (b, type = 'transit') => {
    this.routes[this.routes.length] = Q(b);
  }
}

function N (id) {
  Object.assign(this, {id, parent: null, children: []});

  this.create = (type, ...params) => {
    const id = this.id;
    const n = new type(id, ...params);
    n.ports = [
      new P(n, 0), // input
      new P(n, 1), // output
      new P(n, 2), // answer
      new P(n, 3)  // request
    ];
    return riven[id] = n;
  }

  this.connect = (q, type = 'default') => {
    if (q instanceof Array) {
      for (let i = 0; i < q.length; i++) {
        this.connect(q[i], type);
      }
    } else {
      const isRequest = type === 3;
      this.ports[isRequest ? 3 : 1].connect(
        `${q} ${isRequest ? 2 : 0}`, type
      );
    }
  }

  this.syphon = q => this.connect(q, 3);

  this.bind = q => {
    this.connect(q);
    this.syphon(q);
  }

  this.signal = target => {
    const {ports} = this;
    for (let i = 0; i < ports.length; i++) {
      const {routes} = ports[i];
      for (let e = 0; e < routes.length; e++) {
        const {host} = routes[e];
        if (host.id !== target) continue;
        return host;
      }
    }
    return null;
  }

  this.send = payload => {
    const {routes} = this.ports[1];
    for (let i = 0; i < routes.length; i++) {
      const r = routes[i];
      if (r) r.host.receive(payload);
    }
  }

  this.answer = q => this.request(q);

  this.request = q => {
    const {routes} = this.ports[3];
    const rl = routes.length;
    if (rl === 0) return {};
    const payload = {};
    for (let i = 0; i < rl; i++) {
      const r = routes[i];
      if (!r) continue;
      const answer = r.host.answer(q);
      if (!answer) continue;
      payload[r.host.id] = answer;
    }
    return payload;
  }
}
