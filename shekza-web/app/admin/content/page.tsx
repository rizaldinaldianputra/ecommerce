'use client';

import { useEffect, useState } from 'react';
import { LayoutTemplate, Plus, Trash2, Image as ImageIcon, Link as LinkIcon, Package, PlusCircle } from 'lucide-react';
import { ContentService, ContentSection, ContentItem } from '@/services/content.service';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';
import { CrudTable } from '@/components/admin/crud-table';
import { ColumnDef } from '@tanstack/react-table';

export default function ContentManagerPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'CAROUSEL' | 'GRID' | 'BANNER' | 'NEWS'>('CAROUSEL');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [items, setItems] = useState<ContentItem[]>([]);

  // Product Picker
  const [isProductPickerOpen, setIsProductPickerOpen] = useState<number | null>(null);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const data = await ContentService.getAll();
      setSections(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch sections', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await ProductService.getAll(0, 100);
      setProducts(res.content || []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchSections();
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    if (!title) {
       toast({ title: 'Error', description: 'Title is required' });
       return;
    }

    try {
      await ContentService.create({ title, type, displayOrder, isActive, items });
      toast({ title: 'Success', description: 'Section created' });
      setIsModalOpen(false);
      fetchSections();
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create section' });
    }
  };

  const resetForm = () => {
    setTitle('');
    setType('CAROUSEL');
    setDisplayOrder(0);
    setIsActive(true);
    setItems([]);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this section and all its items?')) {
      try {
        await ContentService.delete(id);
        toast({ title: 'Success', description: 'Section deleted' });
        fetchSections();
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete' });
      }
    }
  };

  const addItem = () => {
    setItems([...items, { title: '', subtitle: '', imageUrl: '', linkUrl: '', displayOrder: items.length }]);
  };

  const updateItem = (index: number, field: keyof ContentItem, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const columns: ColumnDef<ContentSection>[] = [
    {
       accessorKey: 'title',
       header: 'Section Title',
       cell: ({ row }) => (
         <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">{row.original.title}</span>
         </div>
       )
    },
    {
       accessorKey: 'type',
       header: 'Section Type',
       cell: ({ row }) => (
         <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest bg-slate-50 border-slate-200">
           {row.original.type}
         </Badge>
       )
    },
    {
       accessorKey: 'items',
       header: 'Items',
       cell: ({ row }) => <span className="text-xs font-medium text-slate-500">{row.original.items?.length || 0} items</span>
    },
    {
       accessorKey: 'displayOrder',
       header: 'Order',
       cell: ({ row }) => <span className="font-bold text-slate-900">{row.original.displayOrder}</span>
    },
    {
       accessorKey: 'isActive',
       header: 'Status',
       cell: ({ row }) => (
         <Badge className={`rounded-full text-[10px] font-bold px-3 py-0.5 ${row.original.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
           {row.original.isActive ? 'Active' : 'Hidden'}
         </Badge>
       )
    }
  ];

  const handleEdit = (section: ContentSection) => {
    setTitle(section.title);
    setType(section.type as any);
    setDisplayOrder(section.displayOrder);
    setIsActive(section.isActive);
    setItems(section.items || []);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Content Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Design your storefront blocks and sections.</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-500/20 font-bold h-10 px-6"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Section
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-indigo-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
        </div>
      ) : (
        <CrudTable 
           data={sections} 
           columns={columns} 
           searchKey="sections"
           onEdit={handleEdit}
           onDelete={(s: any) => handleDelete(s.id)}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight">
              Section Designer
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Section Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Section Type</Label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAROUSEL">Carousel / Slider</SelectItem>
                    <SelectItem value="GRID">Product Grid</SelectItem>
                    <SelectItem value="BANNER">Strategic Banner</SelectItem>
                    <SelectItem value="NEWS">News Feed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Display Order</Label>
                <Input type="number" value={displayOrder} onChange={e => setDisplayOrder(parseInt(e.target.value))} className="rounded-xl" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center mb-6">
                  <Label className="font-black text-lg uppercase tracking-tight">Section Content Items</Label>
                  <Button variant="outline" size="sm" onClick={addItem} className="rounded-xl border-dashed">
                    <Plus className="h-4 w-4 mr-1" /> Add New Item
                  </Button>
               </div>

               <div className="space-y-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 relative group">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => removeItem(idx)}
                         className="absolute -top-3 -right-3 h-8 w-8 bg-white shadow-md border border-slate-200 text-rose-500 hover:bg-rose-50 rounded-full"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-1 space-y-4">
                             <div className="aspect-video rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                                {item.imageUrl ? <img src={item.imageUrl} className="h-full w-full object-cover" /> : <ImageIcon className="h-10 w-10 text-slate-200" />}
                             </div>
                             <Input 
                               placeholder="Image URL" 
                               value={item.imageUrl} 
                               onChange={e => updateItem(idx, 'imageUrl', e.target.value)}
                               className="rounded-xl text-xs h-9" 
                             />
                          </div>
                          
                          <div className="md:col-span-2 space-y-4">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                   <Label className="text-[10px] font-bold uppercase text-slate-400">Title</Label>
                                   <Input value={item.title} onChange={e => updateItem(idx, 'title', e.target.value)} className="h-9 rounded-xl" />
                                </div>
                                <div className="space-y-1">
                                   <Label className="text-[10px] font-bold uppercase text-slate-400">Subtitle/Description</Label>
                                   <Input value={item.subtitle} onChange={e => updateItem(idx, 'subtitle', e.target.value)} className="h-9 rounded-xl" />
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                   <Label className="text-[10px] font-bold uppercase text-slate-400">Resource Link (URL)</Label>
                                   <Input value={item.linkUrl} onChange={e => updateItem(idx, 'linkUrl', e.target.value)} placeholder="/category/shoes" className="h-9 rounded-xl" />
                                </div>
                                <div className="space-y-1">
                                   <Label className="text-[10px] font-bold uppercase text-slate-400">Quick Product Bind</Label>
                                   <div className="flex gap-2">
                                      <Input 
                                         value={item.productId || ''} 
                                         readOnly 
                                         placeholder="Not bound" 
                                         className="h-9 rounded-xl bg-slate-100 flex-1" 
                                      />
                                      <Button variant="outline" size="sm" onClick={() => setIsProductPickerOpen(idx)} className="h-9 rounded-xl">
                                         <PlusCircle className="h-4 w-4" />
                                      </Button>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl px-8">Cancel</Button>
            <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 font-bold shadow-lg shadow-indigo-500/20">Apply Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Picker */}
      <Dialog open={isProductPickerOpen !== null} onOpenChange={() => setIsProductPickerOpen(null)}>
        <DialogContent className="rounded-[2.5rem] sm:max-w-[400px]">
           <DialogHeader><DialogTitle>Pick Product</DialogTitle></DialogHeader>
           <div className="max-h-[350px] overflow-y-auto space-y-2 py-4">
              {products.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => {
                    if (isProductPickerOpen !== null) {
                      updateItem(isProductPickerOpen, 'productId', p.id);
                      updateItem(isProductPickerOpen, 'title', p.name);
                      updateItem(isProductPickerOpen, 'imageUrl', p.imageUrl);
                      setIsProductPickerOpen(null);
                    }
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-100 overflow-hidden">
                    {p.imageUrl && <img src={p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:8081${p.imageUrl}`} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{p.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black">ID: {p.id}</p>
                  </div>
                  <Plus className="h-4 w-4 text-indigo-500" />
                </div>
              ))}
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
