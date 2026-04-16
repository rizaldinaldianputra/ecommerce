'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CrudForm } from '@/components/admin/crud-form';
import { VoucherService } from '@/services/voucher.service';
import { Voucher } from '@/types/voucher';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';

const voucherSchema = z.object({
  code: z.string().min(3, { message: 'Code must be at least 3 characters' }),
  discountAmount: z.coerce.number().min(0),
  minPurchase: z.coerce.number().min(0),
  validUntil: z.string(),
  isActive: z.boolean().default(true),
});

type VoucherFormValues = z.infer<typeof voucherSchema>;

export default function VoucherEditPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isNew = params.id === 'new';

  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema) as any,
    defaultValues: {
      code: '',
      discountAmount: 0,
      minPurchase: 0,
      validUntil: new Date().toISOString().split('T')[0],
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isNew && params.id) {
      const fetchVoucher = async () => {
        try {
          const data = await VoucherService.getById(Number(params.id));
          form.reset({
            code: data.code,
            discountAmount: data.discountAmount,
            minPurchase: data.minPurchase,
            validUntil: data.validUntil ? new Date(data.validUntil).toISOString().split('T')[0] : '',
            isActive: data.isActive,
          });
        } catch (error) {
          toast({ title: 'Error', description: 'Failed to fetch voucher', variant: 'destructive' });
        }
      };
      fetchVoucher();
    }
  }, [isNew, params.id]);

  const onSubmit = async (values: VoucherFormValues) => {
    setIsLoading(true);
    try {
      if (isNew) {
        await VoucherService.create(values as any);
        toast({ title: 'Success', description: 'Voucher created successfully' });
      } else {
        await VoucherService.update(Number(params.id), values as any);
        toast({ title: 'Success', description: 'Voucher updated successfully' });
      }
      router.push('/admin/vouchers');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save voucher', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CrudForm
      title={isNew ? 'New Voucher' : 'Edit Voucher'}
      subtitle={isNew ? 'Create a new discount code' : 'Update voucher details'}
      onSubmit={form.handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold uppercase tracking-tight">Voucher Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ZELIXA2026" className="uppercase font-bold tracking-widest rounded-xl h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold uppercase tracking-tight">Valid Until</FormLabel>
                <FormControl>
                  <Input type="date" className="rounded-xl h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold uppercase tracking-tight">Discount Amount (IDR)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" className="rounded-xl h-12 font-bold" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minPurchase"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold uppercase tracking-tight">Min. Purchase (IDR)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" className="rounded-xl h-12 font-bold" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-2xl border border-white/20 p-4 bg-white/20 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Voucher Status</FormLabel>
                  <p className="text-xs text-slate-500">Enable or disable this discount code</p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </CrudForm>
  );
}
