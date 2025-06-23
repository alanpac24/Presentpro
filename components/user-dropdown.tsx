"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, LifeBuoy, Crown } from "lucide-react"

interface UserDropdownProps {
  user?: {
    name: string
    email: string
    initials: string
    tier?: string
    avatar?: string | null
  }
  showUpgrade?: boolean
  onLogout?: () => void
}

const defaultUser = {
  name: "John Doe",
  email: "john.doe@company.com",
  initials: "JD",
  tier: "Professional",
  avatar: null,
}

export function UserDropdown({ 
  user = defaultUser, 
  showUpgrade = true,
  onLogout 
}: UserDropdownProps) {
  const router = useRouter()

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      router.push("/signin")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-full">
          <Avatar className="h-12 w-12 border-2 border-transparent hover:border-gray-200">
            <AvatarImage src={user.avatar || "/placeholder-user.svg"} alt={user.name} />
            <AvatarFallback className="bg-gray-900 text-white font-medium text-lg">
              {user.initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-gray-500">{user.email}</p>
            {user.tier && (
              <p className="text-xs leading-none text-gray-500 mt-1">{user.tier} Tier</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")} className="p-2 cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")} className="p-2 cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/help")} className="p-2 cursor-pointer">
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        {showUpgrade && (
          <DropdownMenuItem onClick={() => router.push("/upgrade")} className="p-2 cursor-pointer">
            <Crown className="mr-2 h-4 w-4" />
            <span>Upgrade Plan</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="p-2 cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}