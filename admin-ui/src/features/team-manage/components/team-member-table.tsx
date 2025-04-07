import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EditRoleModal } from "./edit-role-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronDown, Loader2 } from "lucide-react";
import { TeamMember } from "../lib/types";
import { useAuth } from "@/context/AuthContext";

type TeamMemberTableProps = {
  members: TeamMember[];
  onEditRole: (id: string, newRole: "owner" | "moderator") => Promise<void>;
  onRemoveMember: (id: string) => Promise<void>;
  isLoading: boolean;
};

export function TeamMemberTable({
  members,
  onEditRole,
  onRemoveMember,
  isLoading,
}: Readonly<TeamMemberTableProps>) {
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(
    new Set(["owner", "moderator"])
  );
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const { userProfile } = useAuth();

  const isMe = (email: string) => {
    return email === userProfile?.email;
  };

  const isMeOwner = () => {
    return members.find((member) => isMe(member.user.email))?.role === "owner";
  };

  const toggleRole = (role: string) => {
    const newSelectedRoles = new Set(selectedRoles);
    if (newSelectedRoles.has(role)) {
      newSelectedRoles.delete(role);
    } else {
      newSelectedRoles.add(role);
    }
    setSelectedRoles(newSelectedRoles);
  };

  const filteredMembers = members.filter((member) =>
    selectedRoles.has(member.role)
  );

  const handleRemove = (member: TeamMember) => {
    setMemberToRemove(member);
  };

  const confirmRemove = async () => {
    setIsRemoving(true);
    if (memberToRemove) {
      await onRemoveMember(memberToRemove.user.id);
    }
    setMemberToRemove(null);
    setIsRemoving(false);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Members</TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <span>Role</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuCheckboxItem
                      checked={selectedRoles.has("owner")}
                      onCheckedChange={() => toggleRole("owner")}
                    >
                      Owner
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedRoles.has("moderator")}
                      onCheckedChange={() => toggleRole("moderator")}
                    >
                      Moderator
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            {/* this column is to fill the remaining space */}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => {
            const { id, name, picUrl, email } = member.user;
            return (
              <TableRow key={id}>
                <TableCell className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={picUrl} alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-gray-500">{email}</div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  {member.role}
                  {isMe(email) && (
                    <span className="ml-2 text-sm font-light text-gray-500">
                      {"(You)"}
                    </span>
                  )}
                </TableCell>
                {isMeOwner() || isMe(email) ? (
                  <TableCell className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setEditingMember(member)}
                    >
                      Edit
                    </Button>
                    <button
                      className="border-transparent text-red-500 hover:text-red-600 bg-transparent hover:bg-transparent"
                      onClick={() => handleRemove(member)}
                    >
                      {isMe(email) ? "Leave" : "Remove"}
                    </button>
                  </TableCell>
                ) : (
                  <TableCell></TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          Loading...
        </div>
      )}
      {editingMember && (
        <EditRoleModal
          isOpen={!!editingMember}
          onClose={() => setEditingMember(null)}
          member={editingMember}
          onEditRole={onEditRole}
        />
      )}
      <AlertDialog open={!!memberToRemove}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-lg font-semibold">
              Are you sure?
            </AlertDialogTitle>
            {isMe(memberToRemove?.user.email ?? "") ? (
              <AlertDialogDescription className="text-base">
                This will remove you from the team
                <p className="mt-1 text-sm font-light italic text-muted-foreground">
                  (This action cannot be undone.)
                </p>
              </AlertDialogDescription>
            ) : (
              <AlertDialogDescription className="text-base">
                This will remove{" "}
                <span className="font-medium text-foreground">
                  {memberToRemove?.user.name}
                </span>{" "}
                from the team
                <p className="mt-1 text-sm font-light italic text-muted-foreground">
                  (This action cannot be undone.)
                </p>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel
              className="w-full sm:w-auto"
              onClick={() => setMemberToRemove(null)}
            >
              {"Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="w-full bg-destructive hover:bg-destructive/90 sm:w-auto"
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default TeamMemberTable;
