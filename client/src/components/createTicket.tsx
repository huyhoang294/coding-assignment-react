import { User } from '@acme/shared-models';
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
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

export interface CreateTicketProps {
  onClose: () => void;
  open: boolean;
}

export default function CreateTicket({ open, onClose }: CreateTicketProps) {
  const [description, setDescription] = useState<string>('');
  const queryClient = useQueryClient();

  // Mutations
  const mutationCreateTicket = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setDescription('');
      onClose();
    },
  });

  function createTicket() {
    const url = '/api/tickets';
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: description }),
    });
  }

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
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
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
