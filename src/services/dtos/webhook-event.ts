export const EVENT_NAME = {
  CustomerCreated: 'CustomerCreated',
  CustomerDeleted: 'CustomerDeleted',
  OrderPlaced: 'OrderPlaced',
  OrderReturned: 'OrderReturned',
  OrderCanceled: 'OrderCanceled',
} as const;
export type EventName = (typeof EVENT_NAME)[keyof typeof EVENT_NAME];

export const ENTITY_NAME = {
  Customer: 'Customer',
  Order: 'Order',
} as const;
export type EntityName = (typeof ENTITY_NAME)[keyof typeof ENTITY_NAME];

export interface WebhookEvent<TPayload> {
  EventTime: string;
  EventName: EventName;
  EntityName: EntityName;
  Sequence: number;
  Payload: TPayload;
}

export interface CustomerCreatedEvent extends WebhookEvent<{ CustomerId: string }> {}

export interface CustomerDeletedEvent extends WebhookEvent<{ CustomerId: string }> {}

export interface OrderCanceledEvent extends WebhookEvent<{ OrderId: string }> {}

export interface OrderReturnedEvent extends WebhookEvent<{ OrderId: string }> {}

export interface OrderPlacedEvent
  extends WebhookEvent<{ OrderId: string; CustomerId: string; TotalOrderAmount: number }> {}
