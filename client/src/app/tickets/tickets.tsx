import styles from './tickets.module.css';
import { ReactNode, useEffect, useState } from 'react';
import { Ticket, User } from '@acme/shared-models';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Button } from '@/components/ui/button';
import {
  ListFilter,
  PlusCircle,
  CircleCheckBig,
  CircleOff,
  LoaderCircle,
} from 'lucide-react';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Badge } from '@/components/ui/badge';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Skeleton } from '@/components/ui/skeleton';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { cn } from '@/lib/utils';
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
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import CreateTicket from '@/components/createTicket';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

enum FilterStatusOptions {
  All,
  Completed,
  Incomplete,
}

export interface TicketParams {
  userId?: number | null;
  ticketId: number | undefined;
  method?: 'PUT' | 'DELETE';
}

export function Tickets() {
  const [filteredTickets, setFilteredTickets] = useState<Ticket[] | null>(null);
  const [filteredStatus, setFilteredStatus] = useState<FilterStatusOptions>(
    FilterStatusOptions.All
  );
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<number>(0);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const goToRouteTicket = (id: number | undefined) =>
    id ? navigate(`/${id}`) : null;
  // Queries
  const tickets = useQuery<Ticket[]>('tickets', async function fetchTickets() {
    const response = await fetch('/api/tickets');
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

  // Mutations
  const mutationTicket = useMutation({
    mutationFn: assignUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient
        .invalidateQueries({ queryKey: ['tickets'] })
        .then(() => setLoading(0));
    },
  });

  const mutationCompleteTicket = useMutation({
    mutationFn: completeTicket,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient
        .invalidateQueries({ queryKey: ['tickets'] })
        .then(() => setLoading(0));
    },
  });

  function assignUser({ ticketId, userId }: TicketParams) {
    setLoading(ticketId ?? 0);
    const url = userId
      ? `/api/tickets/${ticketId}/assign/${userId}`
      : `/api/tickets/${ticketId}/unassign`;
    return fetch(url, {
      method: 'PUT',
    });
  }

  function completeTicket({ ticketId, method }: TicketParams) {
    setLoading(ticketId ?? 0);
    const url = `/api/tickets/${ticketId}/complete`;
    return fetch(url, {
      method: method,
    });
  }

  useEffect(() => {
    if (tickets.data && tickets.data.length > 0) {
      switch (filteredStatus) {
        case FilterStatusOptions.All:
          setFilteredTickets(tickets.data);
          break;
        case FilterStatusOptions.Completed: {
          const completedTickets = tickets.data.filter(
            (ticket: Ticket) => ticket.completed
          );
          setFilteredTickets(completedTickets);
          break;
        }

        case FilterStatusOptions.Incomplete: {
          const inCompletedTickets = tickets.data.filter(
            (ticket: Ticket) => !ticket.completed
          );
          setFilteredTickets(inCompletedTickets);
          break;
        }
      }
    }
  }, [tickets, filteredStatus]);

  const changeFilterStatus = (status: FilterStatusOptions) => {
    if (status === filteredStatus) return;
    setFilteredStatus(status);
  };

  const addTicket = () => {
    setModal(true);
  };

  if (!filteredTickets || users.data?.length === 0) {
    return (
      <div className="flex flex-col space-y-3">
        <div className="space-y-4 pb-4">
          <Skeleton className="h-[32px] w-full" />
        </div>
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                className="cursor-pointer"
                checked={filteredStatus === FilterStatusOptions.All}
                onClick={() => changeFilterStatus(FilterStatusOptions.All)}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="cursor-pointer"
                checked={filteredStatus === FilterStatusOptions.Completed}
                onClick={() =>
                  changeFilterStatus(FilterStatusOptions.Completed)
                }
              >
                Completed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="cursor-pointer"
                checked={filteredStatus === FilterStatusOptions.Incomplete}
                onClick={() =>
                  changeFilterStatus(FilterStatusOptions.Incomplete)
                }
              >
                Incomplete
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="h-8 gap-1" onClick={addTicket}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Ticket
            </span>
          </Button>
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>
            Manage your tickets and view their detail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <CardDescription>No data</CardDescription>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
                      <Button
                        variant="link"
                        onClick={() => goToRouteTicket(t.id)}
                      >
                        {t.description}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Select
                        defaultValue={t.assigneeId?.toString()}
                        onValueChange={(value) => {
                          if (value && t.id) {
                            mutationTicket.mutate({
                              userId:
                                value !== 'unassign' ? Number(value) : null,
                              ticketId: t.id,
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
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          t.completed ? 'bg-green-600' : 'bg-red-600'
                        )}
                      >
                        {t.completed ? 'Completed' : 'Incompleted'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          mutationCompleteTicket.mutate({
                            ticketId: t.id,
                            method: t.completed ? 'DELETE' : 'PUT',
                          })
                        }
                      >
                        {loading === t.id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : t.completed ? (
                          <CircleOff className="h-4 w-4" />
                        ) : (
                          <CircleCheckBig className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle complete ticket</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{filteredTickets.length}</strong> tickets
          </div>
        </CardFooter>
      </Card>
      <CreateTicket
        open={modal}
        onClose={() => {
          setModal(false);
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
        }}
      />
    </>
  );
}

export default Tickets;
