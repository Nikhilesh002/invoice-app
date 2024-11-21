import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProductDetails } from '@/redux/slices/fileSlice';
import { Products } from '@/redux/slices/fileSlice';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';

interface ProductsTabProps {
  products: Products[] | null;
  isEditing: boolean;
  fileId?: string;
  billId?: string;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ 
  products, 
  isEditing, 
  fileId, 
  billId 
}) => {
  const dispatch = useDispatch();
  const [editedProducts, setEditedProducts] = useState<Products[]>(
    products?.length ? [...products] : 
    [{ 
      name: null, 
      quantity: null, 
      unit_price: null, 
      discount: null, 
      price_after_discount: null, 
      price_with_tax: null, 
      gst: null 
    }]
  );

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
        name: null, 
        quantity: null, 
        unit_price: null, 
        discount: null, 
        price_after_discount: null, 
        price_with_tax: null, 
        gst: null 
      }
    ]);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = editedProducts.filter((_, i) => i !== index);
    setEditedProducts(updatedProducts);
  };

  const handleSave = async () => {
    try {
      // Backend update
      await axios.put(`http://localhost:3217/api/bill/${billId}/products`, {
        products: editedProducts
      });

      // Redux update for each product
      editedProducts.forEach((product, index) => {
        dispatch(updateProductDetails({
          fileId: fileId!, 
          billId: billId!, 
          productIndex: index,
          productDetails: product
        }));
      });
    } catch (error) {
      console.error('Failed to update products', error);
    }
  };

  const renderValue = (value: string | null) => 
    value ? value : <span className="text-red-500">NA</span>;

  return (
    <div className="space-y-4">
      {isEditing ? (
        <>
          {editedProducts.map((product, index) => (
            <div key={index} className="border p-4 rounded relative">
              {editedProducts.length > 1 && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => removeProduct(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(product).map((key) => (
                  <div key={key} className="mb-2">
                    <label className="block mb-2 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <Input
                      value={product[key as keyof Products] || ''}
                      onChange={(e) => 
                        handleProductChange(
                          index, 
                          key as keyof Products, 
                          e.target.value
                        )
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
                {Object.entries(product).map(([key, value]) => (
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