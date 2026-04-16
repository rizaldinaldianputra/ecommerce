'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Search, Filter, Mail, Shield, ShieldCheck, UserCircle, Briefcase, Truck, MessageSquare, Users } from 'lucide-react';
import { UserService, User } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CrudTable } from '@/components/admin/crud-table';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

const TASK_GROUPS = [
  { value: 'ORDER_PROCESSOR', label: 'Order Processor', icon: Briefcase, color: 'text-blue-500' },
  { value: 'SHIPPING', label: 'Shipping & Delivery', icon: Truck, color: 'text-pink-500' },
  { value: 'CUSTOMER_SERVICE', label: 'Customer Service', icon: MessageSquare, color: 'text-emerald-500' },
  { value: 'ADMIN', label: 'Super Admin', icon: ShieldCheck, color: 'text-rose-500' },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  // Edit State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [taskGroup, setTaskGroup] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<{ id: number; name: string }[]>([]);
  const [selectedRoleNames, setSelectedRoleNames] = useState<string[]>([]);

  // Create State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserTaskGroup, setNewUserTaskGroup] = useState('');
  const [newUserRoleNames, setNewUserRoleNames] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await UserService.getAll(0, 50);
      setUsers(res.content || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch users', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted.current) return;
    fetchUsers();
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      await UserService.updateRolesAndGroups(selectedUser.id, { 
        taskGroup, 
        roleNames: selectedUser.roles.map(r => r.name) 
      });
      toast({ title: 'Success', description: 'User permissions updated' });
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.fullName.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())) &&
    !u.roles.some(r => r.name === 'ROLE_USER')
  );

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'fullName',
      header: 'User Profile',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 shrink-0">
            <UserCircle size={20} className="text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px]">
              {row.original.fullName || 'Anonymous'}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
              <Mail className="h-3 w-3" /> {row.original.email}
            </span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'roles',
      header: 'Role & Access',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1.5">
          {row.original.roles.map(role => (
            <Badge key={role.id} variant="secondary" className="rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 border-slate-200">
               {role.name}
            </Badge>
          ))}
        </div>
      )
    },
    {
      accessorKey: 'taskGroup',
      header: 'Task Group',
      cell: ({ row }) => (
        row.original.taskGroup ? (
          <Badge className="bg-pink-100 text-pink-600 border-pink-200 font-bold text-[9px] py-0.5 px-2.5 rounded-full uppercase tracking-widest">
            {row.original.taskGroup}
          </Badge>
        ) : (
          <span className="text-[9px] font-bold text-slate-300 uppercase italic">Unassigned</span>
        )
      )
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.original.isActive
            ? 'bg-pink-100 text-pink-700'
            : 'bg-slate-100 text-slate-700'
          }`}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const handleEdit = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleAdd = () => {
    router.push('/admin/users/new');
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await UserService.update(user.id, { ...user, isActive: !user.isActive });
      toast({ title: 'Success', description: 'User status updated' });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update user status', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-3xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-inner">
             <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Team Management</h1>
            <p className="text-slate-500 text-sm font-bold">Manage administrators, staff, and system roles.</p>
          </div>
      </div>

      <CrudTable 
        data={filteredUsers} 
        columns={columns} 
        searchKey="users"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
      />
    </div>
  );
}
