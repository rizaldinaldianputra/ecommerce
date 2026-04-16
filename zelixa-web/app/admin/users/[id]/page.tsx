'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { CrudForm } from '@/components/admin/crud-form';
import { UserService, User } from '@/services/user.service';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Truck, MessageSquare, ShieldCheck, UserCircle, Mail, Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

const TASK_GROUPS = [
  { value: 'ORDER_PROCESSOR', label: 'Order Processor', icon: Briefcase, color: 'text-blue-500' },
  { value: 'SHIPPING', label: 'Shipping & Delivery', icon: Truck, color: 'text-pink-500' },
  { value: 'CUSTOMER_SERVICE', label: 'Customer Service', icon: MessageSquare, color: 'text-emerald-500' },
  { value: 'ADMIN', label: 'Super Admin', icon: ShieldCheck, color: 'text-rose-500' },
];

const userSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  taskGroup: z.string().optional(),
  roleNames: z.array(z.string()).default(['ROLE_USER']),
});

type UserFormValues = z.infer<typeof userSchema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserEditPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<{ id: number; name: string }[]>([]);
  const isNew = id === 'new';

  const form = useForm<any>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      taskGroup: '',
      roleNames: ['ROLE_USER'],
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const roles = await UserService.getAllRoles();
        setAvailableRoles(roles);

        if (!isNew) {
          const data = await UserService.getById(id);
          form.reset({
            fullName: data.fullName,
            email: data.email,
            taskGroup: data.taskGroup || '',
            roleNames: data.roles.map((r: any) => r.name),
          });
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load user data', variant: 'destructive' });
      }
    };
    loadData();
  }, [id, isNew]);

  const onSubmit = async (values: UserFormValues) => {
    setIsLoading(true);
    try {
      if (isNew) {
        if (!values.password) {
          toast({ title: 'Error', description: 'Password is required for new users', variant: 'destructive' });
          setIsLoading(false);
          return;
        }
        await UserService.create(values as any);
        toast({ title: 'Success', description: 'Team member created' });
      } else {
        // For updates, we use the specialized endpoint
        await UserService.updateRolesAndGroups(Number(id), {
          taskGroup: values.taskGroup || '',
          roleNames: values.roleNames
        });
        toast({ title: 'Success', description: 'User updated' });
      }
      router.push('/admin/users');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save team member', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CrudForm
      title={isNew ? 'New Team Member' : 'Edit Team Member'}
      onSubmit={form.handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <Form {...form}>
        <div className="max-w-4xl space-y-8">
          {/* Identity Section */}
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="h-10 w-10 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                  <UserCircle size={24} />
               </div>
               <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white">Identity & Access</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500 font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 flex gap-2 items-center">
                      <Mail size={10} /> Email Address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500 font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isNew && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 flex gap-2 items-center">
                      <Lock size={10} /> Temporary Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500 font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Role & Department Section */}
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="h-10 w-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <Briefcase size={24} />
               </div>
               <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white">Department </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="taskGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Task Group / Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500 font-bold">
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl">
                        {TASK_GROUPS.map((group) => (
                          <SelectItem key={group.value} value={group.value} className="py-3 rounded-xl focus:bg-pink-50">
                            <div className="flex items-center gap-2">
                              <group.icon className={`h-4 w-4 ${group.color}`} />
                              <span className="font-bold text-sm">{group.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 px-1">
                 <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Roles</Label>
                 <div className="flex flex-wrap gap-2">
                    {availableRoles.map(role => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          const current = form.getValues('roleNames');
                          if (current.includes(role.name)) {
                            form.setValue('roleNames', current.filter((r: string) => r !== role.name));
                          } else {
                            form.setValue('roleNames', [...current, role.name]);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight transition-all border ${
                          form.watch('roleNames').includes(role.name)
                            ? 'bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-200'
                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {role.name}
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </CrudForm>
  );
}
