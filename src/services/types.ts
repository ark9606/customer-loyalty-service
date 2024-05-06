export const EVENT_NAME = {
  CustomerCreated: 'CustomerCreated',
  CustomerDeleted: 'CustomerDeleted',
  OrderPlaced: 'OrderPlaced',
  OrderReturned: 'OrderReturned',
  OrderCanceled: 'OrderCanceled',
} as const;

export type EventName = (typeof EVENT_NAME)[keyof typeof EVENT_NAME];

export interface WebhookEvent {
  EventTime: string;
  EventName: EventName;
  EntityName: string; // todo add type
  Sequence: number;
  Payload: any; // todo fix
}
