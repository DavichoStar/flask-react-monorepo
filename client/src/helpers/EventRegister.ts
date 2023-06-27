import { AlertContent } from "../models/Global";

/**
 * Añade eventos.
 * @extends ClientEvents
 */
export interface ReactEvents {
  showAlert: [AlertContent];
}

/**
 * Tipos de eventos
 */
export type react_event = keyof ReactEvents;

/**
 * Clase para registrar eventos.
 */
export class EventRegister {
  static listeners: { [id: string]: (...args: any[any]) => void } = {};

  static emit<Event extends react_event>(
    eventName: Event,
    ...data: ReactEvents[Event]
  ) {
    if (EventRegister.listeners[eventName])
      EventRegister.listeners[eventName](...data);
  }

  static on<Event extends react_event>(
    eventName: Event,
    callback: (...args: ReactEvents[Event]) => void
  ) {
    EventRegister.listeners[eventName] = callback;
  }

  static removeListener<Event extends react_event>(eventName: Event) {
    return delete EventRegister.listeners[eventName];
  }

  static removeAllListeners() {
    let removeError = false;

    Object.keys(EventRegister.listeners).forEach((_id) => {
      const removed = delete EventRegister.listeners[_id];
      removeError = !removeError ? !removed : removeError;
    });

    return !removeError;
  }
}
