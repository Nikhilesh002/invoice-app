import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProducts } from '@/redux/slices/fileSlice';
import { Bill, Products } from '@/types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Trash2, Plus } from 'lucide-react';
import { renderValue } from '@/lib/renderValue';
import axios from 'axios';

interface ProductsTabProps {
  currentBill: Bill;
  isEditing: boolean;
  fileId: string;
  billId: string;
}

const ProductsTab: React.FC<ProductsTabProps> = ({
  currentBill,
  isEditing,
  fileId,
  billId
}) => {
  const { products } = currentBill;

  const dispatch = useDispatch();

  const [editedProducts, setEditedProducts] = useState<Products[]>(products?.length ? [...products] : []);

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
      await axios.put(`${window.location.origin}/api/file/update-bill/${billId}`, updatedBill);
    } catch (error) {
      console.error('Failed to update products', error);
    }
  };

  return (
    <div className="space-y-4">
      {isEditing ? (
        <>
          {editedProducts?.length > 0 &&
            editedProducts.map((product, index) => (
              <div key={index} className="border p-4 rounded relative">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeProduct(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(product)
                    .filter((key) => key !== '_id')
                    .map((key) => (
                      <div key={key} className="mb-2">
                        <label className="block mb-2 capitalize">
                          {key.replace(/_/g, ' ')}
                        </label>
                        <Input
                          type={key === 'name' ? 'text' : 'number'}
                          value={product[key as keyof Products] || ''}
                          onChange={(e) =>
                            handleProductChange(index, key as keyof Products, e.target.value)
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          <div className="flex justify-between">
            <Button onClick={addProduct} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {editedProducts.map((product, index) => (
            <div key={index} className="border p-4 rounded">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product)
                  .filter(([key]) => key !== '_id')
                  .map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <strong className="capitalize">{key.replace(/_/g, ' ')}: </strong>
                      {renderValue(value)}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
