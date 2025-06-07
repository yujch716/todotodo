import { DropdownMenuItem } from "@/components/ui/dropdown-menu.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { getUser, updateUser } from "@/api/user.ts";
import { useEffect, useRef, useState } from "react";
import { uploadAvatarImage } from "@/api/storage.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Pencil } from "lucide-react";

const UserProfileModal = () => {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const fetchUser = async () => {
      const user = await getUser();
      setName(user?.user_metadata?.name ?? "");
      setAvatarUrl(user?.user_metadata?.picture ?? "");
    };
    fetchUser();
  }, [open]);

  const handleSave = async () => {
    await updateUser({ name, avatar_url: avatarUrl });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const publicUrl = await uploadAvatarImage(file);
    if (publicUrl) {
      setAvatarUrl(publicUrl);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Setting
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="w-full max-w-md sm:mx-auto z-50">
          <DialogHeader>
            <DialogTitle>내 정보 수정</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="relative flex flex-col items-center rounded-lg">
              <Avatar
                className="relative h-20 w-20 rounded-lg overflow-hidden cursor-pointer group"
                onClick={handleAvatarClick}
              >
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="rounded-lg">
                  <img src="/images/avatar/cat.png" alt="fallback" />
                </AvatarFallback>
                <div
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md
                           flex items-center justify-center opacity-0 group-hover:opacity-100
               transition-opacity duration-200"
                  style={{ width: 24, height: 24 }}
                >
                  <Pencil size={16} className="text-gray-600" />
                </div>
              </Avatar>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfileModal;
