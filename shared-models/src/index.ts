export type User = {
  id: number;
  name: string;
};

export type Ticket = {
  id: number | undefined;
  description: string;
  assigneeId: number | null;
  completed: boolean;
};
