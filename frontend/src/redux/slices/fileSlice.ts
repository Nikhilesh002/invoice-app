import { Bill, Customer, Invoice, Products, UserFile } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



interface FileState {
  files: UserFile[];
  currentFile: UserFile | null;
  currentBill: Bill | null;
}

const initialState: FileState = {
  files: [],
  currentFile: null,
  currentBill: null
};

const fileSlice = createSlice({
  name: 'userfiles',
  initialState,
  reducers: {
    storeFiles: (state, action: PayloadAction<UserFile[]>) => {
      state.files = action.payload;
    },
    deleteFiles:(state,action:PayloadAction<string[]>)=>{
      state.files = state.files.filter(file=>!action.payload.includes(file.id || ''));
    },
    addFile: (state, action: PayloadAction<UserFile>) => {
      state.files.push(action.payload);
    },
    setCurrentFile: (state, action: PayloadAction<UserFile>) => {
      state.currentFile = action.payload;
    },
    setCurrentBill: (state, action: PayloadAction<Bill>) => {
      state.currentBill = action.payload;
    },
    updateBillInFile: (state, action: PayloadAction<{fileId: string, billId: string, updatedBill: Bill}>) => {
      const fileIndex = state.files.findIndex(file => file.id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill.id === action.payload.billId);
        if (billIndex !== -1) {
          state.files[fileIndex].bills[billIndex] = action.payload.updatedBill;
        }
      }
    },
    updateInvoice: (state, action: PayloadAction<{fileId: string, billId: string, invoice: Invoice}>) => {
      const fileIndex = state.files.findIndex(file => file.id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill.id === action.payload.billId);
        if (billIndex !== -1) {
          state.files[fileIndex].bills[billIndex].invoice = action.payload.invoice;
        }
      }
    },
    updateProduct: (state, action: PayloadAction<{fileId: string, billId: string, productIndex: number, product: Products}>) => {
      const fileIndex = state.files.findIndex(file => file.id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill.id === action.payload.billId);
        if (billIndex !== -1) {
          if (state.files[fileIndex].bills[billIndex].products) {
            state.files[fileIndex].bills[billIndex].products![action.payload.productIndex] = action.payload.product;
          }
        }
      }
    },
    updateCustomer: (state, action: PayloadAction<{fileId: string, billId: string, customer: Customer}>) => {
      const fileIndex = state.files.findIndex(file => file.id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill.id === action.payload.billId);
        if (billIndex !== -1) {
          state.files[fileIndex].bills[billIndex].customer = action.payload.customer;
        }
      }
    }
  }
});

export const {
  storeFiles,
  addFile,
  deleteFiles,
  setCurrentFile, 
  setCurrentBill,
  updateBillInFile,
  updateInvoice,
  updateProduct,
  updateCustomer
} = fileSlice.actions;

export default fileSlice.reducer;