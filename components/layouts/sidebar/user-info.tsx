import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  EllipsisVertical,
  KeyRound,
  Loader2,
  LogOut,
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
import { useState, useTransition } from "react";
import { ChangePasswordDialog } from "@/components/profile/change-password-dialog";

export const UserInfo = () => {
  const { isSidebarExpand, currentUser } = useAppStore();

  const [isPending, startTransition] = useTransition();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  const handleLogout = async () => {
    startTransition(async () => {
      // 1. Bersihkan state user di Zustand In-Memory Store
      setCurrentUser(null);

      // 2. Eksekusi logout di Supabase Auth Server Action
      await logoutAction();
    });
  };

  return (
    <>
      <DropdownMenu>
        <div className="flex items-center gap-3 bg-accent rounded-lg p-2.5 m-2">
          {!isSidebarExpand ? (
            <DropdownMenuTrigger
              nativeButton={false}
              render={
                <Avatar className="ring ring-foreground ring-offset-2 ring-offset-accent cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {getInitials(currentUser?.name)}
                  </AvatarFallback>
                </Avatar>
              }
            />
          ) : (
            <>
              <Avatar className="ring ring-foreground ring-offset-2 ring-offset-accent">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {getInitials(currentUser?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium capitalize truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {currentUser?.role}
                </p>
              </div>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="cursor-pointer">
                    <EllipsisVertical />
                  </Button>
                }
              />
            </>
          )}

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => setIsChangePasswordOpen(true)}
              className="cursor-pointer"
            >
              <KeyRound className="size-4" />
              Ubah Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Goodbye...
                </>
              ) : (
                <>
                  <LogOut className="size-4" />
                  Log out
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>

      {/* Modal Ubah Password Akun Sendiri */}
      <ChangePasswordDialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </>
  );
};
