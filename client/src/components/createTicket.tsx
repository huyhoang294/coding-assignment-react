import { Ticket, User } from '@acme/shared-models';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { useMutation, useQueryClient } from 'react-query';
import { TicketParams } from '@/app/tickets/tickets';

export interface CreateTicketProps {
  users: User[];
  onClose: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

enum InputType {
  description,
  assignee,
  completed,
}

export default function CreateTicket({
  users,
  open,
  onClose,
}: CreateTicketProps) {
  const [ticket, setTicket] = useState<Ticket>({
    id: undefined,
    description: '',
    completed: false,
    assigneeId: null,
  });
  const queryClient = useQueryClient();

  // Mutations
  const mutationCreateTicket = useMutation({
    mutationFn: createTicket,
    onSuccess: (data) => {
      console.log(data.json);
      // mutationAssignUser.mutate({ticketId: data.data.id})
    },
  });

  const mutationAssignUser = useMutation({
    mutationFn: assignUser,
  });

  const mutationCompleteTicket = useMutation({
    mutationFn: completeTicket,
  });

  function createTicket() {
    let url = '/api/tickets';
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: ticket.description }),
    });
  }

  function assignUser({ ticketId, userId }: TicketParams) {
    let url = `/api/tickets/${ticketId}/assign/${userId}`;
    return fetch(url, {
      method: 'PUT',
    });
  }

  function completeTicket({ ticketId, method }: TicketParams) {
    let url = `/api/tickets/${ticketId}/complete`;
    return fetch(url, {
      method: method,
    });
  }

  const onChangeData = (type: InputType, data: string | boolean) => {
    switch (type) {
      case InputType.description:
        setTicket((ticket) => {
          return {
            ...ticket,
            description: typeof data === 'string' ? data : '',
          };
        });
        break;
      case InputType.assignee:
        setTicket((ticket) => {
          return {
            ...ticket,
            assignedId: typeof data === 'string' ? Number(data) : undefined,
          };
        });
        break;
      case InputType.completed:
        setTicket((ticket) => {
          return {
            ...ticket,
            completed: typeof data === 'boolean' ? data : false,
          };
        });
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Ticket</DialogTitle>
          <DialogDescription>Click submit when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Description..."
              className="col-span-3"
              value={ticket.description}
              required
              onChange={(e) =>
                onChangeData(InputType.description, e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Assignee
            </Label>
            <Select
              defaultValue={ticket.assigneeId?.toString()}
              onValueChange={(value) => onChangeData(InputType.assignee, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Assignee</SelectLabel>
                  {users.map((u) => {
                    return (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        {u.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Completed
            </Label>

            <Switch
              checked={ticket.completed}
              onCheckedChange={(checked) => {
                onChangeData(InputType.completed, checked);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => mutationCreateTicket.mutate()}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
