import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  EllipsisVertical,
  Loader2,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../../ui/button";
import { useAppStore } from "@/stores/useAppStore";
import { getInitials } from "@/lib/initials";
import { logoutAction } from "@/app/(auth)/logout/actions";
import { useTransition } from "react";

export const UserInfo = () => {
  const { isSidebarExpand, currentUser } = useAppStore();

  const [isPending, startTransition] = useTransition();
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  const handleLogout = async () => {
    startTransition(async () => {
      // 1. Bersihkan state user di Zustand In-Memory Store
      setCurrentUser(null);

      // 2. Eksekusi logout di Supabase Auth Server Action
      await logoutAction();
    });
  };

  if (!isSidebarExpand)
    return (
      <DropdownMenu>
        <div className="flex items-center gap-3 bg-accent rounded-lg p-2.5 m-2">
          <DropdownMenuTrigger
            nativeButton={false}
            render={
              <Avatar className="ring ring-foreground ring-offset-2 ring-offset-accent">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {getInitials(currentUser?.name)}
                </AvatarFallback>
              </Avatar>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuItem>
              <User />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Goodbye...
                </>
              ) : (
                <>
                  <LogOut />
                  Log out
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    );

  return (
    <DropdownMenu>
      <div className="flex items-center gap-3 bg-accent rounded-lg p-2.5 m-2">
        <Avatar className="ring ring-foreground ring-offset-2 ring-offset-accent">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium capitalize">{currentUser?.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {currentUser?.role}
          </p>
        </div>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm">
              <EllipsisVertical />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Goodbye...
              </>
            ) : (
              <>
                <LogOut />
                Log out
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};
