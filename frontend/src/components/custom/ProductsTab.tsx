import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProducts } from '@/redux/slices/fileSlice';
import { Bill, Products } from '@/types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Trash2, Plus, Search } from 'lucide-react';
import { renderValue } from '@/lib/renderValue';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ProductsTabProps {
  currentBill: Bill;
  isEditing: boolean;
  fileId: string;
  billId: string;
  setIsEditing: (isEditing: boolean) => void
}

const ProductsTab: React.FC<ProductsTabProps> = ({
  currentBill,
  isEditing,
  fileId,
  billId,
  setIsEditing
}) => {
  const { products } = currentBill;

  const dispatch = useDispatch();

  const [editedProducts, setEditedProducts] = useState<Products[]>(products?.length ? [...products] : []);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sync the editedProducts state when currentBill changes
  useEffect(() => {
    setEditedProducts(products || []);
  }, [products]);

  const handleProductChange = (index: number, key: keyof Products, value: string) => {
    const updatedProducts = [...editedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [key]: value
    };
    setEditedProducts(updatedProducts);
  };

  const addProduct = () => {
    setEditedProducts([
      ...editedProducts,
      {
        _id: '',
        name: 'NA',
        quantity: -1,
        unit_price: -1,
        discount: -1,
        price_after_discount: -1,
        price_with_tax: -1,
        tax: -1
      }
    ]);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = editedProducts.filter((_, i) => i !== index);
    setEditedProducts(updatedProducts);
  };

  const handleSave = async () => {
    try {
      const updatedBill = {
        ...currentBill,
        products: editedProducts
      }
      // Redux update for products
      dispatch(updateProducts({
        fileId: fileId,
        billId: billId,
        products: editedProducts
      }));

      // Backend update
      toast.loading('Updating products...');
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/file/update-bill/${billId}`, updatedBill);
      toast.dismiss();
      setIsEditing(false);
      toast.success('Products updated successfully');
    } catch (error) {
      console.error('Failed to update products', error);
      toast.error('Failed to update products');
    }
    finally {
      toast.dismiss();
    }
  };

  // Filter products based on search term
  const filteredProducts = editedProducts.filter(product => 
    Object.values(product)
      .some(value => 
        value && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Get product keys for table headers (excluding _id)
  const productKeys = editedProducts.length > 0 
    ? Object.keys(editedProducts[0]).filter(key => key !== '_id') 
    : [];

  return (
    <div className="space-y-4 text-center">
      {isEditing ? (
        <>
          {/* Search input for editing mode */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Table for editing products */}
          <div className="overflow-x-auto ">
            <table className="w-full border-collapse ">
              <thead>
                <tr className="">
                  {productKeys.map(key => (
                    <th key={key} className="border p-2 capitalize">
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={index} className="">
                    {productKeys.map(key => (
                      <td key={key} className="border p-2">
                        <Input
                          type={key === 'name' ? 'text' : 'number'}
                          value={product[key as keyof Products] || ''}
                          onChange={(e) =>
                            handleProductChange(index, key as keyof Products, e.target.value)
                          }
                          className="w-full"
                        />
                      </td>
                    ))}
                    <td className="border p-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeProduct(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-4">
            <Button onClick={addProduct} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </>
      ) : (
        <>
          {/* Search input for view mode */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Table for viewing products */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="">
                  {productKeys.map(key => (
                    <th key={key} className="border p-2 capitalize">
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={index} className="">
                    {productKeys.map(key => (
                      <td key={key} className="border p-2">
                        {renderValue(product[key as keyof Products])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsTab;