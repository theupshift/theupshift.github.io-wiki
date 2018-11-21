function DatabaseNode (id) {
  N.call(this, id);
  this.cache = null;
  this.receive = q => {
    this.cache = this.cache ? this.cache : this.request();
    this.send(this.request(this.cache));
  }
}

function RouterNode (id) {
  N.call(this, id);

  this.receive = q => {
    const tables = this.request('database').database;
    const name = q.toUpperCase();
    const type = this.find(name, tables);
    const result = tables[type] ? tables[type][name] : null;
    this.send({name, type, tables, result});
  }

  this.find = (key, db) => {
    for (let id in db) {
      if (db[id][key]) return id;
    }
    return null;
  }
}

function IndentalNode (id, type) {
  N.call(this, id);
  this.type = type;

  this.answer = q => {
    if (this.cache) return this.cache;

    if (!DB[this.id]) {
      console.warn(`Missing database/${this.id}.tome`);
      return null;
    }

    this.cache = new Indental(DB[this.id]).parse(this.type);
    return this.cache;
  }
}

function DocumentNode (id) {
  N.call(this, id);
  this.receive = ({title}) => {
    document.title = title || 'Unknown';
  }
}

function DomNode (id, ...params) {
  N.call(this, id);
  this.type = params[0] ? params[0] : 'div';
  this.el = Object.assign(document.createElement(this.type), {id});
  this.isInstalled = false;

  if (params[1]) this.el.innerHTML = params[1];

  this.receive = content => {
    if (content && content[this.id] !== null) {
      this.update(content[this.id]);
      this.send(content[this.id]);
    }
  }

  this.answer = () => {
    if (!this.isInstalled) this.install(this.request());
    return this.el;
  }

  this.install = elements => {
    for (let id in elements) this.el.append(elements[id]);
    this.isInstalled = true;
  }

  this.update = content => {
    if (typeof content !== 'string') return;
    this.el.innerHTML = content;
  }
}

function InputNode (id, ...params) {
  DomNode.call(this, id, ...params);
  this.isInstalled = false;
  this.el = Object.assign(document.createElement('input'), {
    id,
    spellcheck: false,
    onkeydown: (e) => {
      if (e.key === 'Enter') this.validate(this.el.value.trim());
    },
    onblur: () => {
      this.el.value = capitalise(this.txt);
    },
    onfocus: () => {
      this.txt = this.el.value;
      Object.assign(this.el, {
        title: 'Search for a page or topic',
        placeholder: 'Search',
        value: ''
      });
    }
  });

  this.validate = value => {
    this.txt = value;
    Q('q').bang(value);
  }

  this.update = content => {
    this.txt = content;
    if (typeof content === 'string') {
      this.el.value = capitalise(content);
    }
  }
}
