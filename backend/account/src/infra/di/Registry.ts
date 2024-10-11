export default class Registry {
  dependencies: { [name: string]: any };
  static instance: Registry;

  private constructor() {
    this.dependencies = {};
  }

  provide(name: string, dependency: any) {
    this.dependencies[name] = dependency;
  }

  inject(name: string) {
    return this.dependencies[name];
  }

  static getInstance() {
    if (!Registry.instance) {
      Registry.instance = new Registry();
    }

    return Registry.instance;
  }
}

export const inject = (name: string) => (target: any, propertyKey: string) => {
  target[propertyKey] = new Proxy({},
    {
      get(_, p) {
        const dependency = Registry.getInstance().inject(name);
        return dependency[p];
      },
    }
  );
};
