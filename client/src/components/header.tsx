/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Menu, Ticket, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const goToRouteTickets = () => navigate('/');

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Button variant="link">
          <Ticket className="h-6 w-6" />
          <span className="sr-only">Ticketing App</span>
        </Button>
        <Button variant="link" onClick={goToRouteTickets}>
          Tickets
        </Button>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Button variant="link">
              <Ticket className="h-6 w-6" />
              <span className="sr-only">Ticketing App</span>
            </Button>
            <Button variant="link" onClick={goToRouteTickets}>
              Tickets
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
