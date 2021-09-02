import { Express } from 'express';
import { authorize } from '../middlewares/authorization';

export function Get(route: string) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.route = route;
    descriptor.value.method = 'get';
  };
}

export function Post(route: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.route = route;
    descriptor.value.method = 'post';
  };
}

export function Put(route: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.route = route;
    descriptor.value.method = 'put';
  };
}

export function Delete(route: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.route = route;
    descriptor.value.method = 'delete';
  };
}

export function Authorize() {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.authorizable = true;
  };
}

export function registerControllers(app: Express, controllers: any[]) {
  for (const controller of controllers) {
    const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(controller));

    for (const classFunction of functions) {
      const { route, method, authorizable } = controller[classFunction];

      if (route && method) {
        if (authorizable) {
          app[method](route, authorize, (req, res) => controller[classFunction](req, res));
        } else {
          app[method](route, (req, res) => controller[classFunction](req, res));
        }
      }
    }
  }
}
