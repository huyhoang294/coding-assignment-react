import { useParams } from 'react-router-dom';
import styles from './ticket-details.module.css';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Ticket, User } from '@acme/shared-models';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Input } from '@/components/ui/input';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Label } from '@/components/ui/label';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TicketParams } from '../tickets/tickets';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Switch } from '@/components/ui/switch';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Skeleton } from '@/components/ui/skeleton';

/* eslint-disable-next-line */
export interface TicketDetailsProps {}

export function TicketDetails(props: TicketDetailsProps) {
  const { id } = useParams();

  const queryClient = useQueryClient();

  // Queries
  const ticket = useQuery<Ticket>('ticket', async function fetchTicket() {
    const response = await fetch(`/api/tickets/${id}`);
    if (!response.ok) {
      throw new Error('Error');
    }
    return response.json();
  });

  const users = useQuery<User[]>('users', async function fetchUsers() {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Error');
    }
    return response.json();
  });

  const mutationTicket = useMutation({
    mutationFn: assignUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
  });

  const mutationCompleteTicket = useMutation({
    mutationFn: completeTicket,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
  });

  function assignUser({ ticketId, userId }: TicketParams) {
    const url = userId
      ? `/api/tickets/${ticketId}/assign/${userId}`
      : `/api/tickets/${ticketId}/unassign`;
    return fetch(url, {
      method: 'PUT',
    });
  }

  function completeTicket({ ticketId, method }: TicketParams) {
    const url = `/api/tickets/${ticketId}/complete`;
    return fetch(url, {
      method: method,
    });
  }

  if (
    ticket.isPreviousData ||
    ticket.isFetching ||
    !ticket.data ||
    users.isLoading
  )
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </div>
    );

  return (
    <div className={styles['container']}>
      <Card x-chunk="dashboard-07-chunk-0">
        <CardHeader>
          <CardTitle>{ticket.data.description}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Assignee</Label>
              <Select
                value={ticket.data.assigneeId?.toString()}
                onValueChange={(value) => {
                  if (value && ticket.data.id) {
                    mutationTicket.mutate({
                      userId: value !== 'unassign' ? Number(value) : null,
                      ticketId: ticket.data.id,
                    });
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Assignee</SelectLabel>
                    <SelectItem value={'unassign'}>Unassign</SelectItem>
                    {users.data?.map((u) => {
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
              <Label htmlFor="name">Completed</Label>
              <Switch
                checked={ticket.data.completed}
                disabled={mutationCompleteTicket.isLoading}
                onCheckedChange={() =>
                  mutationCompleteTicket.mutate({
                    ticketId: ticket.data.id,
                    method: ticket.data.completed ? 'DELETE' : 'PUT',
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TicketDetails;
