import { Bell } from "lucide-react"
import * as Avatar from "@radix-ui/react-avatar";

const UserHeader = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white">
      <Bell className="h-5 w-5 text-amber-500" />
      <div className="text-center">
        <h2 className="text-base font-medium">Jorge Daniel</h2>
        <p className="text-sm text-muted-foreground">Figueredo Amarilla</p>
      </div>
      <Avatar.Root className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500">
        <Avatar.Fallback className="text-amber-50 font-medium">JD</Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
};

export default UserHeader;